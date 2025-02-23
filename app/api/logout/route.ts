import { NextResponse } from "next/server";
import { AUTH_CONFIG } from '@/lib/config/auth';

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });
  // Delete the auth cookie
  response.cookies.delete(AUTH_CONFIG.cookieName, { path: "/" });
  return response;
} 