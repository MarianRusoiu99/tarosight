import { AI_CONFIG } from '@/src/infrastructure/config/ai';
import { ollamaClient } from './ollama.client';
import { openaiClient } from './openai.client';

export interface AIGenerateOptions {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

export interface AIClientOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface IAIClient {
  generateCompletion(
    prompt: string,
    options?: Partial<AIGenerateOptions>,
    clientOptions?: AIClientOptions
  ): Promise<string>;

  streamCompletion(
    prompt: string,
    options?: Partial<AIGenerateOptions>,
    clientOptions?: AIClientOptions
  ): Promise<ReadableStream>;
}

class AIClientFactory {
  private getClient(): IAIClient {
    const provider = AI_CONFIG.provider;
    
    switch (provider) {
      case 'ollama':
        return ollamaClient;
      case 'openai':
        return openaiClient;
      default:
        console.warn(`Unknown AI provider: ${provider}, falling back to ollama`);
        return ollamaClient;
    }
  }

  async generateCompletion(
    prompt: string,
    options?: Partial<AIGenerateOptions>,
    clientOptions?: AIClientOptions
  ): Promise<string> {
    const client = this.getClient();
    return client.generateCompletion(prompt, options, clientOptions);
  }

  async streamCompletion(
    prompt: string,
    options?: Partial<AIGenerateOptions>,
    clientOptions?: AIClientOptions
  ): Promise<ReadableStream> {
    const client = this.getClient();
    return client.streamCompletion(prompt, options, clientOptions);
  }
}

export const aiClient = new AIClientFactory();
