import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CoinsState {
  balance: number;
  currentBet: number;
}

const initialState: CoinsState = {
  balance: 5000,
  currentBet: 100,
};

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    setCurrentBet: (state, action: PayloadAction<number>) => {
      state.currentBet = action.payload;
    },
    placeBet: (state) => {
      state.balance -= state.currentBet;
    },
    winBet: (state, action: PayloadAction<number>) => {
      const winAmount = state.currentBet * action.payload;
      state.balance += winAmount;
    },
    addCoins: (state, action: PayloadAction<number>) => {
      state.balance += action.payload;
    },
  },
});

export const { setBalance, setCurrentBet, placeBet, winBet, addCoins } = coinsSlice.actions;
export default coinsSlice.reducer;