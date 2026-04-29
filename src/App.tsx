import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Home } from './pages/Home';
import { CrashOut } from './components/games/CrashOut';
import { Mines } from './components/games/Mines';
import { Wordle } from './components/games/Wordle';
import './App.css';

type GameType = 'crashout' | 'mines' | 'wordle';

function AppContent() {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);

  const handleSelectGame = (game: GameType) => {
    setCurrentGame(game);
  };

  const handleBack = () => {
    setCurrentGame(null);
  };

  if (currentGame === 'crashout') {
    return <CrashOut onBack={handleBack} />;
  }

  if (currentGame === 'mines') {
    return <Mines onBack={handleBack} />;
  }

  if (currentGame === 'wordle') {
    return <Wordle onBack={handleBack} />;
  }

  return <Home onSelectGame={handleSelectGame} />;
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
