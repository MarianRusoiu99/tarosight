/**
 * User Service
 * 
 * Contains business logic for user management operations.
 */

import { userRepository } from './user.repository';
import { prisma } from '@/src/infrastructure/database/prisma.client';
import { InsufficientTokensError, NotFoundError, ValidationError } from '@/src/shared/errors';
import {
  User,
  UserTokenInfo,
  UserProfile,
  TokenTransaction,
} from './user.types';
import { UpdateProfileDto } from './user.dto';

export class UserService {
  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    return userRepository.findById(userId);
  }

  /**
   * Get user token information
   */
  async getUserTokens(userId: string): Promise<UserTokenInfo | null> {
    return userRepository.getUserTokens(userId);
  }

  /**
   * Get user token balance as a number
   * Convenience method that returns just the token count
   */
  async getUserTokenBalance(userId: string): Promise<number> {
    const tokenInfo = await userRepository.getUserTokens(userId);
    return tokenInfo?.tokens ?? 0;
  }

  /**
   * Deduct tokens from user balance
   * Uses Prisma transaction to ensure atomic operation with non-negative balance enforcement
   */
  async deductTokens(
    userId: string,
    amount: number
  ): Promise<TokenTransaction> {
    // Validate amount
    if (amount <= 0) {
      throw new Error('Invalid token amount');
    }

    // Use transaction to check balance and update atomically
    const result = await prisma.$transaction(async (tx) => {
      // Get current token balance within transaction
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { tokens: true },
      });

      if (!user) {
        throw new NotFoundError('User', userId);
      }

      // Check if user has enough tokens
      if (user.tokens < amount) {
        throw new InsufficientTokensError(amount, user.tokens);
      }

      const previousBalance = user.tokens;

      // Update tokens using atomic decrement
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { tokens: { decrement: amount } },
        select: {
          id: true,
          email: true,
          username: true,
          profileImage: true,
          tokens: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return { updatedUser, previousBalance };
    });

    // Create transaction record
    const transaction: TokenTransaction = {
      userId,
      amount,
      operation: 'deduct',
      timestamp: new Date(),
      previousBalance: result.previousBalance,
      newBalance: result.updatedUser.tokens,
    };

    return transaction;
  }

  /**
   * Add tokens to user balance
   * Uses atomic increment operation
   */
  async addTokens(
    userId: string,
    amount: number
  ): Promise<TokenTransaction> {
    // Validate amount
    if (amount <= 0) {
      throw new Error('Invalid token amount');
    }

    // Get current token balance for transaction record
    const tokenInfo = await userRepository.getUserTokens(userId);
    if (!tokenInfo) {
      throw new NotFoundError('User', userId);
    }

    const previousBalance = tokenInfo.tokens;

    // Update tokens using atomic increment
    const updatedUser = await userRepository.updateTokens(userId, amount, 'increment');

    // Create transaction record
    const transaction: TokenTransaction = {
      userId,
      amount,
      operation: 'add',
      timestamp: new Date(),
      previousBalance,
      newBalance: updatedUser.tokens,
    };

    return transaction;
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return userRepository.getUserProfile(userId);
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    updateDto: UpdateProfileDto
  ): Promise<User> {
    const { userId, email, username, profileImage } = updateDto;

    // Check if user exists
    const existingUser = await userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundError('User', userId);
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingUser.email) {
      const emailExists = await userRepository.checkEmailExists(email, userId);
      if (emailExists) {
        throw new ValidationError('Email already in use', { email: 'Email already in use' });
      }
    }

    // Check if username is being changed and if it already exists
    if (username && username !== existingUser.username) {
      const usernameExists = await userRepository.checkUsernameExists(username, userId);
      if (usernameExists) {
        throw new ValidationError('Username already in use', { username: 'Username already in use' });
      }
    }

    // Update profile
    const updateData: {
      email?: string;
      username?: string;
      profileImage?: string | null;
    } = {};

    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const updatedUser = await userRepository.updateProfile(userId, updateData);
    if (!updatedUser) {
      throw new Error('Failed to update profile');
    }

    return updatedUser;
  }
}

export const userService = new UserService();
