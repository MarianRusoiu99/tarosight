/**
 * Tarot Module Type Definitions
 * 
 * Defines types for tarot cards, readings, and related operations.
 */

/**
 * TarotCardData - Represents the static card data structure
 */
export interface TarotCardData {
  id: string;
  definition: string;
  aiInterpretation: string;
  powerWord: string;
}

/**
 * TarotDeck - Represents the deck structure
 */
export type TarotDeck = { [key: string]: TarotCardData };

/**
 * TarotReading - Represents a card in a reading with its position
 */
export interface TarotReading {
  id: string;
  position: string;
  card: string;
  definition: string;
  aiInterpretation: string;
  powerWord: string;
}

/**
 * TarotCard - Type alias for TarotReading (used interchangeably in the codebase)
 */
export type TarotCard = TarotReading;

/**
 * ReadingRecord - Represents a persisted reading (matches Prisma Reading model)
 */
export interface ReadingRecord {
  id: string;
  userId: string;
  cards: TarotReading[];
  aiReading: string;
  createdAt: Date;
}

/**
 * ReadingResult - Result of reading generation
 */
export interface ReadingResult {
  reading: TarotReading[];
  aiReading: string;
  remainingTokens: number;
  readingId: string;
}

/**
 * ChatResult - Result of chat response
 */
export interface ChatResult {
  response: string;
}

/**
 * CardSelectionOptions - Options for card selection
 */
export interface CardSelectionOptions {
  count?: number; // default 3
  positions?: string[]; // default ['Past', 'Present', 'Future']
}
