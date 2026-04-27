import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  FileText, 
  Clock, 
  X, 
  Navigation, 
  Info, 
  CheckCircle,
  Copy,
  AlertCircle
} from 'lucide-react';

const idDocuments = [
  { id: '1', name: 'Voter ID (EPIC)', required: true },
  { id: '2', name: 'Aadhaar Card', required: false },
  { id: '3', name: 'PAN Card', required: false },
  { id: '4', name: 'Driving License', required: false },
  { id: '5', name: 'Passport', required: false },
];

export const ElectionDayCompanion = ({ onClose }: { onClose: () => void }) => {
  const [activeSegment, setActiveSegment] = useState<'booth' | 'docs' | 'wait'>('booth');
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText('St. Mary High School, Sector 21, Pune - 411044');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] glass flex flex-col p-6 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[#00FFA3] font-mono text-[10px] uppercase tracking-widest">Active Companion</h2>
          <h3 className="text-xl font-bold">Voting Day Guide</h3>
        </div>
        <button onClick={onClose} className="p-2 glass rounded-full hover:border-[#00FFA3]/50">
          <X size={18} />
        </button>
              </div>

      {/* Segment Control */}
      <div className="flex glass p-1 rounded-xl mb-6">
        {[
          { id: 'booth', icon: MapPin, label: 'Booth' },
          { id: 'docs', icon: FileText, label: 'Docs' },
          { id: 'wait', icon: Clock, label: 'Wait' },
        ].map((seg) => (
          <button
            key={seg.id}
            onClick={() => setActiveSegment(seg.id as any)}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeSegment === seg.id 
                ? 'bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20 shadow-[0_0_10px_rgba(0,255,163,0.1)]' 
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            <seg.icon size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">{seg.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSegment === 'booth' && (
          <motion.div
            key="booth"
            initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <div className="glass aspect-video rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/5 bg-[#0A192F]">
              <div className="absolute inset-0 opacity-20" style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, #00FFA3 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }} />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 glass rounded-full flex items-center justify-center mb-2 hologram-glow">
                  <MapPin className="text-[#00FFA3]" size={24} />
                </div>
                <p className="text-[10px] font-mono uppercase text-[#00FFA3]">Targeting Location...</p>
              </div>
              <div className="absolute bottom-4 left-4 right-4 glass p-3 rounded-xl border-white/10 flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-mono opacity-50 uppercase">Station ID</p>
                   <p className="text-xs font-bold">Booth #142 (Zone A)</p>
                </div>
                <Navigation size={18} className="text-[#00FFA3] opacity-60" />
              </div>
            </div>

            <div className="glass p-5 rounded-2xl border-l-4 border-l-[#00FFA3]">
              <p className="text-[10px] font-mono opacity-50 mb-1 uppercase tracking-widest">Polling Address</p>
              <h4 className="text-sm font-bold mb-2">St. Mary High School, Sector 21</h4>
              <p className="text-xs opacity-60 mb-4">Pune - 411044 (Near Central Park)</p>
              <button 
                onClick={copyAddress}
                className="w-full glass p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:border-[#00FFA3]/50 transition-all"
              >
                {copied ? <CheckCircle size={14} className="text-[#00FFA3]" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy Address'}
              </button>
            </div>
            
            <div className="glass p-4 rounded-2xl bg-blue-500/[0.03] border-blue-500/10 flex items-start gap-3">
              <Info size={16} className="text-blue-400 mt-1" />
              <p className="text-xs leading-relaxed opacity-70">
                Reminder: Please reach before 6:00 PM. High traffic expected after 5:00 PM.
                             </p>
            </div>
          </motion.div>
        )}

        {activeSegment === 'docs' && (
          <motion.div
            key="docs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="glass p-5 rounded-2xl">
              <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-[#00FFA3]" />
                Identity Requirements
              </h4>
              <div className="space-y-3">
                {idDocuments.map((doc) => (
                  <div key={doc.id} className="glass p-4 rounded-xl flex items-center justify-between group hover:border-white/20 transition-all">
                    <span className="text-sm">{doc.name}</span>
                    {doc.required ? (
                      <span className="text-[9px] font-mono uppercase bg-[#00FFA3]/20 text-[#00FFA3] px-2 py-1 rounded">Primary</span>
                    ) : (
                      <span className="text-[9px] font-mono uppercase opacity-30">Optional</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-[10px] font-mono opacity-40 uppercase tracking-widest">Digital copies are NOT accepted</p>
          </motion.div>
        )}

        {activeSegment === 'wait' && (
          <motion.div
            key="wait"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
                       className="space-y-6"
          >
            <div className="glass p-8 rounded-full aspect-square max-w-[240px] mx-auto flex flex-col items-center justify-center border-l-4 border-l-[#00FFA3] hologram-glow">
              <p className="text-[10px] font-mono opacity-50 uppercase mb-2">Estimated Wait</p>
              <h4 className="text-4xl font-black text-glow">12 <span className="text-lg opacity-40">min</span></h4>
              <div className="mt-4 px-3 py-1 bg-[#00FFA3]/20 rounded-full">
                <span className="text-[10px] font-bold text-[#00FFA3] uppercase tracking-widest">Optimal Window</span>
              </div>
            </div>

            <div className="space-y-3">
               {[
                 { time: '07:00 AM', status: 'High', color: 'text-red-400' },
                 { time: '11:00 AM', status: 'Medium', color: 'text-blue-300' },
                 { time: '03:00 PM', status: 'Low', color: 'text-[#00FFA3]' },
                 { time: '05:30 PM', status: 'Very High', color: 'text-red-600' },
               ].map((slot, i) => (
                 <div key={i} className="glass p-3 rounded-xl flex items-center justify-between">
                   <span className="text-xs font-mono opacity-60 tracking-wider">{slot.time}</span>
                   <span className={`text-[10px] font-bold uppercase ${slot.color}`}>{slot.status} Traffic</span>
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto pt-8">
        <button
          onClick={onClose}
          className="w-full bg-[#E6FBFF]/10 text-white font-bold p-4 rounded-xl hover:bg-[#E6FBFF]/20 transition-all"
        >
          Close Companion
        </button>
      </div>
    </div>
  );
};
