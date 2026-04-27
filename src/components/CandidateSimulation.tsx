import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  ShieldAlert, 
  Coins, 
  MessageSquare, 
  Newspaper,
  ChevronRight,
  RotateCcw,
  Bot
} from 'lucide-react';

interface Choice {
  id: string;
  text: string;
  impact: {
    popularity: number;
    budget: number;
    integrity: number;
  };
  reaction: string;
  media: string;
}

interface Step {
  id: number;
  title: string;
  description: string;
  choices: Choice[];
}

const steps: Step[] = [
  {
    id: 1,
    title: "Campaign Promise",
    description: "What will be the cornerstone of your campaign for the Bharat-Nagar constituency?",
    choices: [
      {
        id: "c1",
        text: "Modern Infrastructure (Metro & 6-Lane Highways)",
                impact: { popularity: 15, budget: -40, integrity: 10 },
        reaction: "Urban youth are excited about the vision for a global city!",
        media: "Nagar-Times: 'Infrastructure push promises a world-class hub for the North.'"
      },
      {
        id: "c2",
        text: "Farmer Welfare (Direct Cash & Subsidies)",
        impact: { popularity: 30, budget: -60, integrity: 5 },
        reaction: "Massive surge in rural approval ratings and village support.",
        media: "Jan-Awaaz: 'Populist wave hits Bharat-Nagar as farm promises soar.'"
      },
      {
        id: "c3",
        text: "Clean Governance (Digital Records & Anti-Corruption)",
        impact: { popularity: 5, budget: -10, integrity: 40 },
        reaction: "The educated class applauds the push for transparency.",
        media: "Policy Review: 'Radical transparency proposed to fix the system from within.'"
      }
    ]
  },
  { id: 2,
    title: "Political Alliance",
    description: "A major regional party offers a pre-poll alliance. How do you proceed?",
    choices: [
      {
        id: "a1",
        text: "Accept - Gain their dedicated cadre & booth management.",
        impact: { popularity: 20, budget: 30, integrity: -25 },
        reaction: "You've gained organization power, but lost the 'pure outsider' tag.",
        media: "Rajneeti Daily: 'The dark horse joins the big league. Is the vision diluted?'"
      },
      {
        id: "a2",
        text: "Stay Independent - Focus on youth volunteers and grassroots.",
        impact: { popularity: 10, budget: -10, integrity: 30 },
        reaction: "Core supporters are fiercely loyal to your independent stance.",
        media: "Lok-Samachar: 'Standing alone against the storm. A true test of grit.'"
      }
    ]
  },
  {
    id: 3,
    title: "Final Push Strategy",
    description: "It's the last 48 hours. How do you spend your final energy?",
    choices: [
      {
        id: "b1",
        text: "24/7 Social Media & WhatsApp Campaign",
        impact: { popularity: 25, budget: -30, integrity: -5 },
        reaction: "Your message is on every mobile screen in the area.",
        media: "Digital Feed: 'Targeted messaging reaches the last-mile voter.'"
              },
      {
        id: "b2",
        text: "Marathon Padayatra & Nukkad Sabhas",
        impact: { popularity: 15, budget: -20, integrity: 10 },
        reaction: "Traditional voters feel respected by the personal touch.",
        media: "Village Voice: 'Candidate walks the streets to connect with the common man.'"
      }
    ]
  }
];

