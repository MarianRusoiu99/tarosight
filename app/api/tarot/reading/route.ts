import { NextResponse } from "next/server";
import { tarotService } from '@/src/modules/tarot/tarot.service';
import { withErrorHandler } from '@/src/shared/middleware/error-handler';
import { requireAuth } from '@/src/shared/middleware/auth.middleware';

const handler = async () => {
  // Verify authentication
  const { userId } = await requireAuth();

  // Generate reading using tarot service
  const result = await tarotService.generateReading(userId);
  
  return NextResponse.json({
    reading: result.reading,
    aiResult: { result: result.aiReading },
    remainingTokens: result.remainingTokens,
  });
};

export const POST = withErrorHandler(handler);
 