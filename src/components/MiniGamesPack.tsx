import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { 
  Gamepad2, 
  X, 
  Trophy, 
  Timer, 
  Brain, 
  History, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

// --- Types ---
type GameType = 'timeline' | 'rules' | 'quiz' | null;

// --- Data ---
const timelineSteps = [
  { id: '1', text: 'Electoral Rolls updated' },
  { id: '2', text: 'Elections announced' },
  { id: '3', text: 'Nominations filed' },
  { id: '4', text: 'Campaign period' },
  { id: '5', text: 'Polling day' },
  { id: '6', text: 'Counting and Results' },
];

const rulesQuiz = [
  {
    question: "What is the minimum age to contest for Lok Sabha?",
    options: ["21", "25", "30", "35"],
    correct: 1
  },
  {
    question: "How much is the security deposit for a General candidate?",
    options: ["₹10,000", "₹15,000", "₹25,000", "₹50,000"],
    correct: 2
  },
  {
    question: "A candidate wins if they get 'First Past the Post'. What does this mean?",
        options: ["Get 50% + 1 votes", "Get more votes than any other candidate", "Get 2/3rd majority", "Reach 1 million votes first"],
    correct: 1
  }
];

// --- Mini Games Pack Component ---
export const MiniGamesPack = ({ onClose }: { onClose: () => void }) => {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  
  return (
    <div className="fixed inset-0 z-[200] glass flex flex-col p-6 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[#00FFA3] font-mono text-[10px] uppercase tracking-widest">Training Arc</h2>
          <h3 className="text-xl font-bold">Mini-Games Hub</h3>
        </div>
        <button onClick={onClose} className="p-2 glass rounded-full hover:border-[#00FFA3]/50">
          <X size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!activeGame ? (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid gap-4"
          >
            <GameCard 
              title="Timeline Puzzle" 
              desc="Arrange the voting process steps in order" 
              icon={History} 
              color="#00FFA3"
              onClick={() => setActiveGame('timeline')}
                />
            <GameCard 
              title="Rule Hunter" 
              desc="Identify true election laws and regulations" 
              icon={Brain} 
              color="#60A5FA"
              onClick={() => setActiveGame('rules')}
            />
            <GameCard 
              title="Quiz Battle" 
              desc="Rapid fire questions vs the Election Engine" 
              icon={Gamepad2} 
              color="#F87171"
              onClick={() => setActiveGame('quiz')}
            />
          </motion.div>
        ) : activeGame === 'timeline' ? (
          <TimelinePuzzle onBack={() => setActiveGame(null)} />
        ) : activeGame === 'rules' ? (
          <RulesHunter onBack={() => setActiveGame(null)} />
        ) : (
          <QuizBattle onBack={() => setActiveGame(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-Components ---

const GameCard = ({ title, desc, icon: Icon, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="glass p-6 rounded-2xl text-left flex items-center gap-4 group hover:border-white/20 transition-all border border-white/5 active:scale-95"
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center glass group-hover:scale-110 transition-transform" style={{ color }}>
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <h4 className="font-bold">{title}</h4>
           <p className="text-xs opacity-40 leading-relaxed mt-0.5">{desc}</p>
    </div>
    <ChevronRight size={18} className="opacity-20 group-hover:opacity-100 transition-all" style={{ color }} />
  </button>
);

// 1. Timeline Puzzle
const TimelinePuzzle = ({ onBack }: { onBack: () => void }) => {
  const [items, setItems] = useState(() => [...timelineSteps].sort(() => Math.random() - 0.5));
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkOrder = () => {
    const isRight = items.every((item, i) => item.id === timelineSteps[i].id);
    setIsCorrect(isRight);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="glass p-4 rounded-xl">
        <p className="text-xs opacity-60 text-center">Drag items into the correct sequence from start to finish.</p>
      </div>

      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
        {items.map((item) => (
          <Reorder.Item 
            key={item.id} 
            value={item}
            className="glass p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-[#00FFA3]/30 transition-colors flex items-center gap-3"
          >
            <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5 text-[10px] font-mono">::</div>
            <span className="text-sm font-medium">{item.text}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {isCorrect === null ? (
        <button 
          onClick={checkOrder}
          className="w-full bg-[#00FFA3] text-[#0A192F] p-4 rounded-xl font-bold"
        >
          Verify Sequence
                  </button>
      ) : (
        <div className={`p-4 rounded-xl border text-center animate-in zoom-in-50 duration-300 ${isCorrect ? 'bg-[#00FFA3]/10 border-[#00FFA3] text-[#00FFA3]' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            {isCorrect ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span className="font-bold">{isCorrect ? 'Sequence Verified' : 'Incorrect Sequence'}</span>
          </div>
          <p className="text-xs opacity-60">{isCorrect ? 'Total mastery of the process!' : 'Try again to get the flow right.'}</p>
          <button 
            onClick={() => { setIsCorrect(null); setItems([...timelineSteps].sort(() => Math.random() - 0.5)); }}
            className="mt-4 text-xs font-mono uppercase tracking-widest underline decoration-dotted"
          >
            Reset Puzzle
          </button>
        </div>
      )}

      <button onClick={onBack} className="w-full glass p-4 rounded-xl opacity-40 font-bold">Back to Hub</button>
    </motion.div>
  );
};

// 2. Rules Hunter (Guess the Rule)
const RulesHunter = ({ onBack }: { onBack: () => void }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx: number) => {
    setSelected(idx);
    if (idx === rulesQuiz[current].correct) setScore(s => s + 1);
    
    setTimeout(() => {
      if (current < rulesQuiz.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
    };

  if (showResult) return (
     <div className="text-center py-10 space-y-6">
       <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-4 border-[#60A5FA]/30">
         <Trophy size={40} className="text-[#60A5FA]" />
       </div>
       <h4 className="text-2xl font-bold">Knowledge Level: {score}/{rulesQuiz.length}</h4>
       <button onClick={onBack} className="w-full glass p-4 rounded-xl font-bold">Close</button>
     </div>
  );

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="glass p-6 rounded-2xl border-l-4 border-l-[#60A5FA]">
        <p className="text-[10px] font-mono opacity-50 uppercase mb-2">Rule Q{current + 1}</p>
        <h4 className="text-lg font-bold leading-relaxed">{rulesQuiz[current].question}</h4>
      </div>

      <div className="grid gap-3">
        {rulesQuiz[current].options.map((opt, i) => (
          <button
            key={i}
            disabled={selected !== null}
            onClick={() => handleSelect(i)}
            className={`w-full glass p-4 rounded-xl text-left transition-all ${
              selected === i 
                ? (i === rulesQuiz[current].correct ? 'border-[#00FFA3] bg-[#00FFA3]/10' : 'border-red-500 bg-red-500/10')
                : 'hover:border-white/20'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
     );
};

// 3. Quiz Battle
const QuizBattle = ({ onBack }: { onBack: () => void }) => {
  const [battleState, setBattleState] = useState<'idle' | 'active'>('idle');
  const [timeLeft, setTimeLeft] = useState(30);

  // Simplified version: just a countdown for now in this prototype
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-[400px] items-center justify-center text-center">
      {battleState === 'idle' ? (
        <>
          <div className="w-24 h-24 glass rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Timer size={48} className="text-red-400" />
          </div>
          <h4 className="text-xl font-bold mb-2">Simulate Quiz Battle</h4>
          <p className="text-sm opacity-40 mb-8 max-w-[200px]">Test your speed against the AI Election Engine.</p>
          <button 
            onClick={() => setBattleState('active')}
            className="w-full bg-red-500 text-white p-4 rounded-xl font-bold shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          >
            Initialize Combat
          </button>
        </>
      ) : (
        <div className="space-y-8 w-full">
          <div className="glass p-8 rounded-full border-red-500/20 aspect-square flex flex-col items-center justify-center w-40 mx-auto">
            <span className="text-[10px] font-mono opacity-50">SYNCING...</span>
            <span className="text-4xl font-black text-red-400">{timeLeft}s</span>
          </div>
          <p className="text-sm italic opacity-60">"Preparing neural networking for opponent simulation..."</p>
          <button onClick={() => setBattleState('idle')} className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">Abort Mission</button>
        </div>
      )}
      <button onClick={onBack} className="mt-auto w-full glass p-4 rounded-xl opacity-40 font-bold">Return to Hub</button>
    </motion.div>
  );
};
