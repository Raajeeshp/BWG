import React from 'react';
import { Trophy, Coffee, Cookie, Flame, IndianRupee, RotateCcw, ArrowRight } from 'lucide-react';
import { GameStats } from '../types/game';

interface GameOverModalProps {
  score: number;
  highScore: number;
  stats: GameStats;
  rupeesEarnedThisRound: number;
  isNewRecord: boolean;
  onPlayAgain: () => void;
  onOpenUpgrades: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  stats,
  rupeesEarnedThisRound,
  isNewRecord,
  onPlayAgain,
  onOpenUpgrades,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 bg-[#26170e] border border-[#f59e0b]/40 rounded-2xl shadow-2xl text-[#fef3c7]">
        {/* Header */}
        <div className="text-center pb-4 border-b border-[#3d2417]">
          {isNewRecord && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/50 text-[#fbbf24] text-xs font-bold animate-bounce">
              <Trophy className="w-3.5 h-3.5" />
              <span>NEW CHARMINAR RECORD!</span>
            </div>
          )}
          <h2 className="text-2xl font-bold font-['Bricolage_Grotesque'] text-[#fef3c7]">
            Shift Completed!
          </h2>
          <p className="text-xs text-[#fcd34d]/70 mt-1">
            The timer has ended. Here is how your cafe counter performed during the morning rush.
          </p>
        </div>

        {/* Primary Score Callout */}
        <div className="my-5 p-4 rounded-xl bg-[#170c07] border border-[#3d2417] text-center">
          <span className="text-xs uppercase tracking-wider text-[#fcd34d]/60 font-medium">
            Final Reputation Score
          </span>
          <div className="text-4xl font-black font-['JetBrains_Mono'] text-[#fbbf24] tabular-nums mt-1">
            {score.toLocaleString()}
          </div>
          <div className="text-xs text-[#fcd34d]/70 mt-1">
            Personal Best: {highScore.toLocaleString()}
          </div>
        </div>

        {/* Round Breakdown Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <div className="p-2.5 rounded-lg bg-[#1f140e] border border-[#3d2417] text-center">
            <span className="text-[11px] text-[#fcd34d]/60 flex items-center justify-center gap-1">
              <Coffee className="w-3 h-3 text-[#d97706]" /> Chai Poured
            </span>
            <span className="font-['JetBrains_Mono'] text-base font-bold text-[#fef3c7] mt-0.5 block tabular-nums">
              {stats.cupsPoured}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#1f140e] border border-[#3d2417] text-center">
            <span className="text-[11px] text-[#fcd34d]/60 flex items-center justify-center gap-1">
              <Cookie className="w-3 h-3 text-[#f59e0b]" /> Caught
            </span>
            <span className="font-['JetBrains_Mono'] text-base font-bold text-[#fef3c7] mt-0.5 block tabular-nums">
              {stats.biscuitsCaught}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#1f140e] border border-[#3d2417] text-center">
            <span className="text-[11px] text-[#fcd34d]/60 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-[#38bdf8]" /> Top Combo
            </span>
            <span className="font-['JetBrains_Mono'] text-base font-bold text-[#38bdf8] mt-0.5 block tabular-nums">
              {stats.highestCombo}x
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#1f140e] border border-[#3d2417] text-center">
            <span className="text-[11px] text-[#fcd34d]/60 flex items-center justify-center gap-1">
              <IndianRupee className="w-3 h-3 text-emerald-400" /> Cash
            </span>
            <span className="font-['JetBrains_Mono'] text-base font-bold text-emerald-400 mt-0.5 block tabular-nums">
              +₹{rupeesEarnedThisRound}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onOpenUpgrades}
            className="flex-1 py-3 px-4 rounded-xl border border-[#4a2917] bg-[#1f140e] hover:bg-[#2d1b13] text-[#fcd34d] font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Spend Rupees in Upgrades</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#b45309] to-[#f59e0b] hover:from-[#d97706] hover:to-[#fbbf24] text-[#1f140e] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start Next Shift</span>
          </button>
        </div>
      </div>
    </div>
  );
};
