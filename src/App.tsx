/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Vote, 
  MapPin, 
  Users, 
  TrendingUp, 
  Calendar, 
  Search, 
  Bell, 
  ChevronRight,
  ShieldCheck,
  Cpu,
  Globe,
  Gamepad2,
  Bot,
  Dna,
  UserCircle
} from 'lucide-react';
import { Background3D } from './components/Background3D';
import { ElectionData } from './components/ElectionData';
import { NodesBackground } from './components/NodesBackground';
import { CandidateSimulation } from './components/CandidateSimulation';
import { SwipeVoterGame } from './components/SwipeVoterGame';
import { VoteImpactCalculator } from './components/VoteImpactCalculator';
import { ElectionDayCompanion } from './components/ElectionDayCompanion';
import { MiniGamesPack } from './components/MiniGamesPack';
import { AIChatbot } from './components/AIChatbot';
import { PoliticalDNA } from './components/PoliticalDNA';
import { FutureYouSimulator } from './components/FutureYouSimulator';
import { SecurityDashboard } from './components/SecurityDashboard';
import { SecurityManager } from './security';

const HolographicCard = ({ children, className = '', title = '', onClick }: { children: React.ReactNode, className?: string, title?: string, onClick?: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
       className={`glass rounded-2xl p-4 overflow-hidden relative cursor-pointer ${className}`}
  >
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FFA3] to-transparent opacity-50" />
    <div className="absolute top-1 left-2 w-1 h-1 rounded-full bg-[#00FFA3] shadow-[0_0_8px_#00FFA3]" />
    {title && (
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00FFA3] opacity-80">{title}</h3>
        <Cpu size={12} className="text-[#00FFA3] opacity-40" />
      </div>
    )}
    {children}
  </motion.div>
);

