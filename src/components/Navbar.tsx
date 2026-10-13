import React from 'react';
import { Volume2, VolumeX, Sparkles, RefreshCw, Trophy, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  score: number;
  rupees: number;
  timeLeft: number;
  gameMode: 'RUSH' | 'CAREER';
  onSelectTab: (tab: 'play' | 'upgrades' | 'orders' | 'how-to') => void;
  activeTab: 'play' | 'upgrades' | 'orders' | 'how-to';
  onNewGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  score,
  rupees,
  timeLeft,
  gameMode,
  onSelectTab,
  activeTab,
  onNewGame,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#1f140e] border-b border-[#3d2417] text-[#fef3c7] sticky top-0 z-30 shadow-md">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('play');
          }}
          className="text-lg md:text-xl font-bold tracking-tight text-[#fef3c7] hover:text-[#f59e0b] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-7 h-7 rounded bg-[#b45309] text-white flex items-center justify-center font-black text-sm shadow-inner">
            ☕
          </span>
          <span className="font-['Bricolage_Grotesque']">Irani Chai &amp; Osmania Rush</span>
        </a>
      </div>

      {/* Zone 2: Concise Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#d97706]/90">
        <button
          onClick={() => onSelectTab('play')}
          className={`hover:text-[#fef3c7] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'play' ? 'text-[#fef3c7] border-b-2 border-[#f59e0b]' : 'text-[#fcd34d]/70'
          }`}
        >
          Cafe Counter
        </button>
        <button
          onClick={() => onSelectTab('upgrades')}
          className={`hover:text-[#fef3c7] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'upgrades' ? 'text-[#fef3c7] border-b-2 border-[#f59e0b]' : 'text-[#fcd34d]/70'
          }`}
        >
          Upgrades &amp; Staff
        </button>
        <button
          onClick={() => onSelectTab('orders')}
          className={`hover:text-[#fef3c7] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'orders' ? 'text-[#fef3c7] border-b-2 border-[#f59e0b]' : 'text-[#fcd34d]/70'
          }`}
        >
          Customer Orders
        </button>
        <button
          onClick={() => onSelectTab('how-to')}
          className={`hover:text-[#fef3c7] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'how-to' ? 'text-[#fef3c7] border-b-2 border-[#f59e0b]' : 'text-[#fcd34d]/70'
          }`}
        >
          Rules of Rush
        </button>
      </nav>

      {/* Zone 3: Single Primary Action & Mute Control */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMute}
          className="p-2 text-[#fcd34d]/80 hover:text-[#fef3c7] hover:bg-[#2d1b13] rounded-lg transition-colors"
          aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          title={isMuted ? 'Unmute SFX' : 'Mute SFX'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onNewGame}
          className="px-4 py-2 text-xs font-semibold text-[#1f140e] bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#f59e0b] rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Shift</span>
        </button>
      </div>
    </header>
  );
};
