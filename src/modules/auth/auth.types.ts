export interface AuthUser {
  id: string;
  username: string;
  email: string;
  tokens: number;
  profileImage: string | null;
  createdAt: Date;
}

export interface JwtPayload {
  userId: string;
}

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge: number;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
}
