import React from 'react';
import { CustomerOrder } from '../types/game';
import { Users, Clock, CheckCircle2, IndianRupee, Sparkles } from 'lucide-react';

interface OrderBoardProps {
  orders: CustomerOrder[];
}

export const OrderBoard: React.FC<OrderBoardProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="p-4 bg-[#26170e]/80 border border-[#3d2417] rounded-xl text-center text-xs text-[#fcd34d]/60">
        All customer tables currently served! Next orders arriving shortly...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 text-xs text-[#fcd34d]/80">
        <span className="font-semibold text-[#fef3c7] flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#f59e0b]" />
          Active Customer Rush Orders
        </span>
        <span className="text-[11px] text-[#fcd34d]/60">
          Complete combos to fulfill orders &amp; earn bonus overtime!
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {orders.map((order) => {
          const isChaiDone = order.chaiFulfilled >= order.chaiNeeded;
          const isBiscuitDone = order.biscuitsFulfilled >= order.biscuitsNeeded;
          const timePercent = Math.max(0, (order.timeRemaining / order.totalTime) * 100);

          return (
            <div
              key={order.id}
              className="p-3.5 bg-[#1f140e] border border-[#3d2417] hover:border-[#f59e0b]/50 rounded-xl transition-all shadow-sm flex flex-col justify-between"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#3d2417] text-[#fef3c7] flex items-center justify-center text-xs font-bold">
                    {order.avatarSeed}
                  </span>
                  <span className="text-xs font-semibold text-[#fef3c7]">
                    {order.customerName}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#38bdf8] font-['JetBrains_Mono']">
                  <span>+{order.bonusSeconds}s</span>
                </div>
              </div>

              {/* Order Items Required */}
              <div className="grid grid-cols-2 gap-2 my-2 text-xs">
                {/* Chai fulfillment */}
                <div
                  className={`p-2 rounded-lg border flex items-center justify-between ${
                    isChaiDone
                      ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                      : 'bg-[#2d1b13]/60 border-[#4a2917] text-[#fef3c7]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span>☕</span> Chai
                  </span>
                  <span className="font-['JetBrains_Mono'] font-bold tabular-nums">
                    {order.chaiFulfilled}/{order.chaiNeeded}
                  </span>
                </div>

                {/* Biscuit fulfillment */}
                <div
                  className={`p-2 rounded-lg border flex items-center justify-between ${
                    isBiscuitDone
                      ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                      : 'bg-[#2d1b13]/60 border-[#4a2917] text-[#fef3c7]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span>🍪</span> Osmania
                  </span>
                  <span className="font-['JetBrains_Mono'] font-bold tabular-nums">
                    {order.biscuitsFulfilled}/{order.biscuitsNeeded}
                  </span>
                </div>
              </div>

              {/* Reward & Countdown Bar */}
              <div className="mt-2 pt-2 border-t border-[#3d2417]/60 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-[#fbbf24] font-['JetBrains_Mono'] font-bold">
                  <span>₹{order.rewardRupees}</span>
                  <span className="text-[#fcd34d]/60 font-normal">·</span>
                  <span className="text-[#fcd34d] font-normal">+{order.rewardPoints} pts</span>
                </div>

                <div className="w-20 h-1.5 bg-[#170c07] rounded-full overflow-hidden border border-[#3d2417]">
                  <div
                    className={`h-full transition-all duration-300 ${
                      timePercent > 40 ? 'bg-[#f59e0b]' : 'bg-red-500 animate-pulse'
                    }`}
                    style={{ width: `${timePercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
