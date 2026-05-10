import { motion } from 'framer-motion';
import type { FarewellNote } from '../../types';
import { getInitials, getReadableName, tabColors } from './diaryUtils';

type DiaryTabsProps = {
  notes: FarewellNote[];
  activeIndex: number | null;
  onSelect: (index: number) => void;
};

export default function DiaryTabs({ notes, activeIndex, onSelect }: DiaryTabsProps) {
  if (notes.length === 0) return null;

  return (
    <div className="pointer-events-none absolute -right-4 top-20 z-30 hidden flex-col gap-2 sm:flex">
      {notes.slice(0, 8).map((note, index) => {
        const isActive = activeIndex === index;

        return (
          <motion.button
            key={note.id}
            type="button"
            onClick={() => onSelect(index)}
            className={`pointer-events-auto h-12 w-12 rounded-r-lg border border-black/10 shadow-lg ${tabColors[index % tabColors.length]} ${
              isActive ? 'translate-x-1' : ''
            }`}
            title={getReadableName(note)}
            aria-label={`Open ${getReadableName(note)}'s note`}
            whileHover={{ x: 8, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="text-xs font-black">{getInitials(getReadableName(note)) || 'FD'}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
