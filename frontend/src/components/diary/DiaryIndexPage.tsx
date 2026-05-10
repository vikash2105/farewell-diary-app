import { motion } from 'framer-motion';
import { BookOpen, CalendarDays, Feather, Heart, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Diary, FarewellNote } from '../../types';
import PaperTexture from './PaperTexture';
import { formatDiaryDate, getInitials, getReadableName, tabColors } from './diaryUtils';

type DiaryIndexPageProps = {
  diary: Diary | null;
  notes: FarewellNote[];
  onSelectNote: (index: number) => void;
};

export default function DiaryIndexPage({ diary, notes, onSelectNote }: DiaryIndexPageProps) {
  const [query, setQuery] = useState('');
  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return notes;

    return notes.filter((note) => {
      const author = getReadableName(note).toLowerCase();
      return author.includes(normalizedQuery) || note.content.toLowerCase().includes(normalizedQuery);
    });
  }, [notes, query]);

  return (
    <div className="diary-spread-grid h-full">
      <PaperTexture className="diary-page diary-page-left">
        <div className="flex h-full flex-col">
          <div className="mb-8 flex items-center gap-3 text-primary">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
              <Heart className="h-6 w-6" fill="currentColor" />
            </div>
            <span className="font-bold uppercase tracking-[0.18em] text-primary/80">Memory volume</span>
          </div>

          <h1 className="brand-script text-5xl font-bold leading-tight text-primary sm:text-6xl">
            {diary?.title || 'Farewell Diary'}
          </h1>
          <p className="mt-5 max-w-md text-base leading-8 text-stone-700 dark:text-stone-200">
            {diary?.description ||
              'A private collection of warm words, quiet gratitude, and memories saved for the moments when goodbye needs something beautiful to hold.'}
          </p>

          <div className="mt-8 grid gap-3 text-sm text-stone-700 dark:text-stone-200 sm:grid-cols-2">
            <div className="rounded-lg border border-stone-300/70 bg-white/30 p-4 shadow-inner dark:border-white/10 dark:bg-white/5">
              <CalendarDays className="mb-2 h-5 w-5 text-primary" />
              <p className="font-bold">Created</p>
              <p>{formatDiaryDate(diary?.createdAt)}</p>
            </div>
            <div className="rounded-lg border border-stone-300/70 bg-white/30 p-4 shadow-inner dark:border-white/10 dark:bg-white/5">
              <BookOpen className="mb-2 h-5 w-5 text-primary" />
              <p className="font-bold">Contributors</p>
              <p>{notes.length} heartfelt {notes.length === 1 ? 'page' : 'pages'}</p>
            </div>
          </div>

          <blockquote className="mt-auto border-l-4 border-primary/30 pl-5 font-serif text-lg italic leading-8 text-stone-700 dark:text-stone-200">
            "Some goodbyes become keepsakes when the right words find paper."
          </blockquote>
        </div>
      </PaperTexture>

      <PaperTexture className="diary-page diary-page-right">
        <div className="flex h-full flex-col">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary/75">Index</p>
              <h2 className="brand-script text-5xl font-bold text-primary">{notes.length} Contributors</h2>
            </div>
            <Feather className="h-8 w-8 text-primary/70" />
          </div>

          <label className="mb-5 flex items-center gap-2 rounded-full border border-stone-300/70 bg-white/40 px-4 py-3 shadow-inner dark:border-white/10 dark:bg-white/10">
            <Search className="h-4 w-4 text-primary" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-stone-800 placeholder:text-stone-500 focus:outline-none dark:text-stone-100 dark:placeholder:text-stone-400"
              placeholder="Search contributors or messages"
            />
          </label>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
            {filteredNotes.map((note) => {
              const originalIndex = notes.findIndex((candidate) => candidate.id === note.id);
              const readableName = getReadableName(note);

              return (
                <motion.button
                  key={note.id}
                  type="button"
                  onClick={() => onSelectNote(originalIndex)}
                  className="group relative flex w-full items-center gap-4 rounded-lg border border-stone-300/70 bg-white/30 p-3 text-left shadow-sm transition hover:bg-white/60 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
                  whileHover={{ x: 5, rotateZ: -0.25 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span
                    className={`absolute -right-3 top-1/2 h-9 w-3 -translate-y-1/2 rounded-r-md shadow-md ${
                      tabColors[originalIndex % tabColors.length]
                    }`}
                  />
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-inner ${
                      tabColors[originalIndex % tabColors.length]
                    }`}
                  >
                    <span className="text-sm font-black">{getInitials(readableName) || 'FD'}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-stone-900 dark:text-stone-50">{readableName}</span>
                    <span className="block text-xs text-stone-600 dark:text-stone-300">
                      {formatDiaryDate(note.createdAt)}
                    </span>
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-primary opacity-0 transition group-hover:opacity-100">
                    Open
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </PaperTexture>
    </div>
  );
}
