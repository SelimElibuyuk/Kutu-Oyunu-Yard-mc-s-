import gamesJson from './games.json';

export interface GameFAQ {
  question: string;
  answer: string;
  pageRef?: string;
}

export interface SetupStep {
  title: string;
  description: string;
  tip?: string;
}

export interface TurnPhase {
  phase: string;
  description: string;
}

export interface GameData {
  id: string;
  title: string;
  tagline: string;
  category: string;
  players: string;
  minPlayers: number;
  maxPlayers: number;
  duration: string;
  age: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor' | 'Kolay - Orta';
  accentColor: string;
  bgGradient: string;
  badge: string;
  description: string;
  winCondition: string;
  setupSteps: SetupStep[];
  turnPhases: TurnPhase[];
  faqs: GameFAQ[];
  quickPrompts: string[];
  rulesKnowledge: string;
}

export const GAMES_DATA: Record<string, GameData> = gamesJson as unknown as Record<string, GameData>;
