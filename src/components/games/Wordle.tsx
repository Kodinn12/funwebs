import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../hooks/redux';
import { startGame, addLetter, removeLetter, submitGuess, resetGame } from '../../store/slices/wordleSlice';
import { placeBet, winBet } from '../../store/slices/coinsSlice';
import { Header } from '../common/Header';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

export const Wordle = ({ onBack }: { onBack: () => void }) => {
  const dispatch = useDispatch();
  const { targetWord, guesses, currentGuess, isPlaying, isWon, isGameOver, maxGuesses } = useSelector(
    (state) => state.wordle
  );

  useEffect(() => {
    if (!isPlaying && !isGameOver) {
      dispatch(startGame());
      dispatch(placeBet());
    }
  }, [dispatch, isPlaying, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      
      if (e.key === 'Enter') {
        dispatch(submitGuess());
      } else if (e.key === 'Backspace') {
        dispatch(removeLetter());
      } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
        dispatch(addLetter(e.key));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isPlaying, isGameOver]);

  useEffect(() => {
    if (isWon) {
      const attempts = guesses.length;
      let multiplier = 0;
      if (attempts === 1) multiplier = 10;
      else if (attempts === 2) multiplier = 5;
      else if (attempts === 3) multiplier = 3;
      else if (attempts === 4) multiplier = 2;
      else multiplier = 1.5;
      
      dispatch(winBet(multiplier));
    } else if (isGameOver && !isWon) {
      // Lost the bet already handled by placeBet
    }
  }, [isWon, isGameOver, guesses.length, dispatch]);

  const handleKeyClick = (key: string) => {
    if (!isPlaying || isGameOver) return;
    
    if (key === 'ENTER') {
      dispatch(submitGuess());
    } else if (key === 'BACKSPACE') {
      dispatch(removeLetter());
    } else {
      dispatch(addLetter(key));
    }
  };

  const getLetterStatus = (letter: string, position: number): string => {
    if (targetWord[position] === letter) return 'correct';
    if (targetWord.includes(letter)) return 'present';
    return 'absent';
  };

  const getCellStyle = (status?: string) => {
    const base = 'w-14 h-14 border-2 rounded-lg flex items-center justify-center text-2xl font-bold uppercase transition-all duration-500 transform ';
    switch (status) {
      case 'correct':
        return base + 'bg-green-500 border-green-500 text-white animate-bounce';
      case 'present':
        return base + 'bg-yellow-500 border-yellow-500 text-white animate-pulse';
      case 'absent':
        return base + 'bg-gray-600 border-gray-600 text-white scale-95';
      default:
        return base + 'bg-gray-700 border-gray-500 text-white hover:scale-105';
    }
  };

  const getKeyStyle = (key: string) => {
    const base = 'px-3 py-4 rounded-lg font-bold text-sm transition-colors ';
    
    // Check if key has been used
    let status = '';
    for (const guess of guesses) {
      const index = guess.indexOf(key);
      if (index !== -1) {
        const letterStatus = getLetterStatus(key, index);
        if (letterStatus === 'correct') status = 'correct';
        else if (letterStatus === 'present' && status !== 'correct') status = 'present';
        else if (!status) status = 'absent';
      }
    }

    switch (status) {
      case 'correct':
        return base + 'bg-green-500 text-white';
      case 'present':
        return base + 'bg-yellow-500 text-white';
      case 'absent':
        return base + 'bg-gray-600 text-gray-400';
      default:
        return base + 'bg-gray-500 hover:bg-gray-400 text-white';
    }
  };

  const renderGrid = () => {
    const rows = [];
    
    for (let i = 0; i < maxGuesses; i++) {
      const guess = guesses[i] || '';
      const isCurrentRow = i === guesses.length;
      
      const cells = [];
      for (let j = 0; j < 5; j++) {
        let letter = '';
        let status = '';
        
        if (guess) {
          letter = guess[j];
          status = getLetterStatus(letter, j);
        } else if (isCurrentRow) {
          letter = currentGuess[j] || '';
        }
        
        cells.push(
          <div key={j} className={getCellStyle(status)}>
            {letter}
          </div>
        );
      }
      
      rows.push(
        <div key={i} className="flex gap-2">
          {cells}
        </div>
      );
    }
    
    return rows;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header onBack={onBack} title="Wordle" />
      
      <div className="max-w-lg mx-auto p-6">
        <div className="flex flex-col gap-2 mb-8">
          {renderGrid()}
        </div>

        {isGameOver && (
          <div className="text-center mb-6">
            <div className={`text-2xl font-bold mb-4 ${isWon ? 'text-green-400' : 'text-red-400'}`}>
              {isWon ? `🎉 WON IN ${guesses.length} ATTEMPTS!` : `😔 The word was: ${targetWord}`}
            </div>
            <button
              onClick={() => {
                dispatch(resetGame());
                dispatch(startGame());
                dispatch(placeBet());
              }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold"
            >
              Play Again
            </button>
          </div>
        )}

        <div className="space-y-2">
          {KEYBOARD_ROWS.map((row, i) => (
            <div key={i} className="flex justify-center gap-1">
              {row.map(key => (
                <button
                  key={key}
                  onClick={() => handleKeyClick(key)}
                  className={getKeyStyle(key)}
                  style={key === 'ENTER' || key === 'BACKSPACE' ? { flex: 1.5 } : {}}
                >
                  {key === 'BACKSPACE' ? '⌫' : key}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-gray-400">
          <p>Guess the 5-letter word in 6 tries!</p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Wrong spot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span>Not in word</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wordle;
