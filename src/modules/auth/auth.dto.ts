export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface ValidationError {
  errors: Record<string, string>;
}

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export function validateLoginDto(data: unknown): ValidationResult<LoginDto> {
  const errors: Record<string, string> = {};

  if (typeof data !== 'object' || data === null) {
    return { isValid: false, errors: { _form: 'Invalid input data' } };
  }

  const input = data as Record<string, unknown>;

  // Validate username
  if (typeof input.username !== 'string' || input.username.trim() === '') {
    errors.username = 'Username is required';
  }

  // Validate password
  if (typeof input.password !== 'string' || input.password.trim() === '') {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    data: {
      username: (input.username as string).trim(),
      password: input.password as string,
    },
  };
}

export function validateRegisterDto(data: unknown): ValidationResult<RegisterDto> {
  const errors: Record<string, string> = {};

  if (typeof data !== 'object' || data === null) {
    return { isValid: false, errors: { _form: 'Invalid input data' } };
  }

  const input = data as Record<string, unknown>;

  // Validate email
  if (typeof input.email !== 'string' || input.email.trim() === '') {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      errors.email = 'Invalid email format';
    }
  }

  // Validate username
  if (typeof input.username !== 'string' || input.username.trim() === '') {
    errors.username = 'Username is required';
  } else if (input.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  }

  // Validate password
  if (typeof input.password !== 'string' || input.password.trim() === '') {
    errors.password = 'Password is required';
  } else if (input.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    data: {
      email: (input.email as string).trim().toLowerCase(), // Normalize to lowercase for consistency
      username: (input.username as string).trim(),
      password: input.password as string,
    },
  };
}
