import { prisma } from '@/src/infrastructure/database/prisma.client';
import type { AuthUser } from './auth.types';

export class AuthRepository {
  async findByUsername(username: string): Promise<(AuthUser & { passwordHash: string }) | null> {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        tokens: true,
        profileImage: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<(AuthUser & { passwordHash: string }) | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        tokens: true,
        profileImage: true,
        createdAt: true,
      },
    });

    return user;
  }

  async checkUserExists(email: string, username: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: { id: true },
    });

    return user !== null;
  }

  async createUser(
    email: string,
    username: string,
    passwordHash: string,
    initialTokens: number
  ): Promise<AuthUser> {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        tokens: initialTokens,
      },
      select: {
        id: true,
        username: true,
        email: true,
        tokens: true,
        profileImage: true,
        createdAt: true,
      },
    });

    return user;
  }
}

export const authRepository = new AuthRepository();
