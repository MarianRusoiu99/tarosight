/**
 * Tarot Module DTOs and Validation Functions
 * 
 * Provides data transfer objects and validation for tarot operations.
 */

/**
 * DTO for reading generation requests
 */
export interface GenerateReadingDto {
  userId: string;
}

/**
 * DTO for chat requests
 */
export interface ChatMessageDto {
  message: string;
  previousReading?: string;
}

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Validate GenerateReadingDto
 */
export function validateGenerateReadingDto(data: unknown): ValidationResult<GenerateReadingDto> {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: { _general: 'Invalid data format' } };
  }

  const { userId } = data as Record<string, unknown>;

  const errors: Record<string, string> = {};

  // Validate userId
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    errors.userId = 'User ID is required';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    data: { userId: userId as string }
  };
}

/**
 * Validate ChatMessageDto
 */
export function validateChatMessageDto(data: unknown): ValidationResult<ChatMessageDto> {
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: { _general: 'Invalid data format' } };
  }

  const { message, previousReading } = data as Record<string, unknown>;

  const errors: Record<string, string> = {};

  // Validate message
  if (!message || typeof message !== 'string' || message.trim() === '') {
    errors.message = 'Message is required and must be a non-empty string';
  } else if (message.trim().length < 1) {
    errors.message = 'Message must be at least 1 character long';
  }

  // Validate previousReading (optional)
  if (previousReading !== undefined && typeof previousReading !== 'string') {
    errors.previousReading = 'Previous reading must be a string';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    data: {
      message: (message as string).trim(),
      previousReading: previousReading ? (previousReading as string) : undefined
    }
  };
}
