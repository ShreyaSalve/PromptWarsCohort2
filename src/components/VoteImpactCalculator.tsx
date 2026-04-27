import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  MapPin, 
  BarChart, 
  Users, 
  Zap, 
  ChevronRight, 
  X,
  PieChart as PieChartIcon,
  TrendingUp,
  Activity
} from 'lucide-react';
import { 
  BarChart as RechartsBar, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface CityData {
  name: string;
  turnout: number;
  marginOfVictory: number;
  voterPopulation: string;
}

const citiesData: Record<string, CityData> = {
  'Pune': { name: 'Pune', turnout: 56.4, marginOfVictory: 4200, voterPopulation: '3.2M' },
  'Mumbai': { name: 'Mumbai', turnout: 52.8, marginOfVictory: 12500, voterPopulation: '9.8M' },
  'Delhi': { name: 'Delhi', turnout: 60.1, marginOfVictory: 8900, voterPopulation: '12.3M' },
  'Bengaluru': { name: 'Bengaluru', turnout: 54.2, marginOfVictory: 5400, voterPopulation: '7.1M' },
  'Hyderabad': { name: 'Hyderabad', turnout: 48.9, marginOfVictory: 3100, voterPopulation: '6.4M' },
};

const ageGroups = ['18-25', '26-35', '36-50', '50+'];
const issues = ['Infrastructure', 'Education', 'Environment', 'Economy'];

export const VoteImpactCalculator = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [city, setCity] = useState('Pune');
  const [age, setAge] = useState('18-25');
  const [issue, setIssue] = useState('Infrastructure');

  const cityInfo = citiesData[city];

  const chartData = [
    { name: 'Your Area', turnout: cityInfo.turnout, fill: '#00FFA3' },
    { name: 'National Avg', turnout: 67.4, fill: 'rgba(230, 251, 255, 0.2)' },
  ];

  return (
    <div className="fixed inset-0 z-[200] glass flex flex-col p-6 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[#00FFA3] font-mono text-[10px] uppercase tracking-widest">Impact Analysis</h2>
          <h3 className="text-xl font-bold">Vote Calculator</h3>
        </div>
        <button onClick={onClose} className="p-2 glass rounded-full hover:border-[#00FFA3]/50">
          <X size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
                     >
            <div className="space-y-4">
              <label className="text-[10px] font-mono uppercase opacity-50 tracking-wider">Select Location</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(citiesData).map(c => (
                  <button 
                    key={c}
                    onClick={() => setCity(c)}
                    className={`p-3 rounded-xl border transition-all text-sm font-medium ${
                      city === c ? 'border-[#00FFA3] bg-[#00FFA3]/10 text-[#00FFA3]' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-mono uppercase opacity-50 tracking-wider">Age Group</label>
              <div className="flex flex-wrap gap-2">
                {ageGroups.map(a => (
                  <button 
                    key={a}
                    onClick={() => setAge(a)}
                    className={`px-4 py-2 rounded-full border text-xs transition-all ${
                      age === a ? 'border-[#00FFA3] bg-[#00FFA3]/10 text-[#00FFA3]' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-mono uppercase opacity-50 tracking-wider">Primary Issue</label>
              <div className="grid grid-cols-2 gap-2">
                {issues.map(i => (  <button 
                    key={i}
                    onClick={() => setIssue(i)}
                    className={`p-3 rounded-xl border transition-all text-xs ${
                      issue === i ? 'border-[#00FFA3] bg-[#00FFA3]/10 text-[#00FFA3]' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#00FFA3] text-[#0A192F] font-bold p-4 rounded-xl shadow-[0_0_20px_rgba(0,255,163,0.3)] mt-8 flex items-center justify-center gap-2"
            >
              Analyze Magnitude <ChevronRight size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Visualizer */}
            <div className="glass p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Target size={80} />
              </div>
              <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest mb-4">Past Turnout: {city}</p>
              <div className="h-40 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBar data={chartData} layout="vertical" margin={{ left: -30 }}>
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" stroke="rgba(230,251,255,0.4)" fontSize={10} width={80} /><Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ background: '#0A192F', border: '1px solid #00FFA3', borderRadius: '8px' }}
                    />
                    <Bar dataKey="turnout" radius={[0, 4, 4, 0]} barSize={20}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </RechartsBar>
                </ResponsiveContainer>
              </div>
              <p className="text-xs opacity-60 leading-relaxed italic">
                Only {cityInfo.turnout}% of voters turned up in {city}. The power gap is wide.
              </p>
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-xl border-l-2 border-l-[#00FFA3]">
                <Activity size={16} className="text-[#00FFA3] mb-2" />
                <p className="text-[10px] font-mono opacity-40 uppercase">Victory Margin</p>
                <p className="text-lg font-bold">{cityInfo.marginOfVictory.toLocaleString()}</p>
                <p className="text-[9px] opacity-30 mt-1">Difference in last election</p>
              </div>
              <div className="glass p-4 rounded-xl border-l-2 border-l-blue-400">
                <Users size={16} className="text-blue-400 mb-2" />
                <p className="text-[10px] font-mono opacity-40 uppercase">Voter Base</p>
                <p className="text-lg font-bold">{cityInfo.voterPopulation}</p>
                <p className="text-[9px] opacity-30 mt-1">Total registered in {city}</p>
              </div>
            </div>

            {/* Hypothetical Impact */}
            <div className="glass p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-[#00FFA3]/5 to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-[#00FFA3]" size={20} />
                <h4 className="text-sm font-bold uppercase tracking-wider">The "Ripple Effect"</h4>
              </div>       <p className="text-sm opacity-80 leading-relaxed">
                If <span className="text-[#00FFA3] font-bold">1,000 people</span> in the <span className="text-[#00FFA3]">{age}</span> age group 
                vote specifically for <span className="text-[#00FFA3]">{issue}</span>, you close <span className="text-[#00FFA3] font-bold">24%</span> of the victory margin gap in {city}.
              </p>
              <div className="mt-6 p-4 glass rounded-xl bg-white/[0.02] border-dashed border border-white/10">
                <p className="text-[10px] font-mono opacity-40 uppercase mb-2">Impact Verdict</p>
                <p className="text-xs font-medium text-glow flex items-center gap-2">
                  <Zap size={12} className="text-[#00FFA3]" /> Your voice is not just a drop—it's the ripple that changes the tide.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 glass p-4 rounded-xl font-bold flex items-center justify-center gap-2 opacity-60 hover:opacity-100"
              >
                Back
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-[#00FFA3] text-[#0A192F] p-4 rounded-xl font-bold shadow-[0_0_15px_rgba(0,255,163,0.2)]"
              >
                Pledge to Vote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
