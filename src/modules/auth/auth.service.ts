import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '@/src/infrastructure/config/auth';
import { AuthenticationError, ValidationError } from '@/src/shared/errors';
import { authRepository } from './auth.repository';
import type { JwtPayload, AuthUser } from './auth.types';
import type { LoginDto, RegisterDto } from './auth.dto';

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return hash(password, 12);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  generateToken(userId: string): string {
    return jwt.sign({ userId }, AUTH_CONFIG.jwtSecret, {
      expiresIn: AUTH_CONFIG.tokenExpiry,
    });
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, AUTH_CONFIG.jwtSecret) as JwtPayload;
    } catch {
      return null;
    }
  }

  async login(loginDto: LoginDto): Promise<{ user: AuthUser, token: string }> {
    // Find user by username
    const user = await authRepository.findByUsername(loginDto.username);

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user.id);

    // Return user without passwordHash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async register(registerDto: RegisterDto): Promise<{ user: AuthUser, token: string }> {
    // Check if user already exists
    const userExists = await authRepository.checkUserExists(
      registerDto.email,
      registerDto.username
    );

    if (userExists) {
      throw new ValidationError('User already exists', { 
        email: 'Email or username already in use', 
        username: 'Email or username already in use' 
      });
    }

    // Hash password
    const hashedPassword = await this.hashPassword(registerDto.password);

    // Create user
    const user = await authRepository.createUser(
      registerDto.email,
      registerDto.username,
      hashedPassword,
      AUTH_CONFIG.registrationTokens
    );

    // Generate token
    const token = this.generateToken(user.id);

    return {
      user,
      token,
    };
  }
}

export const authService = new AuthService();
