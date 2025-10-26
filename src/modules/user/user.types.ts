/**
 * User Module Type Definitions
 * 
 * Defines types for user management, profiles, and token operations.
 */

/**
 * Core User type representing a user in the system
 */
export interface User {
  id: string;
  email: string;
  username: string;
  profileImage?: string | null;
  tokens: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User token information
 */
export interface UserTokenInfo {
  userId: string;
  tokens: number;
  username: string;
}

/**
 * User profile information (excludes sensitive data)
 */
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  profileImage?: string | null;
  tokens: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Token transaction record for tracking token operations
 */
export interface TokenTransaction {
  userId: string;
  amount: number;
  operation: 'deduct' | 'add';
  timestamp: Date;
  previousBalance: number;
  newBalance: number;
}

/**
 * Result of a token operation
 */
export interface TokenOperationResult {
  success: boolean;
  newBalance: number;
  transaction?: TokenTransaction;
}
