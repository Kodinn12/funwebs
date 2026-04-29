import { useSelector, useDispatch } from '../../hooks/redux';
import { useState } from 'react';
import { startGame, revealCell, cashOut, resetGame } from '../../store/slices/minesSlice';
import { placeBet, winBet } from '../../store/slices/coinsSlice';
import { Header } from '../common/Header';

export const Mines = ({ onBack }: { onBack: () => void }) => {
  const dispatch = useDispatch();
  const { grid, revealed, isPlaying, isGameOver, isWon, revealedCount, currentMultiplier } = useSelector(
    (state) => state.mines
  );
  const { balance, currentBet } = useSelector((state) => state.coins);
  
  const [selectedBombs, setSelectedBombs] = useState(3);

  const handleStart = () => {
    if (currentBet > balance) return;
    dispatch(placeBet());
    dispatch(startGame(selectedBombs));
  };

  const handleCellClick = (row: number, col: number) => {
    if (!isPlaying || isGameOver || revealed[row][col]) return;
    dispatch(revealCell({ row, col }));
  };

  const handleCashOut = () => {
    if (isPlaying && revealedCount > 0) {
      dispatch(winBet(currentMultiplier));
      dispatch(cashOut());
    }
  };

  const getCellContent = (row: number, col: number) => {
    if (!revealed[row][col]) {
      return isGameOver && grid[row][col] ? '💣' : '';
    }
    if (grid[row][col]) return '💣';
    return '💎';
  };

  const getCellStyle = (row: number, col: number) => {
    const base = 'w-16 h-16 rounded-lg font-bold text-2xl transition-all duration-300 transform ';
    if (!revealed[row][col]) {
      if (isGameOver && grid[row][col]) {
        return base + 'bg-red-500 text-white animate-pulse';
      }
      return base + 'bg-gray-600 hover:bg-gray-500 cursor-pointer hover:scale-105';
    }
    if (grid[row][col]) {
      return base + 'bg-red-500 text-white animate-bounce';
    }
    return base + 'bg-green-500 text-white animate-pulse';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header onBack={onBack} title="Mines" />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl">
              Multiplier: <span className="font-bold text-green-400">{currentMultiplier.toFixed(2)}x</span>
            </div>
            <div className="text-xl">
              Revealed: <span className="font-bold text-blue-400">{revealedCount}</span>
            </div>
          </div>

          {!isPlaying && !isGameOver && (
            <div className="mb-6">
              <label className="block mb-2">Number of Bombs:</label>
              <select
                value={selectedBombs}
                onChange={(e) => setSelectedBombs(Number(e.target.value))}
                className="bg-gray-700 rounded-lg px-4 py-2"
              >
                {[1, 2, 3, 5, 7, 10, 15, 20].map(n => (
                  <option key={n} value={n}>{n} bombs</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-5 gap-2 mb-6 justify-center">
            {grid.map((row, rowIndex) =>
              row.map((_, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={!isPlaying || revealed[rowIndex][colIndex]}
                  className={getCellStyle(rowIndex, colIndex)}
                >
                  {getCellContent(rowIndex, colIndex)}
                </button>
              ))
            )}
          </div>

          <div className="flex justify-center gap-4">
            {!isPlaying && !isGameOver && (
              <button
                onClick={handleStart}
                disabled={currentBet > balance}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 rounded-xl font-bold"
              >
                START GAME
              </button>
            )}
            
            {isPlaying && revealedCount > 0 && (
              <button
                onClick={handleCashOut}
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl font-bold"
              >
                CASH OUT ({(currentBet * currentMultiplier).toFixed(0)} coins)
              </button>
            )}

            {isGameOver && (
              <div className="text-center">
                <div className={`text-2xl font-bold mb-4 ${isWon ? 'text-green-400' : 'text-red-400'}`}>
                  {isWon ? 'YOU WON!' : 'GAME OVER'}
                </div>
                <button
                  onClick={() => dispatch(resetGame())}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-2">How to Play</h3>
          <ul className="text-gray-400 space-y-1">
            <li>• Click cells to reveal diamonds 💎</li>
            <li>• Avoid bombs 💣 or you lose!</li>
            <li>• Cash out anytime to secure your winnings</li>
            <li>• More bombs = higher multipliers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Mines;
