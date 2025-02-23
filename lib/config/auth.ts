export const AUTH_CONFIG = {
  cookieName: 'auth',
  cookieMaxAge: 60 * 60, // 1 hour
  defaultCredentials: {
    username: process.env.DEFAULT_USERNAME || 'user',
    password: process.env.DEFAULT_PASSWORD || 'password',
  },
  jwtSecret: process.env.JWT_SECRET!,
  tokenExpiry: '24h',
  readingCost: 1, // Cost in tokens per reading
  registrationTokens: 5, // Free tokens for new users
} as const; 