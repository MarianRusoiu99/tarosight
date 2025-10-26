import { NextResponse } from "next/server";
import { authService } from "@/src/modules/auth/auth.service";
import { validateRegisterDto } from "@/src/modules/auth/auth.dto";
import { AUTH_CONFIG } from "@/src/infrastructure/config/auth";
import { withErrorHandler } from "@/src/shared/middleware/error-handler";
import { ValidationError } from "@/src/shared/errors";

const handler = async (request: Request) => {
  const body = await request.json();

  // Validate input
  const validationResult = validateRegisterDto(body);
  if (!validationResult.isValid) {
    throw new ValidationError('Invalid input', validationResult.errors);
  }

  // Perform registration
  const result = await authService.register(validationResult.data!);

  // Create response with user data
  // Note: `success: true` is intentionally included for auth flows for consistency with existing API consumers
  const response = NextResponse.json({
    success: true,
    user: result.user,
  });

  // Set cookie with standardized configuration
  response.cookies.set(AUTH_CONFIG.cookieName, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: AUTH_CONFIG.cookieMaxAge,
  });

  return response;
};

export const POST = withErrorHandler(handler);
 