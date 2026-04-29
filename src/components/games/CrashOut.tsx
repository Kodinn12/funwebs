import { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from '../../hooks/redux';
import { startGame, updateMultiplier, cashOut, resetGame } from '../../store/slices/crashoutSlice';
import { placeBet, winBet } from '../../store/slices/coinsSlice';
import { Header } from '../common/Header';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { RocketAnimation } from '../common/RocketAnimation';

export const CrashOut = ({ onBack }: { onBack: () => void }) => {
  const dispatch = useDispatch();
  const { multiplier, isPlaying, isCrashed, canCashOut, gameHistory } = useSelector(
    (state) => state.crashout
  );
  const { balance, currentBet } = useSelector((state) => state.coins);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const multiplierRef = useRef(1.0);

  const handleStart = () => {
    if (currentBet > balance) return;
    dispatch(placeBet());
    dispatch(startGame());
    multiplierRef.current = 1.0;
  };

  const handleCashOut = useCallback(() => {
    if (canCashOut && !isCrashed) {
      dispatch(winBet(multiplier));
      dispatch(cashOut());
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [canCashOut, isCrashed, dispatch, multiplier]);

  useEffect(() => {
    if (isPlaying && !isCrashed) {
      intervalRef.current = setInterval(() => {
        multiplierRef.current += 0.01;
        dispatch(updateMultiplier(parseFloat(multiplierRef.current.toFixed(2))));
      }, 50);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, isCrashed, dispatch]);

  useEffect(() => {
    if (isCrashed && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isCrashed]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header onBack={onBack} title="Crash Out" />
      
      <div className="max-w-4xl mx-auto p-6">
        {/* Rocket Animation */}
        <div className="mb-6">
          <RocketAnimation multiplier={multiplier} isPlaying={isPlaying} isCrashed={isCrashed} />
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className={`text-5xl font-bold mb-4 transition-all duration-300 transform ${
              isCrashed ? 'text-red-500 scale-110 animate-pulse' : isPlaying ? 'text-green-400 animate-pulse' : 'text-white'
            }`}>
              <AnimatedCounter value={multiplier} duration={100} className={isCrashed ? 'text-red-500 scale-110 animate-pulse' : isPlaying ? 'text-green-400 animate-pulse' : 'text-white'} />x
            </div>
            <div className="text-gray-400">
              {isCrashed ? 'CRASHED!' : isPlaying ? 'Rising...' : 'Ready to play'}
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            {!isPlaying ? (
              <button
                onClick={handleStart}
                disabled={currentBet > balance}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 rounded-xl font-bold text-xl transition-colors"
              >
                START GAME
              </button>
            ) : (
              <button
                onClick={handleCashOut}
                disabled={!canCashOut || isCrashed}
                className={`px-8 py-4 rounded-xl font-bold text-xl transition-colors ${
                  canCashOut && !isCrashed
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                CASH OUT @ {multiplier.toFixed(2)}x
              </button>
            )}
          </div>

          {isCrashed && (
            <div className="text-center mb-6">
              <button
                onClick={() => dispatch(resetGame())}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Game History</h3>
          <div className="flex flex-wrap gap-2">
            {gameHistory.length === 0 ? (
              <span className="text-gray-500">No games played yet</span>
            ) : (
              gameHistory.map((mult, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    mult >= 2 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {mult.toFixed(2)}x
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrashOut;
