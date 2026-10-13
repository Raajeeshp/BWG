/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameMode, GameState, FallingBiscuit, CustomerOrder, Upgrade, GameStats } from './types/game';
import { sound } from './utils/audio';
import { Navbar } from './components/Navbar';
import { CafeStats } from './components/CafeStats';
import { ChaiStation } from './components/ChaiStation';
import { BiscuitArena } from './components/BiscuitArena';
import { OrderBoard } from './components/OrderBoard';
import { UpgradesPanel } from './components/UpgradesPanel';
import { GameOverModal } from './components/GameOverModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { Flame, Play, Sparkles, Coffee, Cookie, IndianRupee, RotateCcw } from 'lucide-react';

const INITIAL_UPGRADES: Upgrade[] = [
  // Chai Samovar Upgrades
  {
    id: 'chotu_apprentice',
    name: 'Chotu the Tea Boy',
    description: 'Hires an energetic cafe apprentice who continuously pours cutting chai automatically.',
    category: 'CHAI',
    baseCost: 30,
    costMultiplier: 1.45,
    level: 0,
    effectType: 'AUTO_CHAI',
    effectValue: 0.35, // cups per sec
  },
  {
    id: 'brass_spout',
    name: 'Polished Brass Spout',
    description: 'A smooth precision spout that dramatically increases your manual tap pour speed.',
    category: 'CHAI',
    baseCost: 20,
    costMultiplier: 1.4,
    level: 1,
    effectType: 'CLICK_POWER',
    effectValue: 3, // % per tap
  },
  {
    id: 'buffalo_malai',
    name: 'Thick Buffalo Malai',
    description: 'Source rich clotted buffalo cream from Old City dairies to boost cup payout.',
    category: 'CHAI',
    baseCost: 50,
    costMultiplier: 1.5,
    level: 0,
    effectType: 'RUPEE_MULTIPLIER',
    effectValue: 0.25,
  },
  {
    id: 'zafran_infusion',
    name: 'Cardamom & Zafran Saffron',
    description: 'Infuses tea with royal saffron, extending your Dunk Combo window and overtime gains.',
    category: 'CHAI',
    baseCost: 90,
    costMultiplier: 1.6,
    level: 0,
    effectType: 'COMBO_DURATION',
    effectValue: 0.8,
  },

  // Osmania Bakery Upgrades
  {
    id: 'wide_thali',
    name: 'Wide Brass Thali Saucer',
    description: 'Expands the width of your catching plate so biscuits are much harder to drop.',
    category: 'BAKERY',
    baseCost: 25,
    costMultiplier: 1.4,
    level: 1,
    maxLevel: 10,
    effectType: 'SAUCER_WIDTH',
    effectValue: 2.5, // % width
  },
  {
    id: 'magnetic_rim',
    name: 'Magnetic Saucer Rim',
    description: 'A discreet magnetic guidance rim that pulls nearby falling biscuits onto the plate.',
    category: 'BAKERY',
    baseCost: 120,
    costMultiplier: 2.0,
    level: 0,
    maxLevel: 1,
    effectType: 'MAGNET_PULL',
    effectValue: 1,
  },
  {
    id: 'butter_glaze',
    name: 'Pure Ghee & Butter Glaze',
    description: 'Increases the speed and frequency of freshly baked biscuits leaving the oven chute.',
    category: 'BAKERY',
    baseCost: 40,
    costMultiplier: 1.4,
    level: 0,
    effectType: 'BISCUIT_SPAWN_RATE',
    effectValue: 0.2,
  },
  {
    id: 'ismail_baker',
    name: 'Master Baker Ismail',
    description: 'A 4th-generation baker who bakes rare Shahi Pista & Golden Malai biscuits more often.',
    category: 'BAKERY',
    baseCost: 80,
    costMultiplier: 1.55,
    level: 0,
    effectType: 'RARE_BISCUIT_CHANCE',
    effectValue: 1,
  },

  // Cafe Franchise Upgrades
  {
    id: 'marble_tables',
    name: 'Vintage Italian Marble Tables',
    description: 'Classic round cafe tables that attract generous Hyderabad connoisseurs with higher tips.',
    category: 'CAFE',
    baseCost: 75,
    costMultiplier: 1.5,
    level: 0,
    effectType: 'RUPEE_MULTIPLIER',
    effectValue: 0.3,
  },
  {
    id: 'radio_hits',
    name: 'Gramophone Radio Mirchi Hits',
    description: 'Old-school gazals and sitar rhythms keep the crowd patient, slowing rush timer drain.',
    category: 'CAFE',
    baseCost: 150,
    costMultiplier: 1.8,
    level: 0,
    effectType: 'TIMER_EXTENSION_BOOST',
    effectValue: 0.15,
  },
];

