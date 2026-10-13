import React from 'react';
import { X, Coffee, Cookie, Flame, Timer, Sparkles, Check } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 bg-[#26170e] border border-[#f59e0b]/40 rounded-2xl shadow-2xl text-[#fef3c7]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#fcd34d]/70 hover:text-white hover:bg-[#3d2417] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-left pb-4 border-b border-[#3d2417]">
          <h2 className="text-xl font-bold font-['Bricolage_Grotesque'] text-[#fef3c7] flex items-center gap-2">
            <span>☕ How to Master the Rush</span>
          </h2>
          <p className="text-xs text-[#fcd34d]/70 mt-1">
            Rules of the Charminar cafe counter: keep the tea hot, the biscuits whole, and the rush alive.
          </p>
        </div>

        {/* 3 Core Rules */}
        <div className="my-5 space-y-4">
          {/* Rule 1 */}
          <div className="p-3.5 rounded-xl bg-[#1f140e] border border-[#3d2417] flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#b45309]/30 text-[#f59e0b] shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#fef3c7]">
                1. Catch Falling Osmania Biscuits
              </h3>
              <p className="text-xs text-[#fcd34d]/70 mt-0.5 leading-relaxed">
                Buttery Osmania biscuits tumble down from the bakery chute. Slide your brass saucer with your mouse, finger, or [A]/[D] keys. You can also directly click falling biscuits mid-air! Avoid catching burnt ones.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="p-3.5 rounded-xl bg-[#1f140e] border border-[#3d2417] flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#b45309]/30 text-[#d97706] shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#fef3c7]">
                2. Continuous Irani Chai Pouring
              </h3>
              <p className="text-xs text-[#fcd34d]/70 mt-0.5 leading-relaxed">
                Click or press-and-hold the brass samovar to pour cutting chai into glasses. When the glass fills to 100%, tap <span className="text-[#fbbf24] font-semibold">+Malai!</span> for double value. Rapid pouring activates <strong>Kadak Dum Overdrive</strong>!
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="p-3.5 rounded-xl bg-[#1f140e] border border-[#3d2417] flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-950/60 text-[#38bdf8] shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#38bdf8]">
                3. The Iconic "Dunk Combo" (+Overtime!)
              </h3>
              <p className="text-xs text-[#fcd34d]/70 mt-0.5 leading-relaxed">
                Whenever you have ready chai cups while catching biscuits, you execute the legendary <strong>Dunk Combo</strong>! Each dunk awards double points and adds <strong>+1.5s clutch overtime</strong> to keep your shift alive.
              </p>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="p-3.5 rounded-xl bg-[#1f140e] border border-[#3d2417] flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 shrink-0">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-400">
                4. Customer Orders &amp; Cafe Upgrades
              </h3>
              <p className="text-xs text-[#fcd34d]/70 mt-0.5 leading-relaxed">
                Fulfill tables' rush orders to pocket fat tips and big time bonuses. Spend earned rupees in the <strong>Upgrades &amp; Staff</strong> tab to hire Chotu the apprentice, widen your saucer, and expand your franchise!
              </p>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] hover:from-[#d97706] hover:to-[#f59e0b] text-[#fef3c7] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98"
        >
          <Check className="w-4 h-4" />
          <span>Got It — Let's Pour &amp; Catch!</span>
        </button>
      </div>
    </div>
  );
};
