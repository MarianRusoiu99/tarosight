# AI Provider Configuration Guide

TaroSight supports two AI providers for generating tarot readings:

1. **Ollama** (default) - Local AI model
2. **OpenAI** - Cloud-based AI API

## Switching Between Providers

Edit your `.env` file and set the `AI_PROVIDER` variable:

```bash
# Use Ollama (local)
AI_PROVIDER="ollama"

# OR use OpenAI (cloud)
AI_PROVIDER="openai"
```

## Ollama Configuration (Local AI)

**Advantages:**
- Free and unlimited
- Data stays local
- No API key required
- Works offline

**Setup:**

1. Install Ollama from https://ollama.com
2. Pull a model: `ollama pull llama3.2`
3. Configure in `.env` (optional, defaults shown):
   ```bash
   AI_PROVIDER="ollama"
   OLLAMA_API_URL="http://localhost:11434"
   OLLAMA_MODEL="llama3.2"
   ```

## OpenAI Configuration (Cloud AI)

**Advantages:**
- More powerful models (GPT-4)
- No local setup required
- Better response quality

**Setup:**

1. Get an API key from https://platform.openai.com/api-keys
2. Configure in `.env`:
   ```bash
   AI_PROVIDER="openai"
   OPENAI_API_KEY="sk-your-api-key-here"
   OPENAI_MODEL="gpt-4o-mini"  # or "gpt-4", "gpt-3.5-turbo"
   OPENAI_MAX_TOKENS="2000"
   ```

**Cost:** OpenAI charges per API call. Check current pricing at https://openai.com/pricing

## Common AI Settings

These settings work with both providers:

```bash
# Temperature controls randomness (0.0 = deterministic, 1.0 = creative)
AI_TEMPERATURE="0.7"

# Top P controls diversity (0.0 = focused, 1.0 = diverse)
AI_TOP_P="0.9"
```

## Troubleshooting

### Ollama Issues

**Error: `fetch failed` or connection refused**
- Ensure Ollama is running: `ollama serve`
- Check the URL matches your Ollama server
- Verify the model is pulled: `ollama list`

### OpenAI Issues

**Error: `API key is required`**
- Set `OPENAI_API_KEY` in your `.env` file
- Ensure the key starts with `sk-`

**Error: `401 Unauthorized`**
- Check your API key is valid
- Verify your OpenAI account has credits

**Error: `429 Too Many Requests`**
- You've hit rate limits
- Upgrade your OpenAI plan or wait

## Architecture

The application uses a provider abstraction layer:

```
tarot.service.ts
    ↓
ai.client.ts (factory)
    ↓
  ┌─────────┬─────────┐
  ↓         ↓         ↓
ollama  openai    future providers...
```

All AI calls go through the unified `aiClient`, which automatically selects the correct provider based on your `.env` configuration.

## Adding More Providers

To add a new AI provider:

1. Create `src/infrastructure/ai/newprovider.client.ts`
2. Implement the `IAIClient` interface
3. Add provider type to `src/infrastructure/config/ai.ts`
4. Update the factory in `src/infrastructure/ai/ai.client.ts`
5. Document configuration in `.env.example`