const INITIAL_TIME = 45; // seconds for rush shift

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>('RUSH');
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [activeTab, setActiveTab] = useState<'play' | 'upgrades' | 'orders' | 'how-to'>('play');

  // Stats & Resources
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('irani_rush_highscore') || '0', 10);
  });
  const [rupees, setRupees] = useState<number>(() => {
    return parseInt(localStorage.getItem('irani_rush_rupees') || '0', 10);
  });
  const [rupeesEarnedThisRound, setRupeesEarnedThisRound] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_TIME);

  // Audio mute
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  // Interactive Game Counters
  const [readyCups, setReadyCups] = useState<number>(0);
  const [dunkCombo, setDunkCombo] = useState<number>(0);
  const [comboTimerPercent, setComboTimerPercent] = useState<number>(100);
  const [activeOverdrive, setActiveOverdrive] = useState<boolean>(false);

  // Stats Tracker
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: 0,
    rupees: 0,
    totalRupeesEarned: 0,
    cupsPoured: 0,
    biscuitsCaught: 0,
    biscuitsDropped: 0,
    dunkCombos: 0,
    highestCombo: 0,
    ordersCompleted: 0,
    gamesPlayed: 0,
  });

  // Upgrades
  const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
    const saved = localStorage.getItem('irani_rush_upgrades');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return INITIAL_UPGRADES.map((init) => {
          const match = parsed.find((p: Upgrade) => p.id === init.id);
          return match ? { ...init, level: match.level } : init;
        });
      } catch (e) {
        return INITIAL_UPGRADES;
      }
    }
    return INITIAL_UPGRADES;
  });

  // Customer Orders
  const [orders, setOrders] = useState<CustomerOrder[]>([
    {
      id: 'ord_1',
      customerName: 'Babu Bhai (Regular)',
      avatarSeed: 'BB',
      chaiNeeded: 2,
      chaiFulfilled: 0,
      biscuitsNeeded: 2,
      biscuitsFulfilled: 0,
      rewardRupees: 25,
      rewardPoints: 80,
      bonusSeconds: 4,
      timeRemaining: 25,
      totalTime: 25,
    },
    {
      id: 'ord_2',
      customerName: 'Sultana Begum',
      avatarSeed: 'SB',
      chaiNeeded: 1,
      chaiFulfilled: 0,
      biscuitsNeeded: 3,
      biscuitsFulfilled: 0,
      rewardRupees: 35,
      rewardPoints: 120,
      bonusSeconds: 5,
      timeRemaining: 30,
      totalTime: 30,
    },
  ]);

  // Modals
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Derived upgrade stats
  const clickPower =
    10 +
    (upgrades.find((u) => u.id === 'brass_spout')?.level || 0) * 3;

  const autoChaiRate =
    (upgrades.find((u) => u.id === 'chotu_apprentice')?.level || 0) * 0.35;

  const saucerWidthBonus =
    (upgrades.find((u) => u.id === 'wide_thali')?.level || 0) * 2.5;

  const hasMagneticRim =
    (upgrades.find((u) => u.id === 'magnetic_rim')?.level || 0) > 0;

  const spawnRateMultiplier =
    1 + (upgrades.find((u) => u.id === 'butter_glaze')?.level || 0) * 0.2;

  const rareBiscuitBonus =
    upgrades.find((u) => u.id === 'ismail_baker')?.level || 0;

  const rupeeMultiplier =
    1 +
    (upgrades.find((u) => u.id === 'buffalo_malai')?.level || 0) * 0.25 +
    (upgrades.find((u) => u.id === 'marble_tables')?.level || 0) * 0.3;

  const timerEfficiency =
    1 - (upgrades.find((u) => u.id === 'radio_hits')?.level || 0) * 0.08;

  // Persist highscore and rupees
  useEffect(() => {
    localStorage.setItem('irani_rush_highscore', highScore.toString());
  }, [highScore]);

  useEffect(() => {
    localStorage.setItem('irani_rush_rupees', rupees.toString());
  }, [rupees]);

  useEffect(() => {
    localStorage.setItem('irani_rush_upgrades', JSON.stringify(upgrades));
  }, [upgrades]);

  // Countdown timer loop for RUSH mode
  const lastTickUrgentRef = useRef<number>(0);

  useEffect(() => {
    if (gameState !== 'PLAYING' || gameMode !== 'RUSH') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 0.1 * Math.max(0.6, timerEfficiency));

        // Urgent audio ticks
        if (next <= 10 && next > 0) {
          const now = Date.now();
          if (now - lastTickUrgentRef.current > 900) {
            sound.playTick(true);
            lastTickUrgentRef.current = now;
          }
        }

        if (next <= 0) {
          // Timer ran out! Round summary
          handleTimeExpired();
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState, gameMode, timerEfficiency, score, highScore]);

  // Combo decay timer loop
  const comboDecayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (dunkCombo === 0) return;

    const interval = setInterval(() => {
      setComboTimerPercent((prev) => {
        if (prev <= 0) {
          setDunkCombo(0);
          return 100;
        }
        return prev - 2.5; // ~4 seconds combo window
      });
    }, 100);

    return () => clearInterval(interval);
  }, [dunkCombo]);

  // Customer orders timer & generation loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const interval = setInterval(() => {
      setOrders((prev) => {
        const updated = prev
          .map((ord) => ({
            ...ord,
            timeRemaining: ord.timeRemaining - 0.5,
          }))
          .filter((ord) => ord.timeRemaining > 0);

        // Respawn order if less than 2
        if (updated.length < 2 && Math.random() < 0.4) {
          const names = [
            'Police Inspector Khan',
            'Osmania University Boys',
            'Chai Lovers Club',
            'Nawab Saab',
            'Software Engineer Rahul',
            'Charminar Guide Mehdi',
            'Grandmother Zeenat',
          ];
          const chosenName = names[Math.floor(Math.random() * names.length)];
          const chaiN = 1 + Math.floor(Math.random() * 3);
          const biscN = 1 + Math.floor(Math.random() * 4);
          const rewardR = Math.round((chaiN * 8 + biscN * 6) * rupeeMultiplier);
          const rewardP = (chaiN + biscN) * 40;

          updated.push({
            id: 'ord_' + Math.random().toString(36).substring(2, 7),
            customerName: chosenName,
            avatarSeed: chosenName.substring(0, 2).toUpperCase(),
            chaiNeeded: chaiN,
            chaiFulfilled: 0,
            biscuitsNeeded: biscN,
            biscuitsFulfilled: 0,
            rewardRupees: rewardR,
            rewardPoints: rewardP,
            bonusSeconds: Math.min(8, 2 + chaiN + biscN),
            timeRemaining: 24,
            totalTime: 24,
          });
        }

        return updated;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [gameState, rupeeMultiplier]);

  // Handle shift timer expiry
  const handleTimeExpired = () => {
    sound.playGameOver();
    setGameState('SUMMARY');
    setShowGameOver(true);

    const isNew = score > highScore;
    if (isNew) {
      setIsNewRecord(true);
      setHighScore(score);
    } else {
      setIsNewRecord(false);
    }
  };

  // 1. Chai Cup Completed
  const handleCupCompleted = (isMalai: boolean) => {
    const basePts = isMalai ? 40 : 20;
    const baseRs = Math.round((isMalai ? 12 : 6) * rupeeMultiplier);
    const overtimeBonus = 0.4;

    setReadyCups((prev) => prev + 1);
    setScore((prev) => prev + basePts);
    setRupees((prev) => prev + baseRs);
    setRupeesEarnedThisRound((prev) => prev + baseRs);

    if (gameMode === 'RUSH') {
      setTimeLeft((prev) => Math.min(99, prev + overtimeBonus));
    }

    setStats((prev) => ({
      ...prev,
      cupsPoured: prev.cupsPoured + 1,
      totalRupeesEarned: prev.totalRupeesEarned + baseRs,
    }));

    // Update orders with chai
    setOrders((prev) => {
      let fulfilledOne = false;
      return prev.map((ord) => {
        if (!fulfilledOne && ord.chaiFulfilled < ord.chaiNeeded) {
          fulfilledOne = true;
          const nextFulfilled = ord.chaiFulfilled + 1;
          const isComplete =
            nextFulfilled >= ord.chaiNeeded && ord.biscuitsFulfilled >= ord.biscuitsNeeded;

          if (isComplete) {
            handleOrderFulfilled(ord);
          }
          return { ...ord, chaiFulfilled: nextFulfilled };
        }
        return ord;
      });
    });
  };

  // 2. Biscuit Caught in Arena
  const handleBiscuitCaught = (biscuit: FallingBiscuit, wasDunked: boolean) => {
    let pts = biscuit.points;
    let earnedRs = Math.max(1, Math.round((biscuit.points / 3) * rupeeMultiplier));
    let overtimeBonus = biscuit.bonusTime;

    if (biscuit.type === 'BURNT') {
      // Burnt penalty
      setScore((prev) => Math.max(0, prev + biscuit.points));
      if (gameMode === 'RUSH') {
        setTimeLeft((prev) => Math.max(1, prev + biscuit.bonusTime));
      }
      setDunkCombo(0);
      return;
    }

    if (wasDunked) {
      // Dunk combo!
      const nextCombo = dunkCombo + 1;
      setDunkCombo(nextCombo);
      setComboTimerPercent(100);
      sound.playCombo(nextCombo);

      pts *= 1 + nextCombo * 0.5;
      earnedRs = Math.round(earnedRs * 1.5);
      overtimeBonus += 1.5; // clutch +1.5s overtime on dunk!

      // consume 1 ready cup
      setReadyCups((prev) => Math.max(0, prev - 1));

      setStats((prev) => ({
        ...prev,
        dunkCombos: prev.dunkCombos + 1,
        highestCombo: Math.max(prev.highestCombo, nextCombo),
      }));
    }

    setScore((prev) => Math.round(prev + pts));
    setRupees((prev) => prev + earnedRs);
    setRupeesEarnedThisRound((prev) => prev + earnedRs);

    if (gameMode === 'RUSH') {
      setTimeLeft((prev) => Math.min(99, prev + overtimeBonus));
    }

    setStats((prev) => ({
      ...prev,
      biscuitsCaught: prev.biscuitsCaught + 1,
      totalRupeesEarned: prev.totalRupeesEarned + earnedRs,
    }));

    // Update orders with biscuit
    setOrders((prev) => {
      let fulfilledOne = false;
      return prev.map((ord) => {
        if (!fulfilledOne && ord.biscuitsFulfilled < ord.biscuitsNeeded) {
          fulfilledOne = true;
          const nextFulfilled = ord.biscuitsFulfilled + 1;
          const isComplete =
            ord.chaiFulfilled >= ord.chaiNeeded && nextFulfilled >= ord.biscuitsNeeded;

          if (isComplete) {
            handleOrderFulfilled(ord);
          }
          return { ...ord, biscuitsFulfilled: nextFulfilled };
        }
        return ord;
      });
    });
  };

  // 3. Order Fulfilled
  const handleOrderFulfilled = (order: CustomerOrder) => {
    sound.playOrderComplete();
    setScore((prev) => prev + order.rewardPoints);
    setRupees((prev) => prev + order.rewardRupees);
    setRupeesEarnedThisRound((prev) => prev + order.rewardRupees);

    if (gameMode === 'RUSH') {
      setTimeLeft((prev) => Math.min(99, prev + order.bonusSeconds));
    }

    setStats((prev) => ({
      ...prev,
      ordersCompleted: prev.ordersCompleted + 1,
    }));
  };

  // 4. Biscuit Dropped onto floor
  const handleBiscuitDropped = (biscuit: FallingBiscuit) => {
    setStats((prev) => ({
      ...prev,
      biscuitsDropped: prev.biscuitsDropped + 1,
    }));
  };

  // 5. Kadak Overdrive Triggered
  const handleTriggerOverdrive = () => {
    sound.playOverdrive();
    setActiveOverdrive(true);

    // Auto-pour 5 cups rapidly during overdrive
    let count = 0;
    const interval = setInterval(() => {
      count++;
      handleCupCompleted(true);
      if (count >= 5) {
        clearInterval(interval);
        setActiveOverdrive(false);
      }
    }, 600);
  };

  // 6. Buy Upgrade
  const handleBuyUpgrade = (upgradeId: string) => {
    setUpgrades((prev) =>
      prev.map((u) => {
        if (u.id === upgradeId) {
          const cost = Math.round(u.baseCost * Math.pow(u.costMultiplier, u.level));
          if (rupees >= cost) {
            setRupees((r) => r - cost);
            return { ...u, level: u.level + 1 };
          }
        }
        return u;
      })
    );
  };

  // 7. Restart / New Shift
  const handleNewGame = () => {
    sound.playCoin();
    setScore(0);
    setTimeLeft(INITIAL_TIME);
    setReadyCups(0);
    setDunkCombo(0);
    setRupeesEarnedThisRound(0);
    setActiveOverdrive(false);
    setGameState('PLAYING');
    setShowGameOver(false);
    setIsNewRecord(false);
    setActiveTab('play');
    setStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      cupsPoured: 0,
      biscuitsCaught: 0,
      biscuitsDropped: 0,
      dunkCombos: 0,
      highestCombo: 0,
      ordersCompleted: 0,
    }));
  };

  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <div className="min-h-screen bg-[#170c07] text-[#fef3c7] font-['Outfit'] flex flex-col selection:bg-[#f59e0b] selection:text-[#170c07]">
      {/* Universal Top Bar Contract */}
      <Navbar
        score={score}
        rupees={rupees}
        timeLeft={timeLeft}
        gameMode={gameMode}
        onSelectTab={setActiveTab}
        activeTab={activeTab}
        onNewGame={handleNewGame}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-5">
        {/* Sub-bar: Mode Selector & Quick Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#fcd34d]/60 font-medium">Shift Mode:</span>
            <div className="flex items-center p-1 bg-[#26170e] border border-[#3d2417] rounded-lg">
              <button
                onClick={() => {
                  setGameMode('RUSH');
                  handleNewGame();
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  gameMode === 'RUSH'
                    ? 'bg-[#b45309] text-white shadow-sm'
                    : 'text-[#fcd34d]/70 hover:text-[#fef3c7]'
                }`}
              >
                Rush Mode (45s Timer)
              </button>
              <button
                onClick={() => setGameMode('CAREER')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  gameMode === 'CAREER'
                    ? 'bg-[#b45309] text-white shadow-sm'
                    : 'text-[#fcd34d]/70 hover:text-[#fef3c7]'
                }`}
              >
                Relaxed Career (Endless)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#fcd34d]/70">
            <span className="hidden sm:inline">Tip: Catch biscuits while chai is hot to trigger</span>
            <span className="text-[#38bdf8] font-bold">Dunk Combo (+1.5s Overtime)</span>
          </div>
        </div>

        {/* HUD Cafe Status Strip */}
        <CafeStats
          score={score}
          highScore={highScore}
          rupees={rupees}
          timeLeft={timeLeft}
          gameMode={gameMode}
          dunkCombo={dunkCombo}
          comboTimer={comboTimerPercent}
          activeOverdrive={activeOverdrive}
        />

        {/* Active Content Tabs */}
        {activeTab === 'play' && (
          <div className="flex flex-col gap-5">
            {/* Split Screen 2-Column Gameplay Arena */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
              {/* Station 1: Irani Chai Pouring */}
              <ChaiStation
                onCupCompleted={handleCupCompleted}
                clickPower={clickPower}
                autoChaiRate={autoChaiRate}
                activeOverdrive={activeOverdrive}
                onTriggerOverdrive={handleTriggerOverdrive}
                readyCups={readyCups}
                dunkCombo={dunkCombo}
              />

              {/* Station 2: Osmania Biscuit Catch Arena */}
              <BiscuitArena
                onBiscuitCaught={handleBiscuitCaught}
                onBiscuitDropped={handleBiscuitDropped}
                saucerWidthBonus={saucerWidthBonus}
                magneticPull={hasMagneticRim}
                spawnRateMultiplier={spawnRateMultiplier}
                rareBiscuitBonus={rareBiscuitBonus}
                readyCups={readyCups}
                dunkCombo={dunkCombo}
                isPaused={gameState !== 'PLAYING'}
              />
            </div>

            {/* Active Customer Rush Orders */}
            <OrderBoard orders={orders} />
          </div>
        )}

        {/* Upgrades Tab */}
        {activeTab === 'upgrades' && (
          <UpgradesPanel
            upgrades={upgrades}
            rupees={rupees}
            onBuyUpgrade={handleBuyUpgrade}
          />
        )}

        {/* Customer Orders Full View Tab */}
        {activeTab === 'orders' && (
          <div className="p-6 bg-[#26170e]/95 border border-[#4a2917] rounded-xl shadow-xl">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-[#fef3c7] font-['Bricolage_Grotesque']">
                Current Cafe Table Orders
              </h2>
              <p className="text-xs text-[#fcd34d]/70 mt-1">
                Fulfilling combined orders of cutting chai and hot Osmania biscuits awards fat rupee tips and adds clutch overtime seconds to your shift!
              </p>
            </div>
            <OrderBoard orders={orders} />
          </div>
        )}

        {/* How-To Tab */}
        {activeTab === 'how-to' && (
          <div className="p-6 bg-[#26170e]/95 border border-[#4a2917] rounded-xl shadow-xl max-w-3xl mx-auto">
            <h2 className="text-xl font-bold font-['Bricolage_Grotesque'] text-[#fef3c7] mb-4">
              ☕ The Art of Hyderabad's Irani Chai &amp; Osmania Biscuit Rush
            </h2>
            <div className="space-y-4 text-sm text-[#fcd34d]/80 leading-relaxed">
              <p>
                In the historic lanes surrounding Charminar, morning begins with the whistle of brass samovars and the golden aroma of freshly baked Osmania biscuits. Irani chai is brewed "Dum" style—slow cooked with whole spices, pure milk, and sweetened condensed layers, served boiling hot in signature fluted cutting glasses with a thick dollop of clotted malai.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                <div className="p-3 bg-[#1f140e] border border-[#3d2417] rounded-lg">
                  <div className="text-[#f59e0b] font-bold mb-1">1. The Pour</div>
                  <div className="text-xs text-[#fcd34d]/70">
                    Hold or tap the brass samovar to pour continuous streams of tea. Fill glasses to 100% to keep ready cups on deck.
                  </div>
                </div>
                <div className="p-3 bg-[#1f140e] border border-[#3d2417] rounded-lg">
                  <div className="text-[#f59e0b] font-bold mb-1">2. The Catch</div>
                  <div className="text-xs text-[#fcd34d]/70">
                    Slide your saucer with mouse or [A]/[D] keys or click biscuits mid-air to catch buttery biscuits without letting them break.
                  </div>
                </div>
                <div className="p-3 bg-[#1f140e] border border-[#3d2417] rounded-lg">
                  <div className="text-[#38bdf8] font-bold mb-1">3. The Dunk Combo</div>
                  <div className="text-xs text-[#fcd34d]/70">
                    Catching a biscuit while a chai cup is hot executes a Dunk! Adds +1.5s bonus overtime to keep your shift running.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('play')}
                className="mt-4 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#b45309] to-[#d97706] text-[#fef3c7] font-bold text-xs"
              >
                Jump to Counter &amp; Play
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showGameOver && (
        <GameOverModal
          score={score}
          highScore={highScore}
          stats={stats}
          rupeesEarnedThisRound={rupeesEarnedThisRound}
          isNewRecord={isNewRecord}
          onPlayAgain={handleNewGame}
          onOpenUpgrades={() => {
            setShowGameOver(false);
            setActiveTab('upgrades');
          }}
        />
      )}

      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
}
