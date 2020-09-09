export type AttackCardKey = string;

export interface AttackCard {
  background?: string;
  main: string;
  secondary?: string;
  showContinue?: boolean;
}

export interface AttackReveal {
  cardKey: AttackCardKey;
  user: string;
}

export interface DeckState {
  blessings: number;
  curses: number;
  remaining: number;
  shouldShuffle: boolean;
  total: number;
}
