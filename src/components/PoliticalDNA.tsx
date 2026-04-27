import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dna, 
  X, 
  ChevronRight, 
  Shield, 
  Zap, 
  Heart, 
  Sparkles,
  RefreshCcw,
  Scale
} from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    value: 'development' | 'welfare' | 'reform';
  }[];
}

const dnaQuestions: Question[] = [
  {
    id: 1,
    text: "What do you think should be the top priority for a new government?",
    options: [
      { text: "Building state-of-the-art infrastructure and cities", value: 'development' },
      { text: "Expanding healthcare and food security for all", value: 'welfare' },
      { text: "Digitalizing systems to reduce corruption", value: 'reform' },
    ]
  },
  {
    id: 2,
    text: "How should the education system be improved?",
    options: [
      { text: "Focusing on technical skills and global competitiveness", value: 'development' },
      { text: "Ensuring free and equal access to basic primary education", value: 'welfare' },
      { text: "Revising outdated curricula and examination methods", value: 'reform' },
    ]
  },
  {
    id: 3,
    text: "What is the best way to handle economic growth?",
    options: [
      { text: "Attracting large-scale foreign investment and industries", value: 'development' },
      { text: "Supporting rural livelihoods and self-help groups", value: 'welfare' },
      { text: "Simplifying tax laws and labor regulations", value: 'reform' },
    ]
  },
  {
    id: 4,
    text: "Which of these environmental strategies is best?",
    options: [
      { text: "Massive scale-up of renewable energy plants", value: 'development' },
      { text: "Subsidizing clean cooking fuel for low-income homes", value: 'welfare' },
      { text: "Strict enforcement of pollution control laws", value: 'reform' },
    ]
  }
];

const personas = {
  development: {
    title: "Growth Visionary",
    desc: "You prioritize long-term structural progress, infrastructure, and positioning India as a global industrial hub.",
    icon: Zap,
    color: "#00FFA3"
  },
  welfare: {
    title: "Compassionate Centrist",
    desc: "You believe that development is only meaningful when it reaches the last person. You value social security and inclusive growth.",
    icon: Heart,
    color: "#60A5FA"
  },
  reform: {
       title: "Systemic Reformer",
    desc: "You feel the 'machinery' needs fixing first. You champion transparency, efficiency, and modernizing the governance system.",
    icon: Shield,
    color: "#E879F9"
  }
};

export const PoliticalDNA = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<('development' | 'welfare' | 'reform')[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: 'development' | 'welfare' | 'reform') => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (currentStep < dnaQuestions.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    const counts = answers.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let max = 0;
    let winner: 'development' | 'welfare' | 'reform' = 'development';
    
    for (const [key, count] of Object.entries(counts)) {
      if (count > max) {
        max = count;
        winner = key as any;
      }
    }
    return winner;
     };

  const winner = getResult();
  const persona = personas[winner];

  return (
    <div className="fixed inset-0 z-[200] glass flex flex-col p-6 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[#00FFA3] font-mono text-[10px] uppercase tracking-widest">Ideology Sync</h2>
          <h3 className="text-xl font-bold">Political DNA</h3>
        </div>
        <button onClick={onClose} className="p-2 glass rounded-full hover:border-[#00FFA3]/50">
          <X size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 className="absolute inset-y-0 left-0 bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]"
                 initial={{ width: 0 }}
                 animate={{ width: `${((currentStep + 1) / dnaQuestions.length) * 100}%` }}
               />
            </div>

            <div className="glass p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute -top-4 -right-4 opacity-5 rotate-12">
                <Dna size={120} />
              </div>
                            <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest mb-4">Question {currentStep + 1} of {dnaQuestions.length}</p>
              <h4 className="text-lg font-bold leading-relaxed">{dnaQuestions[currentStep].text}</h4>
            </div>

            <div className="grid gap-3">
              {dnaQuestions[currentStep].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full glass p-5 rounded-xl text-left text-sm hover:border-[#00FFA3]/30 active:scale-95 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full border border-white/20 group-hover:bg-[#00FFA3] transition-colors" />
                    {opt.text}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center space-y-6 py-8"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full glass flex items-center justify-center hologram-glow" style={{ borderColor: `${persona.color}50` }}>
                <persona.icon size={42} style={{ color: persona.color }} />
              </div>
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-2 border-2 border-dashed border-white/10 rounded-full"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-[#00FFA3] font-mono text-xs uppercase tracking-[0.3em]">Analysis Complete</h2>
                            <h3 className="text-3xl font-black">{persona.title}</h3>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
              <p className="text-sm opacity-70 leading-relaxed italic">
                "{persona.desc}"
              </p>
            </div>

            <div className="w-full p-4 glass rounded-xl border-dashed border border-white/10">
              <p className="text-[10px] font-mono opacity-40 uppercase mb-3">Alignment Breakdown</p>
              <div className="flex gap-2">
                {[
                  { label: 'Dev', val: answers.filter(a => a === 'development').length },
                  { label: 'Welfare', val: answers.filter(a => a === 'welfare').length },
                  { label: 'Reform', val: answers.filter(a => a === 'reform').length },
                ].map((stat, i) => (
                  <div key={i} className="flex-1 space-y-1">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white/20" 
                        style={{ width: `${(stat.val / answers.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono uppercase opacity-30">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full flex gap-3 pt-6">
              <button 
                onClick={() => { 
                  setShowResult(false); 
                  setCurrentStep(0); 
                  setAnswers([]); 
                }}
                className="flex-1 glass p-4 rounded-xl flex items-center justify-center gap-2 group"
              >
                <RefreshCcw size={16} className="opacity-40 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-xs font-bold uppercase tracking-widest">Retake</span>
              </button>
              <button 
                onClick={onClose}
                className="flex-1 bg-[#00FFA3] text-[#0A192F] p-4 rounded-xl font-bold font-mono text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,163,0.3)]"
              >
                Pledge Identity
              </button>
            </div>

            <p className="text-[9px] opacity-20 max-w-[240px] leading-relaxed">
              *Disclaimer: This is a purely educational intent mapping and does not endorse any political party.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