export const CandidateSimulation = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stats, setStats] = useState({ popularity: 40, budget: 100, integrity: 80 });
  const [history, setHistory] = useState<Choice[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleChoice = (choice: Choice) => {
    setStats(prev => ({
      popularity: Math.min(100, Math.max(0, prev.popularity + choice.impact.popularity)),
      budget: Math.max(0, prev.budget + choice.impact.budget),
      integrity: Math.min(100, Math.max(0, prev.integrity + choice.impact.integrity))
    }));
    setHistory([...history, choice]);
    setShowResult(true);
  };

  const nextStep = () => {
    setShowResult(false);
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
     setCurrentStep(0);
    setStats({ popularity: 40, budget: 100, integrity: 80 });
    setHistory([]);
    setIsFinished(false);
    setShowResult(false);
  };

  const getFinalVerdict = () => {
    if (stats.popularity > 70 && stats.integrity > 50) return { title: "Landslide Victory", desc: "A visionary leader with a clean mandate." };
    if (stats.popularity > 50) return { title: "Narrow Win", desc: "You barely won, but alliances come with strings attached." };
    if (stats.integrity > 80) return { title: "Respected Loss", desc: "You lost the seat but won the moral high ground." };
    return { title: "Defeat", desc: "Your campaign failed to resonate with the masses." };
  };

  return (
    <div className="fixed inset-0 z-[200] glass flex flex-col p-6 overflow-y-auto no-scrollbar">
      {/* Simulation Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[#00FFA3] font-mono text-[10px] uppercase tracking-widest">Candidate Simulation</h2>
          <h3 className="text-xl font-bold">Bharat-Nagar Run</h3>
        </div>
        <button onClick={onClose} className="p-2 glass rounded-full hover:border-[#00FFA3]/50">
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Popularity', val: `${stats.popularity}%`, icon: Users, color: '#00FFA3' },
          { label: 'Budget', val: `₹${stats.budget} Cr`, icon: Coins, color: '#E6FBFF' },
          { label: 'Integrity', val: `${stats.integrity}%`, icon: ShieldAlert, color: '#00FFA3' }
        ].map((s, i) => (
          <div key={i} className="glass p-3 rounded-xl border-opacity-10" style={{ borderColor: s.color }}>
            <s.icon size={14} className="mb-2 opacity-50" style={{ color: s.color }} />
            <p className="text-[10px] font-mono uppercase opacity-40">{s.label}</p>
            <p className="text-sm font-bold font-mono">{s.val}</p>
                       <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ width: typeof s.val === 'string' && s.val.includes('%') ? s.val : `${Math.min(100, parseInt(s.val.replace(/\D/g,'')))}%` }}
                 className="h-full" 
                 style={{ backgroundColor: s.color }} 
               />
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isFinished ? (
          !showResult ? (
            <motion.div 
              key="step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="glass p-5 rounded-2xl border-l-4 border-l-[#00FFA3]">
                <p className="text-[10px] font-mono opacity-50 mb-1">Step {currentStep + 1} of {steps.length}</p>
                <h4 className="text-lg font-bold mb-2">{steps[currentStep].title}</h4>
                <p className="text-sm opacity-70 leading-relaxed">{steps[currentStep].description}</p>
              </div>

              <div className="space-y-3">
                {steps[currentStep].choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice)}
                    className="w-full glass p-4 rounded-xl text-left hover:border-[#00FFA3] transition-all group relative overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-sm font-medium pr-4">{choice.text}</span>
                      <ChevronRight size={16} className="text-[#00FFA3] opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                    <div className="absolute inset-0 bg-[#00FFA3] opacity-0 group-hover:opacity-[0.03] transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="glass p-6 rounded-2xl border border-[#00FFA3]/30">
                <div className="flex items-center gap-2 mb-4 text-[#00FFA3]">
                  <MessageSquare size={18} />
                  <span className="text-xs font-mono uppercase tracking-widest">Ground Reaction</span>
                </div>
                <p className="text-lg italic font-light">"{history[history.length - 1].reaction}"</p>
              </div>

              <div className="glass p-6 rounded-2xl bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-4 text-blue-300">
                  <Newspaper size={18} />
                    <span className="text-xs font-mono uppercase tracking-widest">Media Coverage</span>
                </div>
                <p className="text-sm border-l-2 border-blue-400/30 pl-4 py-2 font-mono opacity-80">{history[history.length - 1].media}</p>
              </div>

              <button
                onClick={nextStep}
                className="w-full bg-[#00FFA3] text-[#0A192F] font-bold p-4 rounded-xl shadow-[0_0_20px_rgba(0,255,163,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Proceed to {currentStep < steps.length - 1 ? 'Next Step' : 'Final Results'}
              </button>
            </motion.div>
          )
        ) : (
          <motion.div 
            key="finish"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="inline-flex glass p-6 rounded-full mb-6 border-[#00FFA3]/30">
              <Trophy size={48} className="text-[#00FFA3] hologram-glow" />
            </div>
            <h2 className="text-4xl font-black text-glow mb-2">{getFinalVerdict().title}</h2>
            <p className="text-sm opacity-60 mb-10">{getFinalVerdict().desc}</p>
            
            <div className="glass p-6 rounded-2xl text-left mb-8">
              <h5 className="text-[10px] font-mono uppercase opacity-40 mb-4 tracking-tighter">Campaign Summary</h5>
              <div className="space-y-4">
                {history.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1 bg-[#00FFA3] rounded-full" />
                    <div>
                      <p className="text-[10px] font-mono opacity-30">Decision {i+1}</p>
                                           <p className="text-xs opacity-80">{h.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={restart}
                className="flex-1 glass p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-[#00FFA3]/50"
              >
                <RotateCcw size={18} /> Retry
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-[#00FFA3] text-[#0A192F] p-4 rounded-xl font-bold hover:scale-[1.02] shadow-[0_0_15px_rgba(0,255,163,0.2)]"
              >
                Exit Simulation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto py-10 flex items-center justify-center gap-2 opacity-20 hover:opacity-100 transition-opacity cursor-default">
        <Bot size={14} />
        <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Neural Campaign Engine Active</span>
      </div>
    </div>
  );
};
