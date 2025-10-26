/**
 * User Module DTOs and Validation Functions
 * 
 * Provides data transfer objects and validation for user operations.
 */

/**
 * DTO for getting user information
 */
export interface GetUserDto {
  userId: string;
}

/**
 * DTO for updating user profile
 */
export interface UpdateProfileDto {
  userId: string;
  email?: string;
  username?: string;
  profileImage?: string | null;
}

/**
 * DTO for token operations
 */
export interface TokenOperationDto {
  userId: string;
  amount: number;
}

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  error?: string;
}

/**
 * Validate GetUserDto
 */
export function validateGetUserDto(data: unknown): ValidationResult<GetUserDto> {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Invalid data format' };
  }

  const { userId } = data as Record<string, unknown>;

  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return { isValid: false, error: 'User ID is required' };
  }

  return {
    isValid: true,
    data: { userId: userId.trim() }
  };
}

/**
 * Validate UpdateProfileDto
 */
export function validateUpdateProfileDto(data: unknown): ValidationResult<UpdateProfileDto> {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Invalid data format' };
  }

  const { userId, email, username, profileImage } = data as Record<string, unknown>;

  // userId is required
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return { isValid: false, error: 'User ID is required' };
  }

  // At least one field to update is required
  if (email === undefined && username === undefined && profileImage === undefined) {
    return { isValid: false, error: 'At least one field to update is required' };
  }

  const dto: UpdateProfileDto = { userId: userId.trim() };

  // Validate email if provided
  if (email !== undefined) {
    if (typeof email !== 'string' || email.trim() === '') {
      return { isValid: false, error: 'Email must be a non-empty string' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    dto.email = email.toLowerCase().trim(); // Normalize email
  }

  // Validate username if provided
  if (username !== undefined) {
    if (typeof username !== 'string' || username.trim() === '') {
      return { isValid: false, error: 'Username must be a non-empty string' };
    }
    if (username.trim().length < 3) {
      return { isValid: false, error: 'Username must be at least 3 characters long' };
    }
    dto.username = username.trim();
  }

  // Validate profileImage if provided
  if (profileImage !== undefined) {
    if (profileImage !== null && typeof profileImage !== 'string') {
      return { isValid: false, error: 'Profile image must be a string or null' };
    }
    dto.profileImage = profileImage === null ? null : profileImage.trim();
  }

  return { isValid: true, data: dto };
}

/**
 * Validate TokenOperationDto
 */
export function validateTokenOperationDto(data: unknown): ValidationResult<TokenOperationDto> {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Invalid data format' };
  }

  const { userId, amount } = data as Record<string, unknown>;

  // Validate userId
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return { isValid: false, error: 'User ID is required' };
  }

  // Validate amount
  if (typeof amount !== 'number') {
    return { isValid: false, error: 'Amount must be a number' };
  }

  if (!Number.isInteger(amount)) {
    return { isValid: false, error: 'Amount must be an integer' };
  }

  if (amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }

  return {
    isValid: true,
    data: {
      userId: userId.trim(),
      amount
    }
  };
}
