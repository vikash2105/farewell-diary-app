import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookMarked, Home } from 'lucide-react';
import type { FarewellNote } from '../../types';
import PaperTexture from './PaperTexture';
import { formatDiaryDate, getFontClass, getInitials, getReadableName, tabColors } from './diaryUtils';

type DiaryMessagePageProps = {
  note: FarewellNote;
  noteIndex: number;
  totalNotes: number;
  onBackToIndex: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export default function DiaryMessagePage({
  note,
  noteIndex,
  totalNotes,
  onBackToIndex,
  onNext,
  onPrevious,
}: DiaryMessagePageProps) {
  const readableName = getReadableName(note);
  const canGoPrevious = noteIndex > 0;
  const canGoNext = noteIndex < totalNotes - 1;

  return (
    <PaperTexture className="diary-page diary-message-page mx-auto h-full max-w-3xl">
      <div className="flex h-full flex-col">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-stone-300/80 pb-5 dark:border-white/10">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full shadow-inner ${
                tabColors[noteIndex % tabColors.length]
              }`}
            >
              <span className="font-black">{getInitials(readableName) || 'FD'}</span>
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">Page {noteIndex + 1}</p>
              <h2 className="brand-script text-4xl font-bold text-primary sm:text-5xl">{readableName}</h2>
            </div>
          </div>
          <time className="rounded-full border border-stone-300/70 bg-white/30 px-4 py-2 text-sm font-bold text-stone-700 dark:border-white/10 dark:bg-white/10 dark:text-stone-200">
            {formatDiaryDate(note.createdAt)}
          </time>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="diary-lined-paper min-h-0 flex-1 overflow-y-auto rounded-lg px-2 py-1"
        >
          <p className={`whitespace-pre-wrap text-stone-800 dark:text-stone-100 ${getFontClass(note.fontStyle)}`}>
            {note.content}
          </p>
        </motion.div>

        <footer className="mt-7 flex items-center justify-between gap-3 border-t border-stone-300/80 pt-5 dark:border-white/10">
          <button type="button" onClick={onBackToIndex} className="diary-control-button">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Index</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-primary/70">
            <BookMarked className="h-4 w-4" />
            {noteIndex + 1} / {totalNotes}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="diary-icon-button"
              aria-label="Previous page"
              title="Previous page"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!canGoNext}
              className="diary-icon-button"
              aria-label="Next page"
              title="Next page"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </div>
    </PaperTexture>
  );
}
