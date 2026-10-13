export type GameMode = 'RUSH' | 'CAREER';

export type GameState = 'TITLE' | 'PLAYING' | 'PAUSED' | 'SUMMARY';

export type BiscuitType = 'CLASSIC' | 'KADAK' | 'SHAHI_PISTA' | 'GOLDEN_MALAI' | 'BURNT';

export interface FallingBiscuit {
  id: string;
  x: number; // percentage 5% to 95%
  y: number; // percentage 0% to 100%
  speed: number;
  rotation: number;
  rotationSpeed: number;
  type: BiscuitType;
  size: number;
  points: number;
  bonusTime: number; // seconds added
  caught?: boolean;
}

export interface CrumbParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  timestamp: number;
}

export interface CustomerOrder {
  id: string;
  customerName: string;
  avatarSeed: string;
  chaiNeeded: number;
  chaiFulfilled: number;
  biscuitsNeeded: number;
  biscuitsFulfilled: number;
  rewardRupees: number;
  rewardPoints: number;
  bonusSeconds: number;
  timeRemaining: number;
  totalTime: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  category: 'CHAI' | 'BAKERY' | 'CAFE';
  baseCost: number;
  costMultiplier: number;
  level: number;
  maxLevel?: number;
  effectType: 
    | 'CLICK_POWER' 
    | 'AUTO_CHAI' 
    | 'SAUCER_WIDTH' 
    | 'MAGNET_PULL' 
    | 'BISCUIT_SPAWN_RATE' 
    | 'RARE_BISCUIT_CHANCE' 
    | 'RUPEE_MULTIPLIER' 
    | 'COMBO_DURATION'
    | 'TIMER_EXTENSION_BOOST';
  effectValue: number; // base increase per level
}

export interface GameStats {
  score: number;
  highScore: number;
  rupees: number;
  totalRupeesEarned: number;
  cupsPoured: number;
  biscuitsCaught: number;
  biscuitsDropped: number;
  dunkCombos: number;
  highestCombo: number;
  ordersCompleted: number;
  gamesPlayed: number;
}
