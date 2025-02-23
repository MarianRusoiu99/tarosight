import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from './config/auth';
import { prisma } from './prisma';

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export function generateToken(userId: string) {
  return jwt.sign({ userId }, AUTH_CONFIG.jwtSecret, {
    expiresIn: AUTH_CONFIG.tokenExpiry,
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, AUTH_CONFIG.jwtSecret) as { userId: string };
  } catch {
    return null;
  }
}

export async function getUserTokens(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokens: true },
  });
  return user?.tokens ?? 0;
}

export async function deductTokens(userId: string, amount: number) {
  return prisma.user.update({
    where: { id: userId },
    data: { tokens: { decrement: amount } },
  });
} 