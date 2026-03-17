import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const LoadingState = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Analyzing claims...",
    "Scanning market data...",
    "Cross-referencing sources...",
    "Generating final verdict..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-12">
      <div className="relative w-32 h-32">
        {/* Animated AI Brain/Core */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 border-4 border-white/20 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-2 border-4 border-white/10 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="w-8 h-8 bg-white rounded-full blur-sm shadow-[0_0_20px_rgba(255,255,255,0.8)]"
          />
        </div>
        
        {/* Orbiting particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0"
          >
            <div 
              className="w-2 h-2 bg-white/60 rounded-full absolute"
              style={{ top: '0', left: '50%', transform: 'translateX(-50%)' }}
            />
          </motion.div>
        ))}
      </div>

      <div className="text-center space-y-4">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-2xl font-bold text-white"
        >
          {messages[messageIndex]}
        </motion.p>
        <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
          <motion.div
            animate={{
              x: [-192, 192],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
