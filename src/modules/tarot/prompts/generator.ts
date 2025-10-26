import { PROMPT_TEMPLATES } from './templates';
import type { TarotCard } from '@/src/modules/tarot/tarot.types';

export function generateTarotReadingPrompt(cards: TarotCard[]) {
  const formattedCards = cards
    .map(card => PROMPT_TEMPLATES.tarotReading.cardFormat(
      card.position,
      card.card,
      card.definition
    ))
    .join("\n");

  return PROMPT_TEMPLATES.tarotReading.base.replace(
    '{cards}',
    formattedCards
  );
}

export function generateChatPrompt(userMessage: string, previousReading?: string) {
  return PROMPT_TEMPLATES.chat.base
    .replace('{previousReading}', previousReading || 'No previous reading available')
    .replace('{userMessage}', userMessage);
} 