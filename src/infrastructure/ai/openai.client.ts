import { AI_CONFIG } from '@/src/infrastructure/config/ai';
import { ExternalServiceError } from '@/src/shared/errors';

export interface OpenAIGenerateOptions {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

export interface OpenAIClientOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

export class OpenAIClient {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = AI_CONFIG.openai.apiKey;
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required. Set OPENAI_API_KEY environment variable.');
    }
  }

  async generateCompletion(
    prompt: string,
    options?: Partial<OpenAIGenerateOptions>,
    clientOptions?: OpenAIClientOptions
  ): Promise<string> {
    try {
      const requestOptions = {
        temperature: options?.temperature ?? AI_CONFIG.temperature,
        top_p: options?.top_p ?? AI_CONFIG.topP,
        max_tokens: options?.max_tokens ?? AI_CONFIG.openai.maxTokens,
      };

      const timeoutMs = clientOptions?.timeoutMs ?? 120000;
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

      const signal = clientOptions?.signal || timeoutController.signal;

      try {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: AI_CONFIG.openai.model,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: requestOptions.temperature,
            top_p: requestOptions.top_p,
            max_tokens: requestOptions.max_tokens,
          }),
          signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenAI API error:', errorText);
          throw new ExternalServiceError('OpenAI', `API returned ${response.status} ${response.statusText}`, new Error(errorText));
        }

        const result = await response.json();

        if (!result.choices?.[0]?.message?.content) {
          console.error('Invalid OpenAI response:', result);
          throw new ExternalServiceError('OpenAI', 'API returned invalid response structure');
        }

        return result.choices[0].message.content;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      if (error instanceof ExternalServiceError) {
        throw error;
      }
      if (error instanceof Error) {
        console.error('OpenAI client error:', error.message);
        throw new ExternalServiceError('OpenAI', error.message, error);
      }
      console.error('Unknown OpenAI client error:', error);
      throw new ExternalServiceError('OpenAI', 'Unknown error occurred', error instanceof Error ? error : undefined);
    }
  }

  async streamCompletion(
    prompt: string,
    options?: Partial<OpenAIGenerateOptions>,
    clientOptions?: OpenAIClientOptions
  ): Promise<ReadableStream> {
    try {
      const requestOptions = {
        temperature: options?.temperature ?? AI_CONFIG.temperature,
        top_p: options?.top_p ?? AI_CONFIG.topP,
        max_tokens: options?.max_tokens ?? AI_CONFIG.openai.maxTokens,
      };

      const timeoutMs = clientOptions?.timeoutMs ?? 120000;
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

      const signal = clientOptions?.signal || timeoutController.signal;

      try {
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: AI_CONFIG.openai.model,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: requestOptions.temperature,
            top_p: requestOptions.top_p,
            max_tokens: requestOptions.max_tokens,
            stream: true,
          }),
          signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenAI API error:', errorText);
          throw new ExternalServiceError('OpenAI', `API returned ${response.status} ${response.statusText}`, new Error(errorText));
        }

        if (!response.body) {
          throw new ExternalServiceError('OpenAI', 'API response missing readable stream');
        }

        return response.body;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      if (error instanceof ExternalServiceError) {
        throw error;
      }
      if (error instanceof Error) {
        console.error('OpenAI stream client error:', error.message);
        throw new ExternalServiceError('OpenAI', error.message, error);
      }
      console.error('Unknown OpenAI stream client error:', error);
      throw new ExternalServiceError('OpenAI', 'Unknown error occurred while streaming', error instanceof Error ? error : undefined);
    }
  }
}

export const openaiClient = new OpenAIClient();
