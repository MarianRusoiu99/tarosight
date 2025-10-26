import { OLLAMA_CONFIG } from '@/src/infrastructure/config/ollama';
import { ExternalServiceError } from '@/src/shared/errors';

export interface OllamaGenerateOptions {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stop?: string[];
}

export interface OllamaClientOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface OllamaResponse {
  response: string;
}

export class OllamaClient {
  async generateCompletion(
    prompt: string, 
    options?: Partial<OllamaGenerateOptions>,
    clientOptions?: OllamaClientOptions
  ): Promise<string> {
    try {
      // Merge default options from config with provided options
      const requestOptions = {
        temperature: OLLAMA_CONFIG.temperature,
        top_p: OLLAMA_CONFIG.top_p,
        ...options
      };

      // Create timeout controller if timeout is specified
      const timeoutMs = clientOptions?.timeoutMs ?? 120000; // Default 2 minutes
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

      // Use provided signal or timeout signal
      const signal = clientOptions?.signal || timeoutController.signal;

      try {
        const response = await fetch(`${OLLAMA_CONFIG.apiUrl}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: OLLAMA_CONFIG.model,
            prompt: prompt,
            stream: false,
            options: requestOptions
          }),
          signal,
        });

        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Ollama API error:', errorText);
          throw new ExternalServiceError('Ollama', `API returned ${response.status} ${response.statusText}`, new Error(errorText));
        }

        const result: OllamaResponse = await response.json();
        
        if (!result.response) {
          console.error('Invalid Ollama response:', result);
          throw new ExternalServiceError('Ollama', 'API returned invalid response structure');
        }

        return result.response;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ollama client error:', error.message);
        throw error;
      }
      console.error('Unknown Ollama client error:', error);
      throw new ExternalServiceError('Ollama', 'Unknown error occurred', error instanceof Error ? error : undefined);
    }
  }

  async streamCompletion(
    prompt: string, 
    options?: Partial<OllamaGenerateOptions>,
    clientOptions?: OllamaClientOptions
  ): Promise<ReadableStream> {
    try {
      // Merge default options from config with provided options
      const requestOptions = {
        temperature: OLLAMA_CONFIG.temperature,
        top_p: OLLAMA_CONFIG.top_p,
        ...options
      };

      // Create timeout controller if timeout is specified
      const timeoutMs = clientOptions?.timeoutMs ?? 120000; // Default 2 minutes
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

      // Use provided signal or timeout signal
      const signal = clientOptions?.signal || timeoutController.signal;

      try {
        const response = await fetch(`${OLLAMA_CONFIG.apiUrl}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: OLLAMA_CONFIG.model,
            prompt: prompt,
            stream: true,
            options: requestOptions
          }),
          signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Ollama API error:', errorText);
          throw new ExternalServiceError('Ollama', `API returned ${response.status} ${response.statusText}`, new Error(errorText));
        }

        if (!response.body) {
          throw new ExternalServiceError('Ollama', 'API response missing readable stream');
        }

        return response.body;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ollama stream client error:', error.message);
        throw error;
      }
      console.error('Unknown Ollama stream client error:', error);
      throw new ExternalServiceError('Ollama', 'Unknown error occurred while streaming', error instanceof Error ? error : undefined);
    }
  }
}

// Export singleton instance for easy consumption
export const ollamaClient = new OllamaClient();