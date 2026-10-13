import React, { useState } from 'react';
import { Upgrade } from '../types/game';
import { IndianRupee, ArrowUpCircle, Check, Sparkles, Coffee, Cookie, Store } from 'lucide-react';
import { sound } from '../utils/audio';

interface UpgradesPanelProps {
  upgrades: Upgrade[];
  rupees: number;
  onBuyUpgrade: (upgradeId: string) => void;
}

export const UpgradesPanel: React.FC<UpgradesPanelProps> = ({
  upgrades,
  rupees,
  onBuyUpgrade,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CHAI' | 'BAKERY' | 'CAFE'>('ALL');

  const filteredUpgrades =
    selectedCategory === 'ALL'
      ? upgrades
      : upgrades.filter((u) => u.category === selectedCategory);

  const calculateCost = (upgrade: Upgrade) => {
    return Math.round(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
  };

  const handlePurchase = (upgrade: Upgrade) => {
    const cost = calculateCost(upgrade);
    if (rupees >= cost && (!upgrade.maxLevel || upgrade.level < upgrade.maxLevel)) {
      sound.playCoin();
      onBuyUpgrade(upgrade.id);
    }
  };

  return (
    <div className="p-6 bg-[#26170e]/95 border border-[#4a2917] rounded-xl shadow-xl">
      {/* Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#3d2417]">
        <div>
          <h2 className="text-lg font-bold text-[#fef3c7] font-['Bricolage_Grotesque']">
            Cafe Staff &amp; Bakery Upgrades
          </h2>
          <p className="text-xs text-[#fcd34d]/70 mt-0.5">
            Reinvest your daily rupees to automate chai pouring, expand biscuit catching, and boost customer tips.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#170c07] rounded-lg border border-[#3d2417] self-start sm:self-auto">
          {(['ALL', 'CHAI', 'BAKERY', 'CAFE'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#b45309] text-[#fef3c7] shadow-sm'
                  : 'text-[#fcd34d]/60 hover:text-[#fef3c7] hover:bg-[#2d1b13]'
              }`}
            >
              {cat === 'ALL' && 'All Upgrades'}
              {cat === 'CHAI' && 'Chai Samovar'}
              {cat === 'BAKERY' && 'Osmania Bakery'}
              {cat === 'CAFE' && 'Cafe Franchise'}
            </button>
          ))}
        </div>
      </div>

      {/* Upgrades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredUpgrades.map((upgrade) => {
          const cost = calculateCost(upgrade);
          const isMaxed = upgrade.maxLevel !== undefined && upgrade.level >= upgrade.maxLevel;
          const canAfford = rupees >= cost && !isMaxed;

          return (
            <div
              key={upgrade.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isMaxed
                  ? 'bg-[#1a0e08]/70 border-[#3d2417] opacity-80'
                  : canAfford
                  ? 'bg-[#1f140e] border-[#4a2917] hover:border-[#f59e0b]/60 hover:shadow-lg'
                  : 'bg-[#1a0e08]/80 border-[#3d2417]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-semibold text-sm text-[#fef3c7]">
                    {upgrade.name}
                  </h3>
                  <span className="text-[11px] font-['JetBrains_Mono'] text-[#fcd34d] px-1.5 py-0.5 rounded bg-[#3d2417]/70 shrink-0">
                    Lvl {upgrade.level}{upgrade.maxLevel ? `/${upgrade.maxLevel}` : ''}
                  </span>
                </div>

                <p className="text-xs text-[#fcd34d]/70 leading-relaxed mb-4">
                  {upgrade.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#3d2417]/80 flex items-center justify-between mt-auto">
                <div className="text-xs font-['JetBrains_Mono'] font-bold text-[#fbbf24] flex items-center gap-1">
                  {isMaxed ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Max Level
                    </span>
                  ) : (
                    <span>₹{cost.toLocaleString()}</span>
                  )}
                </div>

                <button
                  onClick={() => handlePurchase(upgrade)}
                  disabled={!canAfford || isMaxed}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isMaxed
                      ? 'bg-transparent text-emerald-400 cursor-default'
                      : canAfford
                      ? 'bg-gradient-to-r from-[#b45309] to-[#d97706] hover:from-[#d97706] hover:to-[#f59e0b] text-[#fef3c7] shadow hover:shadow-md active:scale-95'
                      : 'bg-[#2d1b13] text-[#78350f] cursor-not-allowed border border-[#3d2417]'
                  }`}
                >
                  <ArrowUpCircle className="w-3.5 h-3.5" />
                  <span>{isMaxed ? 'Completed' : 'Upgrade'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
