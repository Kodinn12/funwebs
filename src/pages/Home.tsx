import { useSelector } from '../hooks/redux';

type GameType = 'crashout' | 'mines' | 'wordle';

interface HomeProps {
  onSelectGame: (game: GameType) => void;
}

const GAMES = [
  {
    id: 'crashout' as GameType,
    name: 'Crash Out',
    description: 'Watch the multiplier rise and cash out before it crashes!',
    icon: '🚀',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'mines' as GameType,
    name: 'Mines',
    description: 'Find diamonds and avoid bombs to multiply your winnings!',
    icon: '💎',
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 'wordle' as GameType,
    name: 'Wordle',
    description: 'Guess the 5-letter word in 6 tries. Better guesses = bigger wins!',
    icon: '📝',
    color: 'from-blue-500 to-indigo-500',
  },
];

export const Home = ({ onSelectGame }: HomeProps) => {
  const balance = useSelector((state) => state.coins.balance);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🎮FUNwebs</h1>
          <p className="text-indigo-200">Play exciting games with virtual coins!</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div>
            <p className="text-gray-400 mb-1">Your Balance</p>
            <p className="text-4xl font-bold text-green-400">
              💰 {balance.toLocaleString()} coins
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 mb-1">Current Bet</p>
            <p className="text-2xl font-bold text-yellow-400">100 coins</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Choose a Game</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className={`bg-gradient-to-br ${game.color} rounded-2xl p-6 text-left hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl transform`}
            >
              <div className="text-6xl mb-4 transform transition-transform duration-300 hover:scale-110">{game.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
              <p className="text-white/80">{game.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-12 bg-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-4 text-gray-400">
            <div className="flex items-start gap-3">
              <span className="text-2xl">1️⃣</span>
              <p>Select a game and place your bet (100 coins)</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">2️⃣</span>
              <p>Play the game and try to win!</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">3️⃣</span>
              <p>Cash out your winnings or try again</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
