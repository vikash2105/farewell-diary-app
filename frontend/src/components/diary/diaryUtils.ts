import type { FarewellNote } from '../../types';

export const tabColors = [
  'bg-rose-300 text-rose-950',
  'bg-amber-200 text-amber-950',
  'bg-pink-200 text-pink-950',
  'bg-orange-200 text-orange-950',
  'bg-fuchsia-200 text-fuchsia-950',
  'bg-stone-200 text-stone-950',
];

export function formatDiaryDate(date?: string) {
  if (!date) return 'A keepsake in progress';

  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function getReadableName(note: FarewellNote) {
  return note.isAnonymous ? 'Anonymous friend' : note.authorName;
}

export function getFontClass(style: FarewellNote['fontStyle']) {
  switch (style) {
    case 'handwriting':
      return 'font-handwriting text-[1.55rem] leading-[1.72]';
    case 'serif':
      return 'font-serif text-base leading-8';
    case 'cursive':
      return 'font-cursive text-[1.55rem] leading-[1.72]';
    default:
      return 'font-sans text-base leading-8';
  }
}
