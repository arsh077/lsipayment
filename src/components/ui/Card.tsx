import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hover?: boolean;
  delay?: number;
}

export function Card({ children, className, hover = false, delay = 0, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'bg-white border border-gray-200 rounded-xl p-6 shadow-sm',
        hover && 'hover:shadow-md transition-shadow duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}


