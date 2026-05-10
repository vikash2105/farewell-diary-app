import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Share2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Diary, FarewellNote } from '../../types';
import ThemeToggle from '../ThemeToggle';
import DiaryIndexPage from './DiaryIndexPage';
import DiaryMessagePage from './DiaryMessagePage';
import DiaryTabs from './DiaryTabs';
import PageTurnAnimation from './PageTurnAnimation';

type DiaryShellProps = {
  diary: Diary | null;
  notes: FarewellNote[];
  onBack: () => void;
  onCopyLink: () => void;
  onOpenPublic: () => void;
  onCloseDiary: () => void;
};

export default function DiaryShell({ diary, notes, onBack, onCopyLink, onOpenPublic, onCloseDiary }: DiaryShellProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);

  const activeNote = activeIndex === null ? null : notes[activeIndex];
  const pageKey = activeNote ? `note-${activeNote.id}` : 'index';

  const currentLabel = useMemo(() => {
    if (activeIndex === null) return 'Index';
    return `Page ${activeIndex + 1} of ${notes.length}`;
  }, [activeIndex, notes.length]);

  const openNote = (index: number) => {
    if (index < 0 || index >= notes.length) return;
    setDirection(activeIndex === null || index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const goNext = () => {
    if (activeIndex === null) return;
    openNote(activeIndex + 1);
  };

  const goPrevious = () => {
    if (activeIndex === null) return;
    openNote(activeIndex - 1);
  };

  const backToIndex = () => {
    setDirection(-1);
    setActiveIndex(null);
  };

  return (
    <div className="diary-stage min-h-screen overflow-hidden">
      <header className="page-container relative z-30 flex h-16 items-center justify-between">
        <button type="button" onClick={onBack} className="diary-glass-button">
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>
        <div className="rounded-full border border-white/30 bg-white/30 px-4 py-2 text-sm font-black text-primary shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/10">
          {currentLabel}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCopyLink} className="diary-glass-button" title="Copy share link">
            <Share2 className="h-4 w-4" />
          </button>
          <button type="button" onClick={onOpenPublic} className="diary-glass-button" title="View public diary">
            <ExternalLink className="h-4 w-4" />
          </button>
          <button type="button" onClick={onCloseDiary} className="diary-glass-button" title="Close diary">
            <X className="h-4 w-4" />
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main className="page-container relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center py-5 sm:py-8">
        <motion.section
          className="diary-book-open relative h-[min(760px,calc(100vh-7.5rem))] w-full max-w-6xl"
          initial={{ opacity: 0, rotateX: 12, scale: 0.9 }}
          animate={{ opacity: 1, rotateX: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) < 70) return;
            if (info.offset.x < 0 && activeIndex !== null) goNext();
            if (info.offset.x > 0 && activeIndex !== null) goPrevious();
          }}
          style={{ perspective: 1800 }}
        >
          <span className="diary-page-stack diary-page-stack-left" />
          <span className="diary-page-stack diary-page-stack-right" />
          <span className="diary-book-spine" />
          <DiaryTabs notes={notes} activeIndex={activeIndex} onSelect={openNote} />

          <div className="relative z-10 h-full">
            <PageTurnAnimation pageKey={pageKey} direction={direction}>
              {activeNote ? (
                <DiaryMessagePage
                  note={activeNote}
                  noteIndex={activeIndex ?? 0}
                  totalNotes={notes.length}
                  onBackToIndex={backToIndex}
                  onNext={goNext}
                  onPrevious={goPrevious}
                />
              ) : (
                <DiaryIndexPage diary={diary} notes={notes} onSelectNote={openNote} />
              )}
            </PageTurnAnimation>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
