'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollFadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export default function ScrollFadeIn({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  yOffset = 30,
  className = ''
}: ScrollFadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98], // Custom subtle easing (out-cubic roughly)
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
