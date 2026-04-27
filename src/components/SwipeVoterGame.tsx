import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  Info, 
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Zap,
  ChevronRight
} from 'lucide-react';

interface PromiseData {
  id: number;
  statement: string;
  isRealistic: boolean;
  explanation: string;
  cost: string;
  feasibility: string;
}

const promises: PromiseData[] = [
  {
    id: 1,
    statement: "Free 24/7 hyper-speed internet for every citizen by next year.",
    isRealistic: false,
    explanation: "Infrastructure rollout of this scale typically takes 5-10 years and billions in spectrum auctions.",
    cost: "Est. $50B+ annually",
    feasibility: "Highly Unlikely"
  },
  {
    id: 2,
    statement: "Gradual transition to 40% renewable energy by 2030.",
    isRealistic: true,
    explanation: "Many nations are already on this trajectory through solar and wind investment subsidies.",
    cost: "Infrastructure Reallocation",
    feasibility: "Realistic"
  },
  {
    id: 3,statement: "Zero income tax for all citizens while doubling defense spend.",
    isRealistic: false,
    explanation: "Income tax is a primary revenue source; doubling spend while cutting income leads to immediate debt crisis.",
    cost: "Fiscal Collapse Risk",
    feasibility: "Economically Impossible"
  },
  {
    id: 4,
    statement: "Mandatory coding classes in all government primary schools.",
    isRealistic: true,
    explanation: "feasible with right public-private partnerships and teacher training programs.",
    cost: "$2B Initial / $500M Recurring",
    feasibility: "Achievable"
  }
];

export const SwipeVoterGame = ({ onClose }: { onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleSwipe = (dir: 'left' | 'right') => {
    const isRealisticChoice = dir === 'right';
    if (isRealisticChoice === promises[currentIndex].isRealistic) {
      setScore(prev => prev + 1);
    }
    setRevealed(true);
  };

  const nextQuestion = () => {
    setRevealed(false);
    if (currentIndex < promises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      x.set(0);    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsFinished(false);
    setScore(0);
    setRevealed(false);
    x.set(0);
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-[200] glass flex flex-col items-center justify-center p-8 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-8 rounded-3xl border-[#00FFA3]/20"
        >
          <div className="inline-flex glass p-6 rounded-full mb-6">
            <Zap size={48} className="text-[#00FFA3]" />
          </div>
          <h2 className="text-3xl font-black text-glow mb-2">Analysis Complete</h2>
          <p className="text-[#E6FBFF] opacity-60 mb-6">You identified {score} out of {promises.length} promises correctly.</p>
          
          <div className="flex gap-4">
            <button onClick={restart} className="flex-1 glass p-4 rounded-xl flex items-center justify-center gap-2 font-bold hover:border-[#00FFA3]">
              <RotateCcw size={18} /> Retry
            </button>
            <button onClick={onClose} className="flex-1 bg-[#00FFA3] text-[#0A192F] p-4 rounded-xl font-bold">
              Done
            </button>
          </div>
        </motion.div>
      </div>
    ); }

  return (
    <div className="fixed inset-0 z-[200] glass flex flex-col p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[#00FFA3] font-mono text-[10px] uppercase tracking-widest">Fact-Check Engine</h2>
          <h3 className="text-xl font-bold">Real vs Fake</h3>
        </div>
        <button onClick={onClose} className="p-2 glass rounded-full">
          <XCircle size={18} />
        </button>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key={`card-${currentIndex}`}
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) handleSwipe('right');
                else if (info.offset.x < -100) handleSwipe('left');
              }}
              className="w-full max-w-sm glass aspect-[3/4] rounded-3xl p-8 flex flex-col items-center justify-center text-center relative cursor-grab active:cursor-grabbing border-2 border-white/5"
            >
              <div className="absolute top-6 left-6 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-[10px] font-mono opacity-40 uppercase">Analyzing Proposal...</span>
              </div>
               <Sparkles size={32} className="text-[#00FFA3] opacity-30 mb-6" />
              <h4 className="text-xl font-bold leading-tight mb-4 select-none">
                "{promises[currentIndex].statement}"
              </h4>
              
              <div className="mt-auto w-full flex justify-between items-center opacity-30 text-[10px] font-mono uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <ArrowLeft size={12} /> Swipe Unrealistic
                </div>
                <div className="flex items-center gap-1">
                  Swipe Realistic <ArrowRight size={12} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`reveal-${currentIndex}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm glass rounded-3xl p-6 border-[#00FFA3]/30"
            >
              <div className="flex items-center gap-3 mb-6">
                {promises[currentIndex].isRealistic ? (
                  <div className="p-2 bg-[#00FFA3]/20 rounded-lg">
                    <CheckCircle2 className="text-[#00FFA3]" />
                  </div>
                ) : (
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <XCircle className="text-red-400" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-lg">
                    {promises[currentIndex].isRealistic ? 'Realistic Policy' : 'Unrealistic Promise'}
                  </h4>
                  <p className="text-xs opacity-50 font-mono uppercase">Status Verdict</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="glass p-4 rounded-xl bg-white/[0.02]">   <p className="text-[10px] font-mono opacity-50 uppercase mb-1">Critical Insight</p>
                  <p className="text-sm leading-relaxed">{promises[currentIndex].explanation}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass p-3 rounded-xl">
                    <p className="text-[9px] font-mono opacity-40 uppercase">Cost Impact</p>
                    <p className="text-xs font-bold text-[#00FFA3]">{promises[currentIndex].cost}</p>
                  </div>
                  <div className="glass p-3 rounded-xl">
                    <p className="text-[9px] font-mono opacity-40 uppercase">Feasibility</p>
                    <p className="text-xs font-bold text-blue-300">{promises[currentIndex].feasibility}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={nextQuestion}
                className="w-full bg-[#00FFA3] text-[#0A192F] font-bold p-4 rounded-xl flex items-center justify-center gap-2"
              >
                Next Statement <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center gap-1">
        {promises.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-8 bg-[#00FFA3]' : 'w-2 bg-white/10'
            }`} 
          />
        ))}
      </div>
    </div>
  );

};
