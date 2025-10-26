import { NextResponse } from "next/server";
import { userService } from '@/src/modules/user/user.service';
import { withErrorHandler } from '@/src/shared/middleware/error-handler';
import { requireAuth } from '@/src/shared/middleware/auth.middleware';

const handler = async () => {
  // Verify authentication
  const { userId } = await requireAuth();

  // Get user token balance
  const tokenBalance = await userService.getUserTokenBalance(userId);

  return NextResponse.json({ tokens: tokenBalance });
};

export const GET = withErrorHandler(handler);
 