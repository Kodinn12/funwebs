import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface MinesState {
  grid: boolean[][];
  revealed: boolean[][];
  isPlaying: boolean;
  isGameOver: boolean;
  isWon: boolean;
  bombsCount: number;
  gridSize: number;
  revealedCount: number;
  currentMultiplier: number;
}

const GRID_SIZE = 5;

const createEmptyGrid = (size: number): boolean[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(false));
};

const placeBombs = (grid: boolean[][], bombCount: number): boolean[][] => {
  const newGrid = grid.map(row => [...row]);
  let placed = 0;
  while (placed < bombCount) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    if (!newGrid[row][col]) {
      newGrid[row][col] = true;
      placed++;
    }
  }
  return newGrid;
};

const calculateMultiplier = (revealed: number, bombs: number, totalCells: number): number => {
  const safeCells = totalCells - bombs;
  if (revealed === 0) return 1;
  let multiplier = 1;
  for (let i = 0; i < revealed; i++) {
    multiplier *= (safeCells - i) / (totalCells - i);
  }
  return 0.97 / multiplier;
};

const initialState: MinesState = {
  grid: createEmptyGrid(GRID_SIZE),
  revealed: createEmptyGrid(GRID_SIZE),
  isPlaying: false,
  isGameOver: false,
  isWon: false,
  bombsCount: 3,
  gridSize: GRID_SIZE,
  revealedCount: 0,
  currentMultiplier: 1,
};

const minesSlice = createSlice({
  name: 'mines',
  initialState,
  reducers: {
    startGame: (state, action: PayloadAction<number>) => {
      state.bombsCount = action.payload;
      state.grid = placeBombs(createEmptyGrid(GRID_SIZE), action.payload);
      state.revealed = createEmptyGrid(GRID_SIZE);
      state.isPlaying = true;
      state.isGameOver = false;
      state.isWon = false;
      state.revealedCount = 0;
      state.currentMultiplier = 1;
    },
    revealCell: (state, action: PayloadAction<{ row: number; col: number }>) => {
      const { row, col } = action.payload;
      if (!state.isPlaying || state.revealed[row][col] || state.isGameOver) return;
      
      state.revealed[row][col] = true;
      
      if (state.grid[row][col]) {
        state.isGameOver = true;
        state.isPlaying = false;
        state.currentMultiplier = 0;
      } else {
        state.revealedCount++;
        const safeCells = GRID_SIZE * GRID_SIZE - state.bombsCount;
        state.currentMultiplier = calculateMultiplier(state.revealedCount, state.bombsCount, GRID_SIZE * GRID_SIZE);
        
        if (state.revealedCount === safeCells) {
          state.isWon = true;
          state.isGameOver = true;
          state.isPlaying = false;
        }
      }
    },
    cashOut: (state) => {
      if (state.isPlaying && state.revealedCount > 0) {
        state.isPlaying = false;
        state.isGameOver = true;
        state.isWon = true;
      }
    },
    resetGame: (state) => {
      state.isPlaying = false;
      state.isGameOver = false;
      state.isWon = false;
      state.revealed = createEmptyGrid(GRID_SIZE);
      state.revealedCount = 0;
      state.currentMultiplier = 1;
    },
  },
});

export const { startGame, revealCell, cashOut, resetGame } = minesSlice.actions;
export default minesSlice.reducer;
