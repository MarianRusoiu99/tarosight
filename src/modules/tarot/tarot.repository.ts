/**
 * Tarot Repository
 * 
 * Handles all database operations related to tarot readings.
 */

import { prisma } from '@/src/infrastructure/database/prisma.client';
import type { Prisma } from '@prisma/client';
import type { ReadingRecord, TarotReading } from './tarot.types';

export class TarotRepository {
  /**
   * Create a reading record
   * Can be called within a transaction context by passing tx parameter
   */
  async createReading(
    userId: string,
    cards: TarotReading[],
    aiReading: string,
    tx?: Prisma.TransactionClient
  ): Promise<ReadingRecord> {
    const client = tx ?? prisma;
    const reading = await client.reading.create({
      data: {
        userId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cards: cards as any, // Prisma JSON type
        aiReading,
      },
      select: {
        id: true,
        userId: true,
        cards: true,
        aiReading: true,
        createdAt: true,
      },
    });

    return reading as unknown as ReadingRecord;
  }

  /**
   * Get reading by ID
   */
  async getReadingById(
    readingId: string,
    tx?: Prisma.TransactionClient
  ): Promise<ReadingRecord | null> {
    const client = tx ?? prisma;
    const reading = await client.reading.findUnique({
      where: { id: readingId },
      select: {
        id: true,
        userId: true,
        cards: true,
        aiReading: true,
        createdAt: true,
      },
    });

    return reading as ReadingRecord | null;
  }

  /**
   * Get user readings with pagination
   * For future reading history functionality
   */
  async getUserReadings(
    userId: string,
    limit?: number,
    offset?: number,
    tx?: Prisma.TransactionClient
  ): Promise<ReadingRecord[]> {
    const client = tx ?? prisma;
    const readings = await client.reading.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        userId: true,
        cards: true,
        aiReading: true,
        createdAt: true,
      },
    });

    return readings as unknown as ReadingRecord[];
  }

  /**
   * Delete a reading
   * For future reading management functionality
   */
  async deleteReading(
    readingId: string,
    tx?: Prisma.TransactionClient
  ): Promise<boolean> {
    try {
      const client = tx ?? prisma;
      await client.reading.delete({
        where: { id: readingId },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get user reading count
   * For future analytics/statistics functionality
   */
  async getUserReadingCount(
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<number> {
    const client = tx ?? prisma;
    const count = await client.reading.count({
      where: { userId },
    });
    return count;
  }
}

export const tarotRepository = new TarotRepository();
