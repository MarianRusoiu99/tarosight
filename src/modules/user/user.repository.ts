/**
 * User Repository
 * 
 * Handles all database operations related to users.
 */

import { prisma } from '@/src/infrastructure/database/prisma.client';
import { User, UserTokenInfo, UserProfile } from './user.types';

export class UserRepository {
  /**
   * Find user by ID
   */
  async findById(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    return user;
  }

  /**
   * Get user token information
   */
  async getUserTokens(userId: string): Promise<UserTokenInfo | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        tokens: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      username: user.username,
      tokens: user.tokens,
    };
  }

  /**
   * Update user tokens using atomic operations
   * @param userId - User ID
   * @param amount - Amount to increment or decrement
   * @param operation - 'increment' or 'decrement'
   */
  async updateTokens(
    userId: string,
    amount: number,
    operation: 'increment' | 'decrement'
  ): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { 
          tokens: { [operation]: amount } 
        },
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

      return user;
    } catch (error: unknown) {
      // Handle P2025 error (record not found)
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        throw new Error(`User with ID ${userId} not found`);
      }
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: {
      email?: string;
      username?: string;
      profileImage?: string | null;
    }
  ): Promise<User | null> {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
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

    return user;
  }

  /**
   * Check if email exists (excluding specific user)
   */
  async checkEmailExists(
    email: string,
    excludeUserId?: string
  ): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        email,
        ...(excludeUserId && { id: { not: excludeUserId } }),
      },
    });

    return !!user;
  }

  /**
   * Check if username exists (excluding specific user)
   */
  async checkUsernameExists(
    username: string,
    excludeUserId?: string
  ): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        username,
        ...(excludeUserId && { id: { not: excludeUserId } }),
      },
    });

    return !!user;
  }
}

export const userRepository = new UserRepository();
