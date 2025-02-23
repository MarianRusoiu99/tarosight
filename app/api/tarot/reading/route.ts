import { NextResponse } from "next/server";
import { tarotCards } from "@/data/tarotCards";
import { OLLAMA_CONFIG } from '@/lib/config/ollama';
import { AUTH_CONFIG } from '@/lib/config/auth';
import { verifyToken, getUserTokens, deductTokens } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { generateTarotReadingPrompt } from '@/lib/prompts/generator';

export async function POST(request: Request) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // Check if user has enough tokens
    const tokens = await getUserTokens(payload.userId);
    if (tokens < AUTH_CONFIG.readingCost) {
      return NextResponse.json(
        { message: "Insufficient tokens" },
        { status: 403 }
      );
    }

    // Randomly select 3 cards from the defined tarot cards.
    const cardNames = Object.keys(tarotCards) as (keyof typeof tarotCards)[];
    if (cardNames.length < 3) {
      return NextResponse.json(
        { message: "Not enough tarot cards defined." },
        { status: 400 }
      );
    }

    // Shuffle and pick three different cards.
    const shuffled = cardNames.sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, 3) as (keyof typeof tarotCards)[];
    const reading = selectedCards.map((card, index) => {
      const position =
        index === 0 ? "Past" : index === 1 ? "Present" : "Future";
      return {
        id: tarotCards[card].id,
        position,
        card,
        definition: tarotCards[card].definition,
        aiInterpretation: tarotCards[card].aiInterpretation,
        powerWord: tarotCards[card].powerWord
      } as TarotReading;
    });

    // Generate prompt using the template
    const prompt = generateTarotReadingPrompt(reading);

    // Updated Ollama API call with correct endpoint
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

    // Fix the transaction
    await prisma.$transaction(async (tx) => {
      await tx.reading.create({
        data: {
          userId: payload.userId,
          cards: reading,
          aiReading: aiResult.response,
        },
      });
      await tx.user.update({
        where: { id: payload.userId },
        data: { tokens: { decrement: AUTH_CONFIG.readingCost } },
      });
    });

    return NextResponse.json({
      reading,
      aiResult: { result: aiResult.response },
      remainingTokens: tokens - AUTH_CONFIG.readingCost,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while generating the tarot reading" },
      { status: 500 }
    );
  }
} 