import { AppError } from './base.error';

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, originalError?: Error) {
    const fullMessage = `${service} service error: ${message}`;
    super(fullMessage, 502, { service, originalError: originalError?.message });
  }
}
