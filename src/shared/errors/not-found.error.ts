import { AppError } from './base.error';

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = `${resource}${identifier ? ` with ID ${identifier}` : ''} not found`;
    super(message, 404, { resource, identifier });
  }
}
