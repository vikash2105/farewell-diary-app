import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, ExternalLink, Heart, Share2, Sparkles } from 'lucide-react';
import type { Diary } from '../../types';
import ThemeToggle from '../ThemeToggle';

type DiaryCoverProps = {
  diary: Diary | null;
  noteCount: number;
  onBack: () => void;
  onCopyLink: () => void;
  onOpenPublic: () => void;
  onOpenDiary: () => void;
};

export default function DiaryCover({
  diary,
  noteCount,
  onBack,
  onCopyLink,
  onOpenPublic,
  onOpenDiary,
}: DiaryCoverProps) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 22 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 22 });
  const rotateY = useTransform(smoothX, [-1, 1], [-10, 10]);
  const rotateX = useTransform(smoothY, [-1, 1], [7, -7]);

  return (
    <div className="diary-stage min-h-screen">
      <header className="page-container relative z-20 flex h-16 items-center justify-between">
        <button type="button" onClick={onBack} className="diary-glass-button">
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCopyLink} className="diary-glass-button" title="Copy share link">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button type="button" onClick={onOpenPublic} className="diary-glass-button" title="View public diary">
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Public</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main className="page-container relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
        <motion.button
          type="button"
          onClick={onOpenDiary}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
            pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
          }}
          onMouseLeave={() => {
            pointerX.set(0);
            pointerY.set(0);
          }}
          className="diary-cover-book group"
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          aria-label="Open Farewell Diary"
        >
          <span className="diary-cover-pages" />
          <span className="diary-cover-spine" />
          <span className="diary-cover-sheen" />
          <span className="absolute right-12 top-0 h-44 w-8 rounded-b-full bg-rose-700 shadow-2xl shadow-rose-950/40" />
          <span className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
            <span className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-rose-100/40 bg-rose-100/15 text-rose-50 shadow-inner">
              <Heart className="h-10 w-10" fill="currentColor" />
            </span>
            <span className="font-serif text-sm font-black uppercase tracking-[0.34em] text-rose-100/80">
              Farewell Diary
            </span>
            <span className="brand-script mt-3 text-5xl font-bold leading-tight text-rose-50 drop-shadow sm:text-6xl">
              {diary?.title || 'Memory Book'}
            </span>
            <span className="mt-6 max-w-sm text-sm font-semibold leading-7 text-rose-50/80">
              {noteCount} {noteCount === 1 ? 'message' : 'messages'} pressed into paper, waiting to be opened.
            </span>
            <span className="mt-9 inline-flex items-center gap-2 rounded-full border border-rose-100/30 bg-white/10 px-5 py-3 text-sm font-black text-rose-50 shadow-lg backdrop-blur transition group-hover:bg-white/20">
              <Sparkles className="h-4 w-4" />
              Open diary
            </span>
          </span>
        </motion.button>
      </main>
    </div>
  );
}
