import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

type PageTurnAnimationProps = {
  pageKey: string;
  direction: number;
  children: ReactNode;
};

export default function PageTurnAnimation({ pageKey, direction, children }: PageTurnAnimationProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={pageKey}
        custom={direction}
        initial={{
          opacity: 0,
          rotateY: direction > 0 ? -34 : 34,
          x: direction > 0 ? 38 : -38,
          filter: 'blur(2px)',
        }}
        animate={{
          opacity: 1,
          rotateY: 0,
          x: 0,
          filter: 'blur(0px)',
        }}
        exit={{
          opacity: 0,
          rotateY: direction > 0 ? 42 : -42,
          x: direction > 0 ? -34 : 34,
          filter: 'blur(1.5px)',
        }}
        transition={{ type: 'spring', stiffness: 110, damping: 22, mass: 0.9 }}
        className="h-full origin-left"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
