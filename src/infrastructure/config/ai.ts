/**
 * AI Provider Configuration
 * Supports both Ollama (local) and OpenAI (cloud) providers
 */

export type AIProvider = 'ollama' | 'openai';

const temperature = Number(process.env.AI_TEMPERATURE);
const topP = Number(process.env.AI_TOP_P);

export const AI_CONFIG = {
  // Provider selection - defaults to 'ollama'
  provider: (process.env.AI_PROVIDER as AIProvider) || 'ollama',
  
  // Common settings
  temperature: temperature || 0.7,
  topP: topP || 0.9,
  
  // Ollama-specific settings
  ollama: {
    apiUrl: process.env.OLLAMA_API_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3.2',
  },
  
  // OpenAI-specific settings
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    maxTokens: Number(process.env.OPENAI_MAX_TOKENS) || 2000,
  },
} as const;

// Backward compatibility - keep OLLAMA_CONFIG for existing code
export const OLLAMA_CONFIG = {
  apiUrl: AI_CONFIG.ollama.apiUrl,
  model: AI_CONFIG.ollama.model,
  temperature: AI_CONFIG.temperature,
  top_p: AI_CONFIG.topP,
} as const;
