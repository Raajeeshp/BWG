import React, { useState, useEffect, useRef } from 'react';
import { Flame, Sparkles, Plus, Zap, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface ChaiStationProps {
  onCupCompleted: (isMalai: boolean) => void;
  clickPower: number;
  autoChaiRate: number; // cups per second
  activeOverdrive: boolean;
  onTriggerOverdrive: () => void;
  readyCups: number;
  dunkCombo: number;
}

export const ChaiStation: React.FC<ChaiStationProps> = ({
  onCupCompleted,
  clickPower,
  autoChaiRate,
  activeOverdrive,
  onTriggerOverdrive,
  readyCups,
  dunkCombo,
}) => {
  const [fillPercent, setFillPercent] = useState<number>(0);
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [kadakCharge, setKadakCharge] = useState<number>(0);
  const [hasMalaiSpoon, setHasMalaiSpoon] = useState<boolean>(false);
  const [steamParticles, setSteamParticles] = useState<{ id: number; left: number; delay: number }[]>([
    { id: 1, left: 35, delay: 0 },
    { id: 2, left: 50, delay: 0.4 },
    { id: 3, left: 65, delay: 0.8 },
    { id: 4, left: 45, delay: 1.2 },
  ]);

  const pourIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle cup completion
  const handleCupFull = (withMalai: boolean = false) => {
    sound.playCupComplete();
    setFillPercent(0);
    setHasMalaiSpoon(false);
    onCupCompleted(withMalai);
  };

  // Click or step pour
  const pourStep = (amount: number) => {
    setFillPercent((prev) => {
      const next = prev + amount;
      if (next >= 100) {
        // trigger completion
        handleCupFull(hasMalaiSpoon);
        return 0;
      }
      return next;
    });

    // Build kadak charge
    setKadakCharge((prev) => {
      if (activeOverdrive) return 100;
      const next = prev + 3;
      if (next >= 100) {
        onTriggerOverdrive();
        return 0;
      }
      return next;
    });
  };

  // Continuous pour on press-and-hold
  const handleStartPouring = () => {
    setIsPouring(true);
    sound.startPour();
    pourStep(clickPower);

    if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);
    pourIntervalRef.current = setInterval(() => {
      pourStep(clickPower * 1.5);
    }, 120);
  };

  const handleStopPouring = () => {
    setIsPouring(false);
    sound.stopPour();
    if (pourIntervalRef.current) {
      clearInterval(pourIntervalRef.current);
      pourIntervalRef.current = null;
    }
  };

  // Passive auto chai rate from upgrades (e.g. Chotu the apprentice)
  useEffect(() => {
    if (autoChaiRate <= 0) return;
    const interval = setInterval(() => {
      setFillPercent((prev) => {
        const next = prev + (autoChaiRate * 100) / 10;
        if (next >= 100) {
          handleCupFull(false);
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [autoChaiRate]);

  // Clean up pour on unmount
  useEffect(() => {
    return () => {
      if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);
      sound.stopPour();
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-between p-6 bg-[#26170e]/95 border border-[#4a2917] rounded-xl shadow-xl overflow-hidden min-h-[460px]">
      {/* Background Subtle Charminar Silhouette & Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg viewBox="0 0 400 400" className="w-full h-full object-cover">
          <path d="M 50 350 L 50 150 L 90 90 L 130 150 L 130 350 Z M 270 350 L 270 150 L 310 90 L 350 150 L 350 350 Z M 90 280 C 140 200 260 200 310 280 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Header Info */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-[#3d2417] text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#fef3c7] text-sm">Brass Samovar Station</span>
          {activeOverdrive && (
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold tracking-wider animate-pulse text-[10px]">
              DUM OVERDRIVE 2X
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[#d97706]">
          <span>Ready Cups:</span>
          <span className="font-['JetBrains_Mono'] font-bold text-base text-[#fef3c7] tabular-nums">
            {readyCups}
          </span>
        </div>
      </div>

      {/* Center Interactive Samovar & Glass Arena */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center my-4">
        {/* Steam rising */}
        <div className="absolute top-8 w-40 h-28 pointer-events-none overflow-hidden flex justify-center">
          {steamParticles.map((p) => (
            <div
              key={p.id}
              className="absolute w-5 h-14 bg-gradient-to-t from-[#fef3c7]/20 via-[#fef3c7]/10 to-transparent rounded-full filter blur-[2px] animate-pulse"
              style={{
                left: `${p.left}%`,
                animationDuration: `${1.8 + p.id * 0.4}s`,
                transform: `translateY(-${fillPercent * 0.3}px)`,
              }}
            />
          ))}
        </div>

        {/* The Samovar Spout */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Samovar Dome SVG */}
          <div className="w-28 h-20 text-[#d97706] relative">
            <svg viewBox="0 0 120 90" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Spout body */}
              <ellipse cx="60" cy="30" rx="45" ry="25" fill="url(#brassGrad)" />
              <rect x="25" y="30" width="70" height="35" rx="6" fill="url(#brassGrad)" />
              <ellipse cx="60" cy="20" rx="15" ry="8" fill="#fef3c7" opacity="0.4" />
              {/* Finial / Knob */}
              <circle cx="60" cy="8" r="6" fill="#f59e0b" />
              {/* Brass tap faucet */}
              <path d="M 60 65 L 60 80 L 56 86 L 64 86 L 60 80" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Liquid Pouring Stream Animation */}
          {isPouring && (
            <div className="w-2 h-20 bg-gradient-to-b from-[#92400e] via-[#b45309] to-[#78350f] rounded-full filter drop-shadow animate-pulse transform -translate-y-2 z-20" />
          )}
        </div>

        {/* The Cutting Chai Glass */}
        <div className="relative mt-2 w-28 h-40 flex flex-col items-center justify-end">
          {/* Glass Contour & Highlights */}
          <div className="relative w-24 h-36 border-2 border-[#fef3c7]/30 bg-[#2d1b13]/50 rounded-b-xl overflow-hidden backdrop-blur-xs shadow-inner flex flex-col justify-end p-1">
            {/* Glass flute ridges */}
            <div className="absolute inset-0 pointer-events-none flex justify-around opacity-20">
              <div className="w-0.5 h-full bg-white" />
              <div className="w-0.5 h-full bg-white" />
              <div className="w-0.5 h-full bg-white" />
            </div>

            {/* Liquid Fill Level */}
            <div
              className="w-full rounded-b-lg transition-all duration-100 relative"
              style={{
                height: `${Math.min(fillPercent, 100)}%`,
                background: 'linear-gradient(180deg, #d97706 0%, #b45309 30%, #78350f 100%)',
              }}
            >
              {/* Creamy Malai Layer on top */}
              {fillPercent > 15 && (
                <div className="absolute -top-2 left-0 right-0 h-3.5 bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#d97706]/70 rounded-full border-t border-[#fef3c7] shadow-sm flex items-center justify-center">
                  <div className="w-8 h-1 bg-[#fffbeb] rounded-full opacity-80" />
                </div>
              )}
            </div>

            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs font-['JetBrains_Mono'] font-bold text-[#fef3c7] drop-shadow-md">
                {Math.round(fillPercent)}%
              </span>
            </div>
          </div>

          {/* Brass Saucer base */}
          <div className="w-32 h-3 bg-gradient-to-r from-[#78350f] via-[#d97706] to-[#78350f] rounded-full mt-1 border-t border-[#fef3c7]/30 shadow-md" />
        </div>
      </div>

      {/* Kadak Steam Overdrive Gauge */}
      <div className="w-full my-2">
        <div className="flex items-center justify-between text-[11px] text-[#fcd34d]/80 mb-1">
          <span className="flex items-center gap-1 font-medium">
            <Flame className="w-3 h-3 text-orange-400" />
            Kadak Dum Heat
          </span>
          <span className="font-['JetBrains_Mono'] font-semibold tabular-nums">
            {activeOverdrive ? '100% ACTIVE' : `${kadakCharge}%`}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#170c07] rounded-full overflow-hidden border border-[#3d2417]">
          <div
            className={`h-full transition-all duration-200 ${
              activeOverdrive
                ? 'bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 animate-pulse'
                : 'bg-gradient-to-r from-amber-600 to-yellow-400'
            }`}
            style={{ width: `${kadakCharge}%` }}
          />
        </div>
      </div>

      {/* Primary Pour Button (Click & Hold or Tap Repeatedly) */}
      <div className="w-full flex gap-2">
        <button
          onMouseDown={handleStartPouring}
          onMouseUp={handleStopPouring}
          onMouseLeave={handleStopPouring}
          onTouchStart={handleStartPouring}
          onTouchEnd={handleStopPouring}
          className={`flex-1 py-3 px-4 font-bold rounded-lg transition-all flex items-center justify-center gap-2 select-none active:scale-98 shadow-md ${
            isPouring
              ? 'bg-[#d97706] text-white shadow-inner scale-98'
              : 'bg-gradient-to-r from-[#b45309] to-[#d97706] hover:from-[#d97706] hover:to-[#f59e0b] text-[#fef3c7]'
          }`}
        >
          <Zap className="w-4 h-4 fill-current text-[#fef3c7]" />
          <span className="tracking-wide">
            {isPouring ? 'Pouring Kadak Chai...' : 'Tap or Hold to Pour Chai'}
          </span>
        </button>

        {/* Malai Spoon Extra Bonus */}
        <button
          onClick={() => {
            sound.playDunk();
            setHasMalaiSpoon(true);
            handleCupFull(true);
          }}
          disabled={fillPercent < 80}
          title="Serve with Rich Clotted Malai (+2x bonus)"
          className={`px-3 py-3 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
            fillPercent >= 80
              ? 'bg-[#f59e0b] text-[#1f140e] hover:bg-[#fbbf24] shadow-md animate-bounce'
              : 'bg-[#2d1b13] text-[#78350f] cursor-not-allowed border border-[#3d2417]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>+Malai!</span>
        </button>
      </div>

      {/* Passive helper info */}
      <div className="w-full text-center mt-2 text-[11px] text-[#fcd34d]/60">
        <span>Auto-Pour: </span>
        <span className="font-['JetBrains_Mono'] text-[#fef3c7] font-medium">
          {(autoChaiRate).toFixed(1)} cups/s
        </span>
        <span className="mx-2">·</span>
        <span>Tap Power: </span>
        <span className="font-['JetBrains_Mono'] text-[#fef3c7] font-medium">
          +{clickPower}% / tap
        </span>
      </div>
    </div>
  );
};
