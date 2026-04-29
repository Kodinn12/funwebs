import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CrashOutState {
  multiplier: number;
  isPlaying: boolean;
  isCrashed: boolean;
  canCashOut: boolean;
  gameHistory: number[];
  crashPoint: number;
  consecutiveGames: number;
  lastGameTime: number;
}

const initialState: CrashOutState = {
  multiplier: 1.0,
  isPlaying: false,
  isCrashed: false,
  canCashOut: false,
  gameHistory: [],
  crashPoint: 1.0,
  consecutiveGames: 0,
  lastGameTime: 0,
};

const generateCrashPoint = (consecutiveGames: number, lastGameTime: number) => {
  // Unpredictable randomization with multiple algorithms
  const timestamp = Date.now();
  const seed1 = Math.random() * timestamp;
  const seed2 = Math.sin(seed1) * 10000;
  const seed3 = Math.cos(seed2) * 10000;
  
  // Mix multiple random sources for unpredictability
  const r1 = Math.random();
  const r2 = (seed1 - Math.floor(seed1));
  const r3 = (seed2 - Math.floor(seed2));
  const r4 = (seed3 - Math.floor(seed3));
  
  // Combine random sources
  const finalRandom = (r1 + r2 + r3 + r4) / 4;
  
  // Boost 1.3x-2.3x frequency for continuous players
  const timeSinceLastGame = timestamp - lastGameTime;
  const isContinuousPlay = consecutiveGames >= 3 && timeSinceLastGame < 30000; // 3+ games within 30 seconds
  
  // Adjust probabilities for continuous players
  let boostFactor = isContinuousPlay ? 0.15 : 0; // 15% boost to favorable range
  
  // Dynamic algorithm selection based on random factors
  const algorithm = Math.floor(finalRandom * 100) % 3;
  
  switch(algorithm) {
    case 0: // Weighted distribution - 89% for 1.7x-2.1x (boosted for continuous play)
      const boostedThreshold = 0.89 + boostFactor; // Boost to ~94% for continuous players
      if (finalRandom < boostedThreshold) {
        // 1.3x-2.3x range for continuous players
        if (isContinuousPlay) {
          return 1.3 + (finalRandom * 1.0); // 1.3 - 2.3x
        }
        return 1.7 + (finalRandom * 0.4); // 1.7 - 2.1x (normal)
      }
      if (finalRandom < 0.95) {
        return 1.0 + (finalRandom * 0.7); // 1.0 - 1.7x (6%)
      }
      if (finalRandom < 0.99) {
        return 2.1 + (finalRandom * 2.9); // 2.1 - 5.0x (4%)
      }
      if (finalRandom < 0.998) {
        return 5.0 + (finalRandom * 10.0); // 5.0 - 15.0x (0.8%)
      }
      return 15.0 + (finalRandom * 35.0); // 15.0 - 50.0x (0.2%)
      
    case 1: // Gaussian-like distribution centered around 3.0x
      const gaussian = Math.sqrt(-2.0 * Math.log(r1)) * Math.cos(2.0 * Math.PI * r2);
      const centered = 3.0 + (gaussian * 0.8);
      return Math.max(1.0, Math.min(50.0, centered));
      
    case 2: // Exponential decay with noise - adjusted for continuous play
      let base = 2.5 + (Math.exp(-finalRandom * 3) * 10);
      if (isContinuousPlay) {
        base = 1.8 + (Math.exp(-finalRandom * 3) * 10); // Lower base for continuous players
      }
      const noise = (Math.sin(timestamp * 0.001) + 1) * 0.5;
      return Math.max(1.0, Math.min(50.0, base + noise));
      
    default:
      return 2.5 + Math.random() * 1.3;
  }
};

const crashoutSlice = createSlice({
  name: 'crashout',
  initialState,
  reducers: {
    startGame: (state) => {
      state.isPlaying = true;
      state.isCrashed = false;
      state.canCashOut = true;
      state.multiplier = 1.0;
      state.crashPoint = generateCrashPoint(state.consecutiveGames, state.lastGameTime);
    },
    updateMultiplier: (state, action: PayloadAction<number>) => {
      state.multiplier = action.payload;
      if (state.multiplier >= state.crashPoint) {
        state.isCrashed = true;
        state.canCashOut = false;
        state.isPlaying = false;
        state.gameHistory.unshift(state.crashPoint);
        if (state.gameHistory.length > 10) state.gameHistory.pop();
        // Track game completion for continuous play detection
        state.consecutiveGames++;
        state.lastGameTime = Date.now();
      }
    },
    cashOut: (state) => {
      if (state.canCashOut && !state.isCrashed) {
        state.canCashOut = false;
        state.isPlaying = false;
        state.gameHistory.unshift(state.multiplier);
        if (state.gameHistory.length > 10) state.gameHistory.pop();
        // Track game completion for continuous play detection
        state.consecutiveGames++;
        state.lastGameTime = Date.now();
      }
    },
    crashGame: (state) => {
      state.isCrashed = true;
      state.canCashOut = false;
      state.isPlaying = false;
      state.gameHistory.unshift(state.crashPoint);
      if (state.gameHistory.length > 10) state.gameHistory.pop();
      // Track game completion for continuous play detection
      state.consecutiveGames++;
      state.lastGameTime = Date.now();
    },
    resetGame: (state) => {
      state.isPlaying = false;
      state.isCrashed = false;
      state.canCashOut = false;
      state.multiplier = 1.0;
      // Reset consecutive games counter if not playing for a while
      const timeSinceLastGame = Date.now() - state.lastGameTime;
      if (timeSinceLastGame > 60000) { // 1 minute gap resets counter
        state.consecutiveGames = 0;
      }
    },
  },
});

export const { startGame, updateMultiplier, cashOut, crashGame, resetGame } = crashoutSlice.actions;
export default crashoutSlice.reducer;
