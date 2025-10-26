export type TarotCardData = {
  id: string;
  definition: string;
  aiInterpretation: string;
  powerWord: string;
};

export type TarotDeck = {
  [key: string]: TarotCardData;
};

export type TarotReading = {
  id: string;
  position: string;
  card: string;
  definition: string;
  aiInterpretation: string;
  powerWord: string;
};

export type TarotCard = TarotReading; 