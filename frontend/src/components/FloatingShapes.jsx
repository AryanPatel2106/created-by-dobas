import React from 'react';
import { motion } from 'framer-motion';

const Shape = ({ size, top, left, duration, color, opacity = 0.5 }) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        top: top,
        left: left,
        backgroundColor: color,
        opacity: opacity,
      }}
      animate={{
        y: [0, 20, 0, -20, 0],
        x: [0, -15, 0, 15, 0],
      }}
      transition={{
        duration: duration,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    />
  );
};

const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <Shape size={150} top="10%" left="15%" duration={20} color="var(--theme-pink)" />
      <Shape size={100} top="25%" left="80%" duration={25} color="var(--theme-teal)" />
      <Shape size={120} top="70%" left="5%" duration={18} color="var(--theme-yellow)" />
      <Shape size={80} top="80%" left="60%" duration={22} color="var(--theme-pink)" />
      <Shape size={60} top="50%" left="50%" duration={30} color="var(--theme-teal)" opacity={0.3}/>
    </div>
  );
};

export default FloatingShapes;