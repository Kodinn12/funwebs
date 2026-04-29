import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const WORDS = [
  'REACT', 'HOUSE', 'PLANE', 'WATER', 'MUSIC', 'LIGHT', 'POWER', 'BEACH', 'DANCE', 'SMILE',
  'LAUGH', 'DREAM', 'HAPPY', 'PEACE', 'LOVE', 'HEART', 'BRAIN', 'WORLD', 'SPACE', 'OCEAN',
  'EARTH', 'FIRE', 'WIND', 'STORM', 'CLOUD', 'RIVER', 'MOUNT', 'FOREST', 'FIELD', 'STONE',
  'METAL', 'GLASS', 'PAPER', 'PAINT', 'COLOR', 'SHADE', 'SHAPE', 'SOUND', 'VOICE', 'NOISE',
  'QUIET', 'NIGHT', 'SLEEP', 'AWAKE', 'ALERT', 'SHARP', 'QUICK', 'SLOW', 'FAST', 'SPEED',
  'RACE', 'TRACK', 'ROUTE', 'PATH', 'ROAD', 'LANE', 'STREET', 'DRIVE', 'RIDER', 'DRIVER',
  'PILOT', 'SAILOR', 'CREW', 'TEAM', 'GROUP', 'BAND', 'CLUB', 'PARTY', 'EVENT', 'SHOW',
  'GAME', 'PLAY', 'SPORT', 'MATCH', 'ROUND', 'FINAL', 'PRIZE', 'AWARD', 'MEDAL', 'TROPHY',
  'CHAMP', 'WINNER', 'VICTOR', 'LEADER', 'CHIEF', 'BOSS', 'HEAD', 'OWNER', 'MAKER', 'BUILD',
  'CRAFT', 'DESIGN', 'STYLE', 'FASHION', 'TREND', 'MODEL', 'BRAND', 'LABEL', 'MARK', 'SIGN',
  'TOKEN', 'COIN', 'MONEY', 'CASH', 'BANK', 'FUND', 'STOCK', 'TRADE', 'MARKET', 'STORE',
  'SHOP', 'MALL', 'PLAZA', 'PARK', 'ZONE', 'AREA', 'SITE', 'SPOT', 'PLACE', 'POINT'
];

interface WordleState {
  targetWord: string;
  guesses: string[];
  currentGuess: string;
  isPlaying: boolean;
  isWon: boolean;
  isGameOver: boolean;
  maxGuesses: number;
  currentRow: number;
}

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const initialState: WordleState = {
  targetWord: getRandomWord(),
  guesses: [],
  currentGuess: '',
  isPlaying: false,
  isWon: false,
  isGameOver: false,
  maxGuesses: 6,
  currentRow: 0,
};

const wordleSlice = createSlice({
  name: 'wordle',
  initialState,
  reducers: {
    startGame: (state) => {
      state.targetWord = getRandomWord();
      state.guesses = [];
      state.currentGuess = '';
      state.isPlaying = true;
      state.isWon = false;
      state.isGameOver = false;
      state.currentRow = 0;
    },
    addLetter: (state, action: PayloadAction<string>) => {
      if (!state.isPlaying || state.isGameOver) return;
      if (state.currentGuess.length < 5) {
        state.currentGuess += action.payload.toUpperCase();
      }
    },
    removeLetter: (state) => {
      if (!state.isPlaying || state.isGameOver) return;
      state.currentGuess = state.currentGuess.slice(0, -1);
    },
    submitGuess: (state) => {
      if (!state.isPlaying || state.isGameOver || state.currentGuess.length !== 5) return;
      
      state.guesses.push(state.currentGuess);
      state.currentRow++;
      
      if (state.currentGuess === state.targetWord) {
        state.isWon = true;
        state.isGameOver = true;
        state.isPlaying = false;
      } else if (state.currentRow >= state.maxGuesses) {
        state.isGameOver = true;
        state.isPlaying = false;
      }
      
      state.currentGuess = '';
    },
    resetGame: (state) => {
      state.targetWord = getRandomWord();
      state.guesses = [];
      state.currentGuess = '';
      state.isPlaying = false;
      state.isWon = false;
      state.isGameOver = false;
      state.currentRow = 0;
    },
  },
});

export const { startGame, addLetter, removeLetter, submitGuess, resetGame } = wordleSlice.actions;
export default wordleSlice.reducer;
