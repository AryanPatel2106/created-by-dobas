import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-48 h-24"
    >
      <svg viewBox="0 0 180 90" className="w-full h-full">
        <motion.circle 
          cx="45" cy="30" r="25" 
          fill="#f4cccc"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 100 }}
        />
        <motion.path 
          d="M 100 5 a 25 25 0 0 1 0 50" 
          fill="#a4c2f4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        />
        <motion.path 
          d="M 120 85 a 30 30 0 0 1 0 -60" 
          fill="#fff2cc"
          opacity="0.7"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        />

        <text
          x="90" y="35" fontFamily="Inter, sans-serif"
          fontSize="10" fill="#4a4a4a" textAnchor="middle"
        >
          CREATED BY
        </text>

        <text
          x="90" y="70" fontFamily="Playfair Display, serif"
          fontWeight="bold" fontSize="36" fill="#f4cccc"
          stroke="#4a4a4a" strokeWidth="0.5" textAnchor="middle" letterSpacing="2"
        >
          DOBA
        </text>
      </svg>
    </motion.div>
  );
};

export default Logo;