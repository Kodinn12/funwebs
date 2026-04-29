export interface GameState {
    balance:number;
    currentBet:number;
    isPlaying:boolean;
}

export interface CrashOutState extends GameState{
  multiplier: number;        // Current crash multiplier
  isCrashed: boolean;        // Has the game crashed?
  canCashOut: boolean;       // Can player cash out now?
}

export interface MinesState extends GameState {
  grid: boolean[][];         // True = bomb, false = safe
  revealed: boolean[][];     // Which cells are revealed
  bombsCount: number;        // Number of bombs on grid
  gridSize: number;          // Grid size (5x5, etc.)
}

export interface WordleState extends GameState {
  currentWord: string;       // Word to guess
  guesses: string[];         // Previous guesses
  currentGuess: string;      // Current input
  maxGuesses: number;        // Max attempts (6)
  isWon: boolean;            // Did player win?
}
 
export type GameType = 'crashout' | 'mines' | 'wordle';