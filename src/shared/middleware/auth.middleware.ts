import { cookies } from 'next/headers';
import { authService } from '@/src/modules/auth/auth.service';
import { AUTH_CONFIG } from '@/src/infrastructure/config/auth';
import { AuthenticationError } from '@/src/shared/errors';

export interface AuthPayload {
  userId: string;
}

export async function requireAuth(): Promise<AuthPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_CONFIG.cookieName)?.value;

  if (!token) {
    throw new AuthenticationError('Authentication required');
  }

  const payload = authService.verifyToken(token);
  if (!payload) {
    throw new AuthenticationError('Invalid or expired token');
  }

  return payload as AuthPayload;
}

export async function optionalAuth(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_CONFIG.cookieName)?.value;

  if (!token) {
    return null;
  }

  const payload = authService.verifyToken(token);
  if (!payload) {
    return null;
  }

  return payload as AuthPayload;
}
