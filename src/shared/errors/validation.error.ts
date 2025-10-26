import { AppError } from './base.error';

export class ValidationError extends AppError {
  constructor(
    message: string = 'Validation failed',
    errors?: Record<string, string>
  ) {
    super(message, 400, { errors });
  }
}
