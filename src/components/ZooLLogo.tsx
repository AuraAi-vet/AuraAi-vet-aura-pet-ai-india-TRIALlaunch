import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ZooLLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
}

export function ZooLLogo({ className, size = 'md', showIcon = true }: ZooLLogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  };

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  };

  const currentIconSize = iconSizes[size];

  return (
    <div className={cn("font-brand font-semibold tracking-tight text-ruru-navy flex items-center gap-3 select-none", sizeClasses[size], className)}>
      {showIcon && (
        <motion.div 
          className="relative flex items-center justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <svg width={currentIconSize} height={currentIconSize} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Tech Nodes / Circuitry */}
            <motion.path 
              d="M50 80 L50 65 M30 55 L40 60 M70 55 L60 60" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
              className="text-ruru-teal opacity-50"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.circle 
              cx="50" cy="80" r="4" 
              className="fill-ruru-pink"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <circle cx="30" cy="55" r="3" className="fill-ruru-teal opacity-70" />
            <circle cx="70" cy="55" r="3" className="fill-ruru-teal opacity-70" />
            <circle cx="50" cy="65" r="3" className="fill-ruru-navy" />

            {/* Main Paw Pad / Central Hub */}
            <path d="M50 65 C40 65 35 55 40 45 C45 35 55 35 60 45 C65 55 60 65 50 65 Z" className="fill-ruru-navy" />
            <circle cx="50" cy="50" r="4" className="fill-white opacity-80" />
            
            {/* Paw Toes / Digital Nodes */}
            <motion.path 
              d="M30 35 C25 35 22 28 25 22 C28 16 35 18 35 25 C35 32 35 35 30 35 Z" 
              className="fill-ruru-teal"
              whileHover={{ scale: 1.1, y: -2 }}
            />
            <circle cx="30" cy="28" r="2" className="fill-white opacity-60" />

            <motion.path 
              d="M45 25 C40 25 38 18 40 12 C42 6 50 6 50 15 C50 22 50 25 45 25 Z" 
              className="fill-ruru-pink"
              whileHover={{ scale: 1.1, y: -2 }}
            />
            <circle cx="45" cy="16" r="2" className="fill-white opacity-60" />

            <motion.path 
              d="M60 25 C55 25 55 22 55 15 C55 6 63 6 65 12 C67 18 65 25 60 25 Z" 
              className="fill-ruru-teal"
              whileHover={{ scale: 1.1, y: -2 }}
            />
            <circle cx="60" cy="16" r="2" className="fill-white opacity-60" />

            <motion.path 
              d="M75 35 C70 35 70 32 70 25 C70 18 77 16 80 22 C83 28 80 35 75 35 Z" 
              className="fill-ruru-pink"
              whileHover={{ scale: 1.1, y: -2 }}
            />
            <circle cx="75" cy="28" r="2" className="fill-white opacity-60" />
            
            {/* Encircling Shield/Tech Ring */}
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" className="text-ruru-teal/30" />
          </svg>
        </motion.div>
      )}
      <div className="relative flex items-center">
        <span>Z</span>
        <div className="relative inline-flex items-center -ml-1 -mr-1">
          <span className="text-ruru-teal">o</span>
          <span className="text-ruru-pink-dark -ml-[0.15em]">o</span>
        </div>
        <span>L</span>
      </div>
    </div>
  );
}
