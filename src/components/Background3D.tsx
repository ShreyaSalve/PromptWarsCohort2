import { motion } from 'motion/react';
import React from 'react';

const FloatingModule = ({ delay = 0, x = '0%', y = '0%', size = 100, rotate = 0 }) => {
  // eslint-disable-next-line react-hooks/purity
  const duration = React.useMemo(() => 10 + Math.random() * 5, []);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.1, 0.3, 0.1],
        y: [y, `calc(${y} - 20px)`, y],
        rotate: [rotate, rotate + 5, rotate],
        scale: [1, 1.05, 1]
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      className="absolute pointer-events-none"
      style={{ 
        left: x, 
        top: y, 
        width: size, 
        height: size,
        background: 'linear-gradient(135deg, rgba(230, 251, 255, 0.05) 0%, rgba(0, 255, 163, 0.02) 100%)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(230, 251, 255, 0.03)',
        borderRadius: '20px',
        zIndex: -1
      }}
    />
  );
};

export const Background3D = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0A192F] pointer-events-none">
      {/* Dynamic Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#00FFA3] opacity-[0.03] blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E6FBFF] opacity-[0.02] blur-[100px]" />
       {/* Floating Modules */}
      <FloatingModule x="10%" y="15%" size={200} rotate={15} delay={0} />
      <FloatingModule x="70%" y="10%" size={150} rotate={-10} delay={2} />
      <FloatingModule x="45%" y="45%" size={300} rotate={5} delay={1} />
      <FloatingModule x="20%" y="75%" size={180} rotate={20} delay={3} />
      <FloatingModule x="80%" y="65%" size={220} rotate={-15} delay={1.5} />
      
      {/* Depth of field effect - overlay mask */}
      <div className="absolute inset-0 bg-transparent" style={{ 
        boxShadow: 'inset 0 0 150px rgba(10, 25, 47, 0.8)',
        backdropFilter: 'contrast(1.1) brightness(0.9)'
      }} />
    </div>
  );
};
