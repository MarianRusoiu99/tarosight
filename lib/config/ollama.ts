export const OLLAMA_CONFIG = {
  apiUrl: process.env.OLLAMA_API_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'openthinker:latest',
  temperature: Number(process.env.OLLAMA_TEMPERATURE) || 0.7,
  top_p: Number(process.env.OLLAMA_TOP_P) || 0.9,
} as const; 