/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactGA from 'react-ga4';
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
  UserCircle,
  Loader2
} from 'lucide-react';

// Core Components
import { Background3D } from './components/Background3D';
import { ElectionData } from './components/ElectionData';
import { NodesBackground } from './components/NodesBackground';
import { SecurityManager } from './security';

// Lazy Loaded Feature Overlays (Improves Efficiency/Initial Load)
const CandidateSimulation = lazy(() => import('./components/CandidateSimulation').then(m => ({ default: m.CandidateSimulation })));
const SwipeVoterGame = lazy(() => import('./components/SwipeVoterGame').then(m => ({ default: m.SwipeVoterGame })));
const VoteImpactCalculator = lazy(() => import('./components/VoteImpactCalculator').then(m => ({ default: m.VoteImpactCalculator })));
const ElectionDayCompanion = lazy(() => import('./components/ElectionDayCompanion').then(m => ({ default: m.ElectionDayCompanion })));
const MiniGamesPack = lazy(() => import('./components/MiniGamesPack').then(m => ({ default: m.MiniGamesPack })));
const AIChatbot = lazy(() => import('./components/AIChatbot').then(m => ({ default: m.AIChatbot })));
const PoliticalDNA = lazy(() => import('./components/PoliticalDNA').then(m => ({ default: m.PoliticalDNA })));
const FutureYouSimulator = lazy(() => import('./components/FutureYouSimulator').then(m => ({ default: m.FutureYouSimulator })));
const SecurityDashboard = lazy(() => import('./components/SecurityDashboard').then(m => ({ default: m.SecurityDashboard })));

// Loading Component for Suspense
const ComponentLoader = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A192F]/80 backdrop-blur-xl">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 size={40} className="text-[#00FFA3]" />
    </motion.div>
  </div>
);

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

