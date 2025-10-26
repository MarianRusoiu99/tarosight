// Re-export auth service for backward compatibility
import { authService } from '@/src/modules/auth/auth.service';
import { userService } from '@/src/modules/user/user.service';

// Re-export auth functions from auth service
export const hashPassword = (password: string) => authService.hashPassword(password);
export const verifyPassword = (password: string, hashedPassword: string) => authService.verifyPassword(password, hashedPassword);
export const generateToken = (userId: string) => authService.generateToken(userId);
export const verifyToken = (token: string) => authService.verifyToken(token);

// Re-export user token management functions from user service

/**
 * Get user token balance as a number
 * Delegates to userService.getUserTokenBalance for simplified API
 */
export async function getUserTokens(userId: string) {
  return userService.getUserTokenBalance(userId);
}

export async function deductTokens(userId: string, amount: number) {
  const result = await userService.deductTokens(userId, amount);
  // Return user object format for backward compatibility
  return { id: userId, tokens: result.newBalance };
} 