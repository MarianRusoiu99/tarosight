export const AUTH_CONFIG = {
  cookieName: 'auth',
  cookieMaxAge: 60 * 60 * 24, // 24 hours (must match tokenExpiry for consistent session duration)
  defaultCredentials: {
    username: process.env.DEFAULT_USERNAME || 'user',
    password: process.env.DEFAULT_PASSWORD || 'password',
  },
  jwtSecret: process.env.JWT_SECRET!,
  tokenExpiry: '24h', // 24 hours (must match cookieMaxAge)
  readingCost: 1, // Cost in tokens per reading
  registrationTokens: 5, // Free tokens for new users
} as const; 