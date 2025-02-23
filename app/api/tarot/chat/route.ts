import { NextResponse } from "next/server";
import { OLLAMA_CONFIG } from '@/lib/config/ollama';
import { generateChatPrompt } from '@/lib/prompts/generator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, previousReading } = body;
    
    if (!message) {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 }
      );
    }

    const prompt = generateChatPrompt(message, previousReading);

    const ollamaResponse = await fetch(`${OLLAMA_CONFIG.apiUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_CONFIG.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: OLLAMA_CONFIG.temperature,
          top_p: OLLAMA_CONFIG.top_p
        }
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error('Ollama Error:', errorText);
      return NextResponse.json(
        { message: `AI service error: ${errorText}` },
        { status: 502 }
      );
    }

    const aiResult = await ollamaResponse.json();
    if (!aiResult.response) {
      console.error('Unexpected AI response:', aiResult);
      return NextResponse.json(
        { message: "Invalid response from AI service" },
        { status: 502 }
      );
    }

    return NextResponse.json({ aiResult: { result: aiResult.response } });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: "An error occurred while processing the chat message" },
      { status: 500 }
    );
  }
} 