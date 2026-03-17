import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

const CursorGlow = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      {/* Main Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          background: `radial-gradient(800px circle at ${cursorXSpring}px ${cursorYSpring}px, rgba(255, 255, 255, 0.05), transparent 80%)`,
        }}
      />
      
      {/* Custom Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[100] mix-blend-screen shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
      />

      {/* Trailing Particles (Simplified with a blur ring) */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border border-white/30 rounded-full pointer-events-none z-[99]"
        style={{
          translateX: useSpring(cursorX, { damping: 40, stiffness: 200 }),
          translateY: useSpring(cursorY, { damping: 40, stiffness: 200 }),
          x: '-50%',
          y: '-50%',
        }}
      />
    </>
  );
};

export default CursorGlow;