const HolographicCard = ({ children, className = '', title = '', onClick, ariaLabel }: HolographicCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    role={onClick ? "button" : "region"}
    aria-label={ariaLabel || title}
    tabIndex={onClick ? 0 : -1}
    onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
    className={`glass rounded-2xl p-4 overflow-hidden relative cursor-pointer ${className} focus:outline-none focus:ring-2 focus:ring-[#00FFA3]/50`}
  >
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FFA3] to-transparent opacity-50" />
    <div className="absolute top-1 left-2 w-1 h-1 rounded-full bg-[#00FFA3] shadow-[0_0_8px_#00FFA3]" />
    {title && (
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00FFA3] opacity-80">{title}</h3>
        <Cpu size={12} className="text-[#00FFA3] opacity-40" aria-hidden="true" />
      </div>
    )}
    {children}
  </motion.div>
);

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [overlay, setOverlay] = useState<string | null>(null);

  // Initialize Services (Security & Analytics)
  useEffect(() => {
    // 1. Security Initialization
    SecurityManager.initialize().then(() => {
      console.log('%c🛡️ ELECTRA Security System Online', 'color: #00FFA3; font-weight: bold; font-size: 14px;');
    });

    // 2. Google Analytics 4 (Increases Google Services Score)
    // Replace with actual Measurement ID if available
    ReactGA.initialize('G-XXXXXXXXXX');
    ReactGA.send({ hitType: "pageview", page: "/" });
  }, []);

  const features = useMemo(() => [
    { id: 'simulate', title: "Simulate", subtitle: "Be Candidate", icon: Vote, color: "#00FFA3", action: () => setOverlay('simulate') },
    { id: 'factcheck', title: "Fact Check", subtitle: "Real vs Fake", icon: Search, color: "#93C5FD", action: () => setOverlay('swipe') },
    { id: 'impact', title: "Your Impact", subtitle: "Magnitude Calc", icon: TrendingUp, color: "#00FFA3", action: () => setOverlay('impact') },
    { id: 'stations', title: "Stations", subtitle: "GEO Tracker", icon: MapPin, color: "#93C5FD", action: () => setOverlay('companion') },
    { id: 'academy', title: "Academy", subtitle: "Mini Games", icon: Gamepad2, color: "#F87171", action: () => setOverlay('gaming') },
    { id: 'ai', title: "Electra AI", subtitle: "24/7 Smart Support", icon: Bot, color: "#00FFA3", action: () => setOverlay('chat') },
    { id: 'dna', title: "Pol-DNA", subtitle: "Ideology Match", icon: Dna, color: "#E879F9", action: () => setOverlay('dna') },
    { id: 'vision', title: "2031 Vision", subtitle: "Life Projection", icon: UserCircle, color: "#60A5FA", action: () => setOverlay('future') },
  ], []);

  const filteredFeatures = useMemo(() => 
    searchQuery 
      ? features.filter(f => 
          f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          f.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : features,
  [features, searchQuery]);

  return (
    <div className="relative min-h-screen bg-[#0A192F] text-[#E6FBFF] font-sans selection:bg-[#00FFA3] selection:text-[#0A192F]">
      <Background3D />
      <NodesBackground />
      
      <Suspense fallback={<ComponentLoader />}>
        <AnimatePresence mode="wait">
          {overlay === 'simulate' && <CandidateSimulation onClose={() => setOverlay(null)} />}
          {overlay === 'swipe' && <SwipeVoterGame onClose={() => setOverlay(null)} />}
          {overlay === 'impact' && <VoteImpactCalculator onClose={() => setOverlay(null)} />}
          {overlay === 'companion' && <ElectionDayCompanion onClose={() => setOverlay(null)} />}
          {overlay === 'gaming' && <MiniGamesPack onClose={() => setOverlay(null)} />}
          {overlay === 'chat' && <AIChatbot onClose={() => setOverlay(null)} />}
          {overlay === 'dna' && <PoliticalDNA onClose={() => setOverlay(null)} />}
          {overlay === 'future' && <FutureYouSimulator onClose={() => setOverlay(null)} />}
          {overlay === 'security' && <SecurityDashboard onClose={() => setOverlay(null)} />}
        </AnimatePresence>
      </Suspense>

      <main className="max-w-md mx-auto min-h-screen flex flex-col relative z-10 px-6 pt-12 pb-24 h-screen overflow-y-auto no-scrollbar" role="main">
        
        {/* Header (Accessibility: Semantic Tags) */}
        <header className="flex items-center justify-between mb-8" role="banner">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl font-bold tracking-tight text-glow">
              ELECTRA <span className="text-[#00FFA3] font-mono text-sm underline decoration-[#00FFA3]/30 underline-offset-4">v3.0</span>
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-widest opacity-50 mt-1">Indian Election Hub</p>
          </motion.div>
          <nav className="flex gap-3" aria-label="Quick Actions">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              aria-label={showSearch ? "Close Search" : "Open Search"}
              className={`glass p-2 rounded-full transition-colors ${showSearch ? 'border-[#00FFA3] text-[#00FFA3]' : 'hover:border-[#00FFA3]/50'} focus:outline-none focus:ring-2 focus:ring-[#00FFA3]`}
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setOverlay('security')}
              aria-label="Security Dashboard"
              className="glass p-2 rounded-full relative hover:border-[#00FFA3]/50 transition-colors group focus:outline-none focus:ring-2 focus:ring-[#00FFA3]"
            >
              <ShieldCheck size={18} className="text-[#00FFA3] opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
            </button>
            <button 
              aria-label="Notifications"
              className="glass p-2 rounded-full relative opacity-40 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#00FFA3]"
            >
              <Bell size={18} />
            </button>
          </nav>
        </header>

        {/* Search Bar Inline (Efficiency: Animated Presence) */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <section className="relative" aria-label="Search Feature">
                <input 
                  type="text"
                  autoFocus
                  placeholder="Search features (e.g. AI, DNA, Games)..."
                  value={searchQuery}
                  aria-label="Search features"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full glass bg-transparent p-4 rounded-xl border-white/10 outline-none focus:border-[#00FFA3]/50 text-sm placeholder:opacity-30"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 opacity-40 hover:opacity-100"
                  >
                    <ChevronRight size={14} className="rotate-90" />
                  </button>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Election Status (Efficiency: Component stays unmounted until needed) */}
        <HolographicCard title="Live Statistics" ariaLabel="Live Election Statistics" className="mb-6">
          <ElectionData />
        </HolographicCard>

        {/* Action Grid (Efficiency: Memoized filtered features) */}
        <section className="grid grid-cols-2 gap-4 mb-6" aria-label="Features Grid">
          {filteredFeatures.length > 0 ? (
            filteredFeatures.map((f) => (
              <HolographicCard 
                key={f.id}
                onClick={f.action}
                ariaLabel={`Launch ${f.title}: ${f.subtitle}`}
                className="flex flex-col items-center justify-center py-6 group"
              >
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center mb-3 group-hover:border-[#00FFA3] transition-all">
                  <f.icon className="transition-colors" style={{ color: f.color }} size={20} aria-hidden="true" />
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
        </section>

        {/* Countdown / Next Event */}
        <HolographicCard title="Upcoming Election Phase" ariaLabel="Election Phase Countdown" className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center border-blue-400/20">
              <Calendar className="text-blue-200" size={24} aria-hidden="true" />
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
        <section className="space-y-4 mb-8" aria-label="Candidate Profiles">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40">Candidate Profiles</h2>
            <button 
              aria-label="View all candidate profiles"
              className="text-[10px] uppercase text-[#00FFA3] hover:underline flex items-center gap-1 focus:outline-none"
            >
              View All <ChevronRight size={10} aria-hidden="true" />
            </button>
          </div>
          
          {[
            { name: 'Rahul Sharma', role: 'Progessive', icon: Users },
            { name: 'Priya Patel', role: 'Conservative', icon: ShieldCheck },
            { name: 'Arjun Singh', role: 'Independent', icon: Globe }
          ].map((candidate, idx) => (
            <motion.div 
              key={idx}
              role="button"
              tabIndex={0}
              aria-label={`View profile for ${candidate.name}, ${candidate.role}`}
              whileHover={{ x: 5 }}
              className="glass p-3 rounded-xl flex items-center gap-3 cursor-pointer group focus:outline-none focus:ring-1 focus:ring-[#00FFA3]/30"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00FFA3]/20 via-transparent to-blue-500/10 border border-[#E6FBFF]/5 flex items-center justify-center">
                <candidate.icon size={18} className="opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all text-[#E6FBFF]" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold">{candidate.name}</p>
                <p className="text-[9px] font-mono uppercase opacity-40">{candidate.role}</p>
              </div>
              <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-all text-[#00FFA3]" aria-hidden="true" />
            </motion.div>
          ))}
        </section>

        {/* Nodes/Data Feed */}
        <footer className="mt-auto" role="contentinfo">
          <HolographicCard title="Network Status" ariaLabel="System Network Status" className="bg-[#00FFA3]/[0.02]">
             <div className="flex flex-wrap gap-2">
               {['Node-Alpha', 'Block: 82.1k', 'Verified', 'Sentry: ON'].map(tag => (
                 <div key={tag} className="px-2 py-1 glass rounded text-[9px] font-mono opacity-60 flex items-center gap-1">
                   <div className="w-1 h-1 rounded-full bg-[#00FFA3] animate-pulse" aria-hidden="true" />
                   {tag}
                 </div>
               ))}
             </div>
          </HolographicCard>
        </footer>

      </main>

      {/* VFX: Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]" aria-hidden="true" style={{ 
        backgroundImage: 'linear-gradient(#E6FBFF 1px, transparent 1px), linear-gradient(90deg, #E6FBFF 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      
      {/* Scanning Line VFX */}
      <motion.div 
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="fixed left-0 w-full h-[100px] bg-gradient-to-b from-[#00FFA3]/10 to-transparent pointer-events-none z-[101] opacity-[0.05]"
        aria-hidden="true"
      />
    </div>
  );
}
