import { NextResponse } from 'next/server';
import { AppError } from '@/src/shared/errors';

type ApiHandler = (
  request: Request,
  context?: unknown
) => Promise<NextResponse>;

interface ErrorResponse {
  message: string;
  errors?: Record<string, string>;
  details?: Record<string, unknown>;
}

export function withErrorHandler(
  handler: ApiHandler
): ApiHandler {
  return async (request: Request, context?: unknown) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof AppError) {
        const errorResponse: ErrorResponse = {
          message: error.message,
        };

        if (error.details?.errors) {
          errorResponse.errors = error.details.errors as Record<string, string>;
        }

        if (error.isOperational) {
          console.info(`[${error.name}] ${error.message}`, error.details);
        } else {
          console.error(`[${error.name}] ${error.message}`, error.stack);
        }

        return NextResponse.json(errorResponse, { status: error.statusCode });
      }

      if (error instanceof Error) {
        console.error('[UnexpectedError]', error.stack);
        return NextResponse.json(
          { message: 'An unexpected error occurred' },
          { status: 500 }
        );
      }

      console.error('[UnknownError]', error);
      return NextResponse.json(
        { message: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  };
}
