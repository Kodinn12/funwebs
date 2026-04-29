import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './slices/coinsSlice';
import crashoutReducer from './slices/crashoutSlice';
import minesReducer from './slices/minesSlice';
import wordleReducer from './slices/wordleSlice';

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    crashout: crashoutReducer,
    mines: minesReducer,
    wordle: wordleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;