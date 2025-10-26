import { NextResponse } from "next/server";
import { tarotService } from '@/src/modules/tarot/tarot.service';
import { validateChatMessageDto } from '@/src/modules/tarot/tarot.dto';
import { withErrorHandler } from '@/src/shared/middleware/error-handler';
import { ValidationError } from '@/src/shared/errors';

const handler = async (request: Request) => {
  const body = await request.json();
  
  // Validate input
  const validationResult = validateChatMessageDto(body);
  if (!validationResult.isValid) {
    throw new ValidationError('Invalid input', validationResult.errors);
  }

  // Generate chat response using tarot service
  const result = await tarotService.generateChatResponse(
    validationResult.data!.message,
    validationResult.data!.previousReading
  );
  
  return NextResponse.json({ aiResult: { result: result.response } });
};

export const POST = withErrorHandler(handler);
 