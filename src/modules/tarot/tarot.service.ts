/**
 * Tarot Service
 * 
 * Contains all tarot-related business logic.
 */

import { prisma } from '@/src/infrastructure/database/prisma.client';
import { aiClient } from '@/src/infrastructure/ai/ai.client';
import { userService } from '@/src/modules/user/user.service';
import { AUTH_CONFIG } from '@/src/infrastructure/config/auth';
import { InsufficientTokensError, NotFoundError } from '@/src/shared/errors';
import { tarotCards } from './tarot.data';
import { generateTarotReadingPrompt, generateChatPrompt } from './prompts/generator';
import type {
  TarotReading,
  ReadingResult,
  ChatResult,
  CardSelectionOptions,
  ReadingRecord,
} from './tarot.types';
import { tarotRepository } from './tarot.repository';

export class TarotService {
  /**
   * Select cards for a reading
   */
  selectCards(options?: CardSelectionOptions): TarotReading[] {
    const count = options?.count ?? 3;
    const positions = options?.positions ?? ['Past', 'Present', 'Future'];

    // Get card names from tarotCards object keys
    const cardNames = Object.keys(tarotCards);

    // Validate that deck has enough cards
    if (cardNames.length < count) {
      throw new Error('Deck has insufficient cards');
    }

    // Shuffle cards
    const shuffled = [...cardNames].sort(() => 0.5 - Math.random());

    // Select requested count
    const selectedCards = shuffled.slice(0, count);

    // Map to TarotReading format with positions
    return selectedCards.map((cardName, index) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const card = (tarotCards as Record<string, any>)[cardName];
      return {
        id: card.id || cardName.toLowerCase().replace(/\s+/g, '-'),
        position: positions[index] || `Position ${index + 1}`,
        card: cardName,
        definition: card.definition,
        aiInterpretation: card.aiInterpretation,
        powerWord: card.powerWord,
      };
    });
  }

  /**
   * Generate a tarot reading for a user
   */
  async generateReading(userId: string): Promise<ReadingResult> {
    // Check user token balance
    const tokenBalance = await userService.getUserTokenBalance(userId);
    if (tokenBalance < AUTH_CONFIG.readingCost) {
      throw new InsufficientTokensError(AUTH_CONFIG.readingCost, tokenBalance);
    }

    // Select cards
    const cards = this.selectCards();

    // Generate prompt
    const prompt = generateTarotReadingPrompt(cards);

    // Call AI service - errors from aiClient are already ExternalServiceError
    const aiReading = await aiClient.generateCompletion(prompt);

    // Use transaction to atomically create reading and deduct tokens
    const result = await prisma.$transaction(async (tx) => {
      // Re-check balance inside transaction to prevent negative balances
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { tokens: true },
      });

      if (!user) {
        throw new NotFoundError('User', userId);
      }

      if (user.tokens < AUTH_CONFIG.readingCost) {
        throw new InsufficientTokensError(AUTH_CONFIG.readingCost, user.tokens);
      }

      // Create reading record using repository with transaction
      const reading = await tarotRepository.createReading(
        userId,
        cards,
        aiReading,
        tx
      );

      // Deduct tokens and get updated user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          tokens: { decrement: AUTH_CONFIG.readingCost },
        },
        select: {
          tokens: true,
        },
      });

      return { reading, remainingTokens: updatedUser.tokens };
    });

    return {
      reading: cards,
      aiReading,
      remainingTokens: result.remainingTokens,
      readingId: result.reading.id,
    };
  }

  /**
   * Generate a chat response
   */
  async generateChatResponse(
    message: string,
    previousReading?: string
  ): Promise<ChatResult> {
    // Generate prompt
    const prompt = generateChatPrompt(message, previousReading);

    // Call AI service
    const response = await aiClient.generateCompletion(prompt);

    return { response };
  }

  /**
   * Get reading by ID
   * For future reading retrieval functionality
   */
  async getReadingById(readingId: string): Promise<ReadingRecord | null> {
    return tarotRepository.getReadingById(readingId);
  }

  /**
   * Get user readings
   * For future reading history functionality
   */
  async getUserReadings(
    userId: string,
    limit?: number,
    offset?: number
  ): Promise<ReadingRecord[]> {
    return tarotRepository.getUserReadings(userId, limit, offset);
  }
}

export const tarotService = new TarotService();
