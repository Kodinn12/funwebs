import { useSelector } from '../../hooks/redux';

interface HeaderProps {
  onBack?: () => void;
  title?: string;
}

export const Header = ({ onBack, title }: HeaderProps) => {
  const balance = useSelector((state) => state.coins.balance);

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              ← Back
            </button>
          )}
          {title && <h1 className="text-xl font-bold">{title}</h1>}
        </div>
        
        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
          <span className="text-2xl">💰</span>
          <span className="font-bold text-lg">
            {balance.toLocaleString()} coins
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
