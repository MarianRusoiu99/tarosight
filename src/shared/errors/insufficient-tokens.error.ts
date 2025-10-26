import { AppError } from './base.error';

export class InsufficientTokensError extends AppError {
  constructor(required: number, available: number) {
    super('Insufficient tokens', 403, { required, available });
  }
}
