import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FallingBiscuit, CrumbParticle, BiscuitType } from '../types/game';
import { sound } from '../utils/audio';

interface BiscuitArenaProps {
  onBiscuitCaught: (biscuit: FallingBiscuit, wasDunked: boolean) => void;
  onBiscuitDropped: (biscuit: FallingBiscuit) => void;
  saucerWidthBonus: number; // percentage width increase
  magneticPull: boolean;
  spawnRateMultiplier: number;
  rareBiscuitBonus: number;
  readyCups: number;
  dunkCombo: number;
  isPaused: boolean;
}

export const BiscuitArena: React.FC<BiscuitArenaProps> = ({
  onBiscuitCaught,
  onBiscuitDropped,
  saucerWidthBonus,
  magneticPull,
  spawnRateMultiplier,
  rareBiscuitBonus,
  readyCups,
  dunkCombo,
  isPaused,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paddleX, setPaddleX] = useState<number>(50); // percentage 0 - 100
  const [biscuits, setBiscuits] = useState<FallingBiscuit[]>([]);
  const [crumbs, setCrumbs] = useState<CrumbParticle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<{ id: string; x: number; y: number; text: string; color: string }[]>([]);

  const paddleWidth = Math.min(20 + saucerWidthBonus, 45); // base 20% width

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setPaddleX((prev) => Math.max(paddleWidth / 2, prev - 6));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setPaddleX((prev) => Math.min(100 - paddleWidth / 2, prev + 6));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paddleWidth, isPaused]);

  // Pointer / mouse movement over arena
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPaused || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const clampedX = Math.max(paddleWidth / 2, Math.min(100 - paddleWidth / 2, x));
    setPaddleX(clampedX);
  };

  // Generate random biscuit
  const spawnBiscuit = useCallback((): FallingBiscuit => {
    const roll = Math.random();
    let type: BiscuitType = 'CLASSIC';
    let points = 10;
    let bonusTime = 0.5;
    let speed = 0.8 + Math.random() * 0.4;
    let size = 46;

    const rareBoost = rareBiscuitBonus * 0.05;

    if (roll < 0.07 + rareBoost) {
      type = 'GOLDEN_MALAI';
      points = 150;
      bonusTime = 2.5;
      speed = 1.1;
      size = 52;
    } else if (roll < 0.22 + rareBoost) {
      type = 'SHAHI_PISTA';
      points = 60;
      bonusTime = 1.2;
      speed = 0.9;
      size = 48;
    } else if (roll < 0.42) {
      type = 'KADAK';
      points = 25;
      bonusTime = 0.8;
      speed = 1.35;
      size = 44;
    } else if (roll < 0.54) {
      type = 'BURNT';
      points = -30;
      bonusTime = -2.0;
      speed = 1.0;
      size = 42;
    }

    return {
      id: Math.random().toString(36).substring(2, 9),
      x: 10 + Math.random() * 80,
      y: 0,
      speed,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
      type,
      size,
      points,
      bonusTime,
    };
  }, [rareBiscuitBonus]);

  // Create crumb explosion particles
  const spawnCrumbs = (xPercent: number, yPercent: number, type: BiscuitType) => {
    const crumbColor =
      type === 'BURNT'
        ? '#3f2214'
        : type === 'GOLDEN_MALAI'
        ? '#fde047'
        : type === 'SHAHI_PISTA'
        ? '#86efac'
        : '#f59e0b';

    const newCrumbs: CrumbParticle[] = [];
    for (let i = 0; i < 12; i++) {
      newCrumbs.push({
        id: Math.random().toString(),
        x: xPercent,
        y: yPercent,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.7) * 5,
        size: 3 + Math.random() * 5,
        color: crumbColor,
        alpha: 1,
        life: 0,
      });
    }
    setCrumbs((prev) => [...prev.slice(-40), ...newCrumbs]);
  };

  // Add floating text
  const addFloatingText = (x: number, y: number, text: string, color: string) => {
    const id = Math.random().toString();
    setFloatingTexts((prev) => [...prev.slice(-8), { id, x, y, text, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 900);
  };

  // Catch a biscuit handler (either from paddle or mid-air direct click)
  const handleCatch = (biscuit: FallingBiscuit, catchY: number = 88) => {
    if (biscuit.caught) return;
    biscuit.caught = true;

    spawnCrumbs(biscuit.x, catchY, biscuit.type);

    const isBurnt = biscuit.type === 'BURNT';
    const canDunk = !isBurnt && readyCups > 0;

    if (canDunk) {
      sound.playDunk();
      addFloatingText(biscuit.x, catchY - 5, `DUNK! +${biscuit.points * 2} (Combo x${dunkCombo + 1})`, '#38bdf8');
    } else if (isBurnt) {
      sound.playBiscuitCatch('BURNT');
      addFloatingText(biscuit.x, catchY - 5, `Burnt! -2.0s`, '#f87171');
    } else {
      sound.playBiscuitCatch(biscuit.type);
      addFloatingText(biscuit.x, catchY - 5, `+${biscuit.points}`, '#fbbf24');
    }

    onBiscuitCaught(biscuit, canDunk);

    // Remove from falling list
    setBiscuits((prev) => prev.filter((b) => b.id !== biscuit.id));
  };

  // Direct click / tap to snatch biscuit mid-air
  const handleBiscuitClick = (biscuit: FallingBiscuit, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (isPaused) return;
    handleCatch(biscuit, biscuit.y);
  };

  // Main game tick for falling biscuits and particle animation
  useEffect(() => {
    if (isPaused) return;

    // Spawning interval
    const spawnTimer = setInterval(() => {
      setBiscuits((prev) => {
        if (prev.length < 8) {
          return [...prev, spawnBiscuit()];
        }
        return prev;
      });
    }, Math.max(450, 1100 / spawnRateMultiplier));

    // Physics loop (60fps)
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 16.66; // normalize to ~60fps
      lastTime = currentTime;

      // Update falling biscuits
      setBiscuits((prev) => {
        const next: FallingBiscuit[] = [];

        for (const b of prev) {
          if (b.caught) continue;

          let targetX = b.x;

          // Magnetic saucer pull when close to bottom
          if (magneticPull && b.y > 60 && Math.abs(b.x - paddleX) < paddleWidth * 1.2) {
            targetX += (paddleX - b.x) * 0.08 * dt;
          }

          const nextY = b.y + b.speed * 0.9 * dt;
          const nextRot = b.rotation + b.rotationSpeed * dt;

          // Check paddle collision near the bottom (y between 84% and 92%)
          const paddleLeft = paddleX - paddleWidth / 2;
          const paddleRight = paddleX + paddleWidth / 2;

          if (nextY >= 85 && nextY <= 92 && targetX >= paddleLeft && targetX <= paddleRight) {
            handleCatch(b, 88);
            continue;
          }

          // Check if missed the floor
          if (nextY >= 96) {
            if (b.type !== 'BURNT') {
              onBiscuitDropped(b);
            }
            continue;
          }

          next.push({
            ...b,
            x: targetX,
            y: nextY,
            rotation: nextRot,
          });
        }

        return next;
      });

      // Update crumbs
      setCrumbs((prev) => {
        if (prev.length === 0) return prev;
        return prev
          .map((c) => ({
            ...c,
            x: c.x + c.vx * 0.2 * dt,
            y: c.y + c.vy * 0.2 * dt,
            vy: c.vy + 0.2 * dt, // gravity
            alpha: Math.max(0, c.alpha - 0.03 * dt),
            life: c.life + 1,
          }))
          .filter((c) => c.alpha > 0.05);
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      clearInterval(spawnTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, spawnBiscuit, paddleX, paddleWidth, magneticPull, spawnRateMultiplier, readyCups, dunkCombo]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative flex flex-col items-center justify-between p-6 bg-[#26170e]/95 border border-[#4a2917] rounded-xl shadow-xl overflow-hidden min-h-[460px] cursor-crosshair select-none"
    >
      {/* Header Info */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-[#3d2417] text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#fef3c7] text-sm">Osmania Bakery Chute</span>
          <span className="text-[11px] text-[#fcd34d]/60 hidden sm:inline">
            (Catch with Saucer or Click!)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#d97706]">
          <span>Dunk Ready:</span>
          <span
            className={`font-['JetBrains_Mono'] font-bold text-base tabular-nums ${
              readyCups > 0 ? 'text-[#38bdf8] animate-pulse' : 'text-[#78350f]'
            }`}
          >
            {readyCups > 0 ? `YES (${readyCups})` : 'POUR CHAI'}
          </span>
        </div>
      </div>

      {/* Arena Dropfield */}
      <div className="relative w-full flex-1 overflow-hidden min-h-[300px]">
        {/* Bakery Chute Ceiling graphic */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#1a0e08] to-transparent border-b border-[#4a2917]/30 flex justify-around">
          <div className="w-8 h-2 bg-[#78350f] rounded-b opacity-40" />
          <div className="w-8 h-2 bg-[#78350f] rounded-b opacity-40" />
          <div className="w-8 h-2 bg-[#78350f] rounded-b opacity-40" />
        </div>

        {/* Falling Biscuits */}
        {biscuits.map((b) => (
          <div
            key={b.id}
            onClick={(e) => handleBiscuitClick(b, e)}
            onTouchStart={(e) => handleBiscuitClick(b, e)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 active:scale-95 drop-shadow-lg"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              transform: `translate(-50%, -50%) rotate(${b.rotation}deg)`,
            }}
          >
            {/* SVG Crisp Rendering of Osmania Biscuit */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                {/* Classic Osmania Gradient */}
                <radialGradient id="classicGrad" cx="45%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#fde68a" />
                  <stop offset="55%" stopColor="#f59e0b" />
                  <stop offset="85%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#92400e" />
                </radialGradient>
                {/* Kadak Crispy Dark Brown */}
                <radialGradient id="kadakGrad" cx="45%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="65%" stopColor="#92400e" />
                  <stop offset="100%" stopColor="#451a03" />
                </radialGradient>
                {/* Shahi Pista Green-Gold */}
                <radialGradient id="pistaGrad" cx="45%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="45%" stopColor="#86efac" />
                  <stop offset="85%" stopColor="#15803d" />
                  <stop offset="100%" stopColor="#14532d" />
                </radialGradient>
                {/* Golden Malai Super Sparkle */}
                <radialGradient id="malaiGrad" cx="45%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#fef08a" />
                  <stop offset="80%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </radialGradient>
                {/* Burnt Hazard */}
                <radialGradient id="burntGrad" cx="45%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#44403c" />
                  <stop offset="70%" stopColor="#1c1917" />
                  <stop offset="100%" stopColor="#0c0a09" />
                </radialGradient>
              </defs>

              {/* Biscuit Scalloped/Fluted Edge Path */}
              <circle
                cx="50"
                cy="50"
                r="44"
                fill={
                  b.type === 'BURNT'
                    ? 'url(#burntGrad)'
                    : b.type === 'GOLDEN_MALAI'
                    ? 'url(#malaiGrad)'
                    : b.type === 'SHAHI_PISTA'
                    ? 'url(#pistaGrad)'
                    : b.type === 'KADAK'
                    ? 'url(#kadakGrad)'
                    : 'url(#classicGrad)'
                }
                stroke={b.type === 'BURNT' ? '#000000' : '#78350f'}
                strokeWidth="2.5"
                strokeDasharray="5,2"
              />

              {/* Biscuit Inner Rim */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke={b.type === 'BURNT' ? '#292524' : '#b45309'}
                strokeWidth="1.5"
                opacity="0.6"
              />

              {/* Salt sprinkles & fork pricks (signature Osmania look) */}
              <circle cx="44" cy="42" r="2" fill="#fffbeb" opacity="0.9" />
              <circle cx="56" cy="42" r="2" fill="#fffbeb" opacity="0.9" />
              <circle cx="50" cy="50" r="2" fill="#fffbeb" opacity="0.9" />
              <circle cx="42" cy="58" r="2" fill="#fffbeb" opacity="0.9" />
              <circle cx="58" cy="58" r="2" fill="#fffbeb" opacity="0.9" />

              {/* Pista bits or sparkles */}
              {b.type === 'SHAHI_PISTA' && (
                <>
                  <rect x="36" y="36" width="4" height="4" fill="#15803d" rx="1" />
                  <rect x="60" y="48" width="4" height="4" fill="#15803d" rx="1" />
                </>
              )}
              {b.type === 'GOLDEN_MALAI' && (
                <circle cx="50" cy="50" r="12" fill="#ffffff" opacity="0.4" filter="blur(1px)" />
              )}
            </svg>
          </div>
        ))}

        {/* Flying Crumb Particles */}
        {crumbs.map((c) => (
          <div
            key={c.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: `${c.size}px`,
              height: `${c.size}px`,
              backgroundColor: c.color,
              opacity: c.alpha,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Floating Numbers & Dunk Text */}
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            className="absolute font-['Bricolage_Grotesque'] font-bold text-sm pointer-events-none animate-float-up drop-shadow whitespace-nowrap"
            style={{
              left: `${ft.x}%`,
              top: `${ft.y}%`,
              color: ft.color,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {ft.text}
          </div>
        ))}

        {/* The Catching Saucer (Paddle) at 88% */}
        <div
          className="absolute bottom-5 h-8 transform -translate-x-1/2 flex flex-col items-center justify-center transition-all duration-75 pointer-events-none"
          style={{
            left: `${paddleX}%`,
            width: `${paddleWidth}%`,
          }}
        >
          {/* Authentic Brass Saucer Graphics */}
          <div className="relative w-full h-5 bg-gradient-to-r from-[#92400e] via-[#f59e0b] to-[#92400e] rounded-b-xl border-t-2 border-[#fef3c7] shadow-lg flex items-center justify-center">
            {/* Saucer center floral imprint */}
            <div className="w-12 h-1.5 bg-[#78350f]/60 rounded-full" />
            {readyCups > 0 && (
              <span className="absolute -top-3 px-1.5 py-0.2 bg-[#38bdf8] text-[#0f172a] text-[9px] font-black rounded-full shadow">
                DIP READY ☕
              </span>
            )}
          </div>
          {/* Saucer bottom rim */}
          <div className="w-3/4 h-1.5 bg-[#78350f] rounded-b-md opacity-80" />
        </div>
      </div>

      {/* Footer controls reminder */}
      <div className="w-full flex items-center justify-between pt-3 border-t border-[#3d2417] text-[11px] text-[#fcd34d]/60">
        <span className="hidden sm:inline">Use Mouse / Drag or [A] / [D] / [←] [→]</span>
        <span className="sm:hidden">Drag or Tap to Catch</span>
        <span>Saucer Width: {Math.round(paddleWidth * 2)}px</span>
      </div>
    </div>
  );
};
