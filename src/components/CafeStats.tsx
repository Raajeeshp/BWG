import React from 'react';
import { Timer, IndianRupee, Trophy, Flame, Zap, Award } from 'lucide-react';

interface CafeStatsProps {
  score: number;
  highScore: number;
  rupees: number;
  timeLeft: number;
  gameMode: 'RUSH' | 'CAREER';
  dunkCombo: number;
  comboTimer: number; // percentage 0 - 100
  activeOverdrive: boolean;
}

export const CafeStats: React.FC<CafeStatsProps> = ({
  score,
  highScore,
  rupees,
  timeLeft,
  gameMode,
  dunkCombo,
  comboTimer,
  activeOverdrive,
}) => {
  const isTimeCritical = gameMode === 'RUSH' && timeLeft <= 10 && timeLeft > 0;

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Shift Rush Timer / Mode */}
      <div
        className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors shadow-sm ${
          isTimeCritical
            ? 'bg-red-950/70 border-red-600/80 text-red-200 animate-pulse'
            : 'bg-[#26170e]/95 border-[#4a2917] text-[#fef3c7]'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-[#fcd34d]/70">
          <span className="flex items-center gap-1 font-medium">
            <Timer className={`w-3.5 h-3.5 ${isTimeCritical ? 'text-red-400' : 'text-[#f59e0b]'}`} />
            {gameMode === 'RUSH' ? 'Rush Shift Timer' : 'Endless Cafe Shift'}
          </span>
          <span className="text-[10px] tracking-wider uppercase text-[#fcd34d]/60">
            {gameMode === 'RUSH' ? 'Fast-Paced' : 'Relaxed'}
          </span>
        </div>

        <div className="mt-1 flex items-baseline justify-between">
          <span
            className={`font-['JetBrains_Mono'] text-2xl font-black tabular-nums tracking-tight ${
              isTimeCritical ? 'text-red-400' : 'text-[#fef3c7]'
            }`}
          >
            {gameMode === 'RUSH' ? `${Math.max(0, timeLeft).toFixed(1)}s` : '∞ Nonstop'}
          </span>
          {gameMode === 'RUSH' && (
            <span className="text-[10px] text-[#38bdf8] font-medium">
              +Overtime on Dips
            </span>
          )}
        </div>
      </div>

      {/* 2. Score & Personal Best */}
      <div className="p-3.5 rounded-xl border bg-[#26170e]/95 border-[#4a2917] text-[#fef3c7] flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-xs text-[#fcd34d]/70">
          <span className="flex items-center gap-1 font-medium">
            <Trophy className="w-3.5 h-3.5 text-[#f59e0b]" />
            Cafe Reputation
          </span>
          <span className="text-[10px] text-[#fcd34d]/60 font-['JetBrains_Mono']">
            Best: {highScore.toLocaleString()}
          </span>
        </div>

        <div className="mt-1 flex items-baseline justify-between">
          <span className="font-['JetBrains_Mono'] text-2xl font-black text-[#fbbf24] tabular-nums tracking-tight">
            {score.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#fcd34d]/70">
            points
          </span>
        </div>
      </div>

      {/* 3. Daily Cash / Rupees Vault */}
      <div className="p-3.5 rounded-xl border bg-[#26170e]/95 border-[#4a2917] text-[#fef3c7] flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-xs text-[#fcd34d]/70">
          <span className="flex items-center gap-1 font-medium">
            <IndianRupee className="w-3.5 h-3.5 text-[#10b981]" />
            Rupees Vault
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">
            Ready to Spend
          </span>
        </div>

        <div className="mt-1 flex items-baseline justify-between">
          <span className="font-['JetBrains_Mono'] text-2xl font-black text-emerald-400 tabular-nums tracking-tight">
            ₹{rupees.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#fcd34d]/70">
            for upgrades
          </span>
        </div>
      </div>

      {/* 4. Dunk Combo Streak & Multiplier */}
      <div className="p-3.5 rounded-xl border bg-[#26170e]/95 border-[#4a2917] text-[#fef3c7] flex flex-col justify-between shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-[#fcd34d]/70">
          <span className="flex items-center gap-1 font-medium">
            <Flame className="w-3.5 h-3.5 text-[#38bdf8]" />
            Chai-Dunk Combo
          </span>
          <span className="text-[10px] text-[#38bdf8] font-bold">
            {dunkCombo > 0 ? `${dunkCombo}x Streak` : 'Idle'}
          </span>
        </div>

        <div className="mt-1 flex items-baseline justify-between">
          <span
            className={`font-['JetBrains_Mono'] text-2xl font-black tabular-nums tracking-tight ${
              dunkCombo > 1 ? 'text-[#38bdf8]' : 'text-[#fef3c7]/60'
            }`}
          >
            {dunkCombo > 0 ? `${(1 + dunkCombo * 0.5).toFixed(1)}x` : '1.0x'}
          </span>

          {dunkCombo > 0 && (
            <div className="w-16 h-1.5 bg-[#170c07] rounded-full overflow-hidden border border-[#3d2417]">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-300 transition-all duration-75"
                style={{ width: `${comboTimer}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
