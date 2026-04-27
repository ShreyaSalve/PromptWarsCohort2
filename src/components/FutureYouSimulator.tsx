import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCircle, 
  X, 
  Briefcase, 
  Coins, 
  GraduationCap, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Wind
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  description: string;
  impacts: {
    career: string;
    finance: string;
    quality: string;
  };
}

const scenarios: Record<string, Scenario> = {
  'tech': {
    id: 'tech',
    title: "The Digital Renaissance",
    description: "In 2031, you're living in a highly digitized India where tech infrastructure has reached the last mile.",
    impacts: {
      career: "AI-driven roles are the norm. Your specialized skills are in global demand via high-speed rural connectivity.",
      finance: "Digital rupee dominates. Investment in startup ecosystems has multiplied your savings potential.",
      quality: "Smart cities have reduced your commute by 40% using automated transit systems."
    }
  },
  'green': {
    id: 'green',
    title: "The Circular Economy",
    description: "The year is 2031. Massive shifts in policy have prioritized ecological restoration and sustainability.",
    impacts: {
      career: "You've transitioned to the green-collar sector. Sustainability auditing is a top-tier lucrative profession.",
            finance: "Carbon credits are part of your personal portfolio. Energy costs have halved due to local solar grids.",
      quality: "Air quality index in your city is consistently 'Good'. Fresh water is abundant and tap-safe."
    }
  },
  'welfare': {
    id: 'welfare',
    title: "The Social Safety Net",
    description: "By 2031, policy has focused on universal basic services and radical healthcare accessibility.",
    impacts: {
      career: "A stable job market with strong labor protections. You have more time for creative pursuits.",
      finance: "Your disposable income has increased as healthcare and higher education are fully state-subsidized.",
      quality: "A society with zero extreme poverty. Your community safety and mental wellbeing are at an all-time high."
    }
  }
};

export const FutureYouSimulator = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<string | null>(null);

  const selectedScenario = selection ? scenarios[selection] : null;

  return (
    <div className="fixed inset-0 z-[200] glass flex flex-col p-6 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[#00FFA3] font-mono text-[10px] uppercase tracking-widest">Temporal Projection</h2>
          <h3 className="text-xl font-bold">Future You Sim</h3>
        </div>
        <button onClick={onClose} className="p-2 glass rounded-full hover:border-[#00FFA3]/50">
          <X size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-6"
          >
            <div className="glass p-5 rounded-2xl border-l-4 border-l-[#00FFA3] mb-8">
              <h4 className="text-lg font-bold mb-2">Select Your Priority</h4>
              <p className="text-sm opacity-60">Which focus area do you believe will shape the next decade of your life?</p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'tech', label: 'Technological Supremacy', icon: Sparkles, color: '#00FFA3' },
                { id: 'green', label: 'Ecological Restoration', icon: Wind, color: '#60A5FA' },
                { id: 'welfare', label: 'Social Safety & Equity', icon: HeartIcon, color: '#E879F9' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setSelection(item.id); setStep(2); }}
                  className="w-full glass p-5 rounded-2xl flex items-center gap-4 group hover:border-[#00FFA3]/40 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center glass group-hover:scale-110 transition-transform" style={{ color: item.color }}>
                    <item.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
                  </div>
                  <ArrowRight size={18} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="projection"
            initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="relative glass p-8 rounded-[40px] border-[#00FFA3]/30 overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, #00FFA3 1px, transparent 0)',
                backgroundSize: '30px 30px'
              }} />
              
              <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6 hologram-glow">
                <UserCircle size={48} className="text-[#00FFA3]" />
              </div>
              
              <h2 className="text-xs font-mono text-[#00FFA3] uppercase tracking-[0.4em] mb-2">Temporal Shift: 2031</h2>
              <h3 className="text-2xl font-black text-glow">{selectedScenario?.title}</h3>
              <p className="mt-4 text-sm opacity-60 leading-relaxed font-light">
                {selectedScenario?.description}
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { icon: Briefcase, label: 'Career & Growth', text: selectedScenario?.impacts.career },
                { icon: Coins, label: 'Financial Health', text: selectedScenario?.impacts.finance },
                { icon: GraduationCap, label: 'Lifestyle & Quality', text: selectedScenario?.impacts.quality }
              ].map((box, i) => (
                <div key={i} className="glass p-5 rounded-2xl border border-white/5 flex gap-4 items-start">
                  <div className="mt-1 p-2 rounded-lg bg-white/5">
                    <box.icon size={18} className="text-[#00FFA3]" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 mb-1">{box.label}</h5>
                    <p className="text-sm leading-relaxed opacity-80">{box.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 glass rounded-2xl bg-gradient-to-br from-[#00FFA3]/10 to-transparent flex items-center gap-4">
                           <TrendingUp className="text-[#00FFA3]" size={32} />
               <p className="text-xs italic leading-relaxed">
                 By voting for policies that align with this path today, you are actively drafting this version of your future history.
               </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 glass p-4 rounded-xl font-bold opacity-60 hover:opacity-100"
              >
                Change Path
              </button>
              <button 
                onClick={onClose}
                className="flex-1 bg-[#00FFA3] text-[#0A192F] p-4 rounded-xl font-bold shadow-[0_0_20px_rgba(0,255,163,0.3)]"
              >
                Commit to Future
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HeartIcon = ({ size, className, style }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
        strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={style}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
