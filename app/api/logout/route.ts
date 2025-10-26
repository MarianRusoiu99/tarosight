import { NextResponse } from "next/server";
import { AUTH_CONFIG } from '@/src/infrastructure/config/auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Delete the auth cookie
  response.cookies.delete(AUTH_CONFIG.cookieName);
  return response;
} 