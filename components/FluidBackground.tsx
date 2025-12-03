
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StarLayerProps {
  count: number;
  speed: number;
  sizeRange: [number, number];
  opacityRange: [number, number];
  zIndex?: number;
  height?: string; // Allow overriding height (e.g., '100%' for static layers)
}

const StarLayer: React.FC<StarLayerProps> = ({ count, speed, sizeRange, opacityRange, zIndex = 0, height = "300vh" }) => {
  const { scrollY } = useScroll();
  
  // Parallax effect: Moving up (negative y) at different speeds relative to scroll
  // We use a larger height container to ensure we don't run out of stars on long pages
  const y = useTransform(scrollY, (val) => val * speed);
  
  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
      const baseOpacity = Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0];
      
      return {
        id: i,
        x: Math.random() * 100, // %
        y: Math.random() * 100, // %
        size,
        baseOpacity,
        duration: Math.random() * 3 + 2, // 2s to 5s duration
        delay: Math.random() * 5,
        // Mix different animation types for variety
        animationType: Math.random() > 0.5 ? 'pulse' : 'twinkle'
      };
    });
  }, [count, sizeRange, opacityRange]);

  return (
    <motion.div 
      style={{ y, zIndex }} 
      className={`absolute inset-0 w-full pointer-events-none will-change-transform ${height === '100%' ? 'h-full' : height}`}
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            // Only add shadow to larger stars for performance and visual pop
            boxShadow: star.size > 2 ? `0 0 ${star.size + 2}px rgba(255, 255, 255, ${star.baseOpacity * 0.8})` : 'none',
          }}
          animate={
            star.animationType === 'pulse' 
            ? {
                // Pulse: Glow brighter and grow
                opacity: [star.baseOpacity, Math.min(1, star.baseOpacity * 1.8), star.baseOpacity],
                scale: [1, 1.4, 1],
              }
            : {
                // Twinkle: Fade out and shrink slightly
                opacity: [star.baseOpacity, star.baseOpacity * 0.2, star.baseOpacity],
                scale: [1, 0.8, 1],
              }
          }
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
};

const NebulaBlob: React.FC<{ 
  color: string; 
  initialX: number; 
  initialY: number; 
  size: string; 
  speed: number;
  opacity: number;
  animationProps: any 
}> = ({ color, initialX, initialY, size, speed, opacity, animationProps }) => {
  const { scrollY } = useScroll();
  // Nebulas are huge and far away, so they move very slowly
  const y = useTransform(scrollY, (val) => val * speed);

  return (
    <motion.div
      className={`absolute rounded-full mix-blend-screen filter blur-[100px] pointer-events-none ${size}`}
      style={{ 
        backgroundColor: color, 
        left: `${initialX}%`, 
        top: `${initialY}%`,
        opacity,
        y,
        transform: 'translateZ(0)'
      }}
      animate={animationProps}
      transition={{
        duration: 25,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  );
};

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050314] overflow-hidden">
      {/* Deep Space Gradient Base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a0b2e] via-[#050314] to-[#000000] opacity-80" />

      {/* Nebula Blobs - Deep Background (Z-Index 0) */}
      <div className="absolute inset-0 z-0">
        {/* Cosmic Purple */}
        <NebulaBlob
          color="#7c3aed"
          initialX={-10}
          initialY={10}
          size="w-[80vw] h-[80vw]"
          speed={-0.05}
          opacity={0.3}
          animationProps={{ x: [0, 50, 0], scale: [1, 1.1, 1] }}
        />

        {/* Deep Indigo */}
        <NebulaBlob
          color="#4338ca"
          initialX={40}
          initialY={30}
          size="w-[70vw] h-[70vw]"
          speed={-0.08}
          opacity={0.25}
          animationProps={{ x: [0, -30, 0], scale: [1.1, 0.9, 1.1] }}
        />

        {/* Hot Pink / Magenta Center */}
        <NebulaBlob
          color="#db2777"
          initialX={20}
          initialY={60}
          size="w-[90vw] h-[90vw]"
          speed={-0.06}
          opacity={0.2}
          animationProps={{ x: [0, 40, -20], y: [0, -20, 0] }}
        />

        {/* Cyan/Teal Accent */}
        <NebulaBlob
          color="#0891b2"
          initialX={70}
          initialY={-20}
          size="w-[60vw] h-[60vw]"
          speed={-0.09}
          opacity={0.2}
          animationProps={{ x: [0, -20, 0], scale: [1, 1.2, 1] }}
        />
      </div>

      {/* Parallax Star Layers 
          Higher speed magnitude = closer to camera
          Higher Z-Index = physically on top
      */}

      {/* 0. Static Cosmic Dust (Subtle Base Layer) */}
      <StarLayer 
        count={500} 
        speed={0} 
        sizeRange={[0.5, 1.2]} 
        opacityRange={[0.05, 0.3]} 
        zIndex={0}
        height="100%"
      />
      
      {/* 1. Distant Background Stars (Very Slow, Small, Dim) */}
      <StarLayer 
        count={300} 
        speed={-0.05} // Moves 5% of scroll distance
        sizeRange={[1, 2]} 
        opacityRange={[0.3, 0.6]} 
        zIndex={1}
      />
      
      {/* 2. Mid-range Stars (Medium Speed) */}
      <StarLayer 
        count={150} 
        speed={-0.2} // Moves 20% of scroll distance
        sizeRange={[2, 3.5]} 
        opacityRange={[0.5, 0.9]} 
        zIndex={2}
      />
      
      {/* 3. Close Stars (Fast, Brighter) */}
      <StarLayer 
        count={60} 
        speed={-0.5} // Moves 50% of scroll distance
        sizeRange={[3, 5]} 
        opacityRange={[0.7, 1]} 
        zIndex={3}
      />

      {/* 4. Hyper-Close Dust/Particles (Very Fast) */}
      <StarLayer 
        count={20} 
        speed={-0.8} // Moves 80% of scroll distance
        sizeRange={[1, 3]} 
        opacityRange={[0.1, 0.4]} 
        zIndex={4}
      />

      {/* Noise Overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-50"></div>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/90 pointer-events-none z-[51]" />
    </div>
  );
};

export default FluidBackground;