const NavItem = ({ icon: Icon, active, onClick }: { icon: any, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl transition-all duration-300 relative ${
      active ? 'text-[#00FFA3]' : 'text-[#E6FBFF] opacity-40 hover:opacity-100'
    }`}
  >
    <Icon size={24} />
    {active && (
      <motion.div 
        layoutId="nav-active"
        className="absolute inset-0 bg-[#00FFA3] opacity-[0.05] rounded-xl border border-[#00FFA3] border-opacity-20 hologram-glow"
      />
    )}
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
    const [isSimulating, setIsSimulating] = useState(false);
  const [isPlayingSwipe, setIsPlayingSwipe] = useState(false);
  const [isAnalyzingImpact, setIsAnalyzingImpact] = useState(false);
  const [isShowingCompanion, setIsShowingCompanion] = useState(false);
  const [isGaming, setIsGaming] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isTestingDNA, setIsTestingDNA] = useState(false);
  const [isSimulatingFuture, setIsSimulatingFuture] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isShowingSecurity, setIsShowingSecurity] = useState(false);

  // Initialize the security system on app mount
  useEffect(() => {
    SecurityManager.initialize().then(() => {
      console.log('%c🛡️ ELECTRA Security System Online', 'color: #00FFA3; font-weight: bold; font-size: 14px;');
    });
  }, []);

  const features = [
    { title: "Simulate", subtitle: "Be Candidate", icon: Vote, color: "#00FFA3", action: () => setIsSimulating(true) },
    { title: "Fact Check", subtitle: "Real vs Fake", icon: Search, color: "#93C5FD", action: () => setIsPlayingSwipe(true) },
    { title: "Your Impact", subtitle: "Magnitude Calc", icon: TrendingUp, color: "#00FFA3", action: () => setIsAnalyzingImpact(true) },
    { title: "Stations", subtitle: "GEO Tracker", icon: MapPin, color: "#93C5FD", action: () => setIsShowingCompanion(true) },
    { title: "Academy", subtitle: "Mini Games", icon: Gamepad2, color: "#F87171", action: () => setIsGaming(true) },
    { title: "Electra AI", subtitle: "24/7 Smart Support", icon: Bot, color: "#00FFA3", action: () => setIsChatting(true) },
    { title: "Pol-DNA", subtitle: "Ideology Match", icon: Dna, color: "#E879F9", action: () => setIsTestingDNA(true) },
    { title: "2031 Vision", subtitle: "Life Projection", icon: UserCircle, color: "#60A5FA", action: () => setIsSimulatingFuture(true) },
  ];

  const filteredFeatures = searchQuery 
    ? features.filter(f => 
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : features;

  return (
    <div className="relative min-h-screen bg-[#0A192F] text-[#E6FBFF] font-sans selection:bg-[#00FFA3] selection:text-[#0A192F]">
      <Background3D />
      <NodesBackground />
      
      <AnimatePresence>
        {isSimulating && (
          <CandidateSimulation onClose={() => setIsSimulating(false)} />
        )}
         {isPlayingSwipe && (
          <SwipeVoterGame onClose={() => setIsPlayingSwipe(false)} />
        )}
        {isAnalyzingImpact && (
          <VoteImpactCalculator onClose={() => setIsAnalyzingImpact(false)} />
        )}
        {isShowingCompanion && (
          <ElectionDayCompanion onClose={() => setIsShowingCompanion(false)} />
        )}
        {isGaming && (
          <MiniGamesPack onClose={() => setIsGaming(false)} />
        )}
        {isChatting && (
          <AIChatbot onClose={() => setIsChatting(false)} />
        )}
        {isTestingDNA && (
          <PoliticalDNA onClose={() => setIsTestingDNA(false)} />
        )}
        {isSimulatingFuture && (
          <FutureYouSimulator onClose={() => setIsSimulatingFuture(false)} />
        )}
        {isShowingSecurity && (
          <SecurityDashboard onClose={() => setIsShowingSecurity(false)} />
        )}
      </AnimatePresence>

      {/* Mobile-style Container */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative z-10 px-6 pt-12 pb-24 h-screen overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl font-bold tracking-tight text-glow">
              ELECTRA <span className="text-[#00FFA3] font-mono text-sm underline decoration-[#00FFA3]/30 underline-offset-4">v3.0</span>
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-widest opacity-50 mt-1">Indian Election Hub</p>
          </motion.div>
          <div className="flex gap-3">
                      <button 
              onClick={() => setShowSearch(!showSearch)}
              className={`glass p-2 rounded-full transition-colors ${showSearch ? 'border-[#00FFA3] text-[#00FFA3]' : 'hover:border-[#00FFA3]/50'}`}
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setIsShowingSecurity(true)}
              className="glass p-2 rounded-full relative hover:border-[#00FFA3]/50 transition-colors group"
              title="Security Dashboard"
            >
              <ShieldCheck size={18} className="text-[#00FFA3] opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
            </button>
            <div className="glass p-2 rounded-full relative">
              <Bell size={18} className="opacity-40" />
            </div>
          </div>
        </header>

        {/* Search Bar Inline */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="relative">
                <input 
                  type="text"
                  autoFocus
                  placeholder="Search features (e.g. AI, DNA, Games)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full glass bg-transparent p-4 rounded-xl border-white/10 outline-none focus:border-[#00FFA3]/30 text-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 opacity-40 hover:opacity-100"
                      >
                    <ChevronRight size={14} className="rotate-90" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Election Status */}
        <HolographicCard title="Live Statistics" className="mb-6">
          <ElectionData />
        </HolographicCard>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {filteredFeatures.length > 0 ? (
            filteredFeatures.map((f, i) => (
              <HolographicCard 
                key={i}
                onClick={f.action}
                className="flex flex-col items-center justify-center py-6 group"
              >
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center mb-3 group-hover:border-[#00FFA3] transition-all">
                  <f.icon className="transition-colors" style={{ color: f.color }} size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">{f.title}</span>
                <span className="text-[10px] opacity-40 font-mono mt-1">{f.subtitle}</span>
              </HolographicCard>
            ))
          ) : (
            <div className="col-span-2 glass p-8 rounded-2xl text-center opacity-40">
              <p className="text-sm font-mono uppercase">No features found for "{searchQuery}"</p>
                    </div>
          )}
        </div>

        {/* Countdown / Next Event */}
        <HolographicCard title="Upcoming Election Phase" className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center border-blue-400/20">
              <Calendar className="text-blue-200" size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">General Phase 1</p>
              <p className="text-[10px] font-mono opacity-50 uppercase mt-0.5">May 12, 2026</p>
            </div>
            <div className="text-right">
              <p className="text-[#00FFA3] font-mono text-xs font-bold">16d : 08h</p>
              <p className="text-[9px] opacity-30 uppercase tracking-tighter">Poll Timer</p>
            </div>
          </div>
        </HolographicCard>

        {/* Top Candidates */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40">Candidate Profiles</h2>
            <button className="text-[10px] uppercase text-[#00FFA3] hover:underline flex items-center gap-1">
              View All <ChevronRight size={10} />
            </button>
          </div>
          
          {[
            { name: 'Rahul Sharma', role: 'Progessive', icon: Users },
            { name: 'Priya Patel', role: 'Conservative', icon: ShieldCheck },
            { name: 'Arjun Singh', role: 'Independent', icon: Globe }
          ].map((candidate, idx) => (
            <motion.div 
              key={idx}
               whileHover={{ x: 5 }}
              className="glass p-3 rounded-xl flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00FFA3]/20 via-transparent to-blue-500/10 border border-[#E6FBFF]/5 flex items-center justify-center">
                <candidate.icon size={18} className="opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all text-[#E6FBFF]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold">{candidate.name}</p>
                <p className="text-[9px] font-mono uppercase opacity-40">{candidate.role}</p>
              </div>
              <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-all text-[#00FFA3]" />
            </motion.div>
          ))}
        </div>

        {/* Nodes/Data Feed */}
        <HolographicCard title="Network Status" className="bg-[#00FFA3]/[0.02]">
           <div className="flex flex-wrap gap-2">
             {['Node-Alpha', 'Block: 82.1k', 'Verified', 'Sentry: ON'].map(tag => (
               <div key={tag} className="px-2 py-1 glass rounded text-[9px] font-mono opacity-60 flex items-center gap-1">
                 <div className="w-1 h-1 rounded-full bg-[#00FFA3] animate-pulse" />
                 {tag}
               </div>
             ))}
           </div>
        </HolographicCard>

      </div>

      {/* VFX: Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]" style={{ 
        backgroundImage: 'linear-gradient(#E6FBFF 1px, transparent 1px), linear-gradient(90deg, #E6FBFF 1px, transparent 1px)',
               backgroundSize: '40px 40px'
      }} />
      
      {/* Scanning Line VFX */}
      <motion.div 
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="fixed left-0 w-full h-[100px] bg-gradient-to-b from-[#00FFA3]/10 to-transparent pointer-events-none z-[101] opacity-[0.05]"
      />
    </div>
  );
}
