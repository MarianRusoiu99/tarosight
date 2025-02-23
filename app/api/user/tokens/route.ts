import { NextResponse } from "next/server";
import { verifyToken, getUserTokens } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    const tokens = await getUserTokens(payload.userId);
    return NextResponse.json({ tokens });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching token balance" },
      { status: 500 }
    );
  }
} 