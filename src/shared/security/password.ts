import { hash } from 'bcryptjs';

/**
 * Hash a password using bcryptjs
 * Uses 12 salt rounds for security (same as AuthService)
 * 
 * @param password - Plain text password to hash
 * @returns Promise resolving to the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}
