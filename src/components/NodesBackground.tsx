import React, { useMemo } from 'react';
import { motion } from 'motion/react';

export const NodesBackground = () => {
  const nodes = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg className="w-full h-full opacity-20">
        {nodes.map((node, i) => (
          <React.Fragment key={node.id}>
            <motion.circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.size}
              fill="#00FFA3"
              animate={{
                opacity: [0.2, 0.8, 0.2],
                r: [node.size, node.size * 1.5, node.size],
              }}
              transition={{
                duration: node.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {nodes.slice(i + 1, i + 3).map((target) => (
              <line
                key={`${node.id}-${target.id}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="#00FFA3"
                                strokeWidth="0.5"
                strokeDasharray="4 4"
                opacity="0.1"
              />
            ))}
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};
