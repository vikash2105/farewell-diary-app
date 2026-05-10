import { Clock, Heart, Trash2, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DashboardDiary } from '../../types';

interface DiaryCardProps {
  diary: DashboardDiary;
  colorIndex: number;
  onClick: () => void;
  onDeleteClick: () => void;
}

const accents = [
  'from-primary/18 to-transparent',
  'from-rose-300/20 to-transparent',
  'from-purple-300/18 to-transparent',
  'from-slate-300/18 to-transparent',
];

export default function DiaryCard({
  diary,
  colorIndex,
  onClick,
  onDeleteClick,
}: DiaryCardProps) {
  const timeAgo = formatDistanceToNow(new Date(diary.updatedAt), { addSuffix: true });

  return (
    <article
      onClick={onClick}
      className="sanctuary-card group relative min-h-[230px] cursor-pointer overflow-hidden p-6 hover:-translate-y-1"
    >
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${accents[colorIndex % accents.length]}`} />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDeleteClick();
        }}
        className="absolute right-4 top-4 z-20 rounded-full bg-background/75 p-2 text-destructive shadow-sm transition hover:bg-destructive/10"
        aria-label={`Delete ${diary.title}`}
        title="Delete diary"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <Heart className="absolute left-5 top-5 h-12 w-12 text-primary/15 transition group-hover:text-primary/25" fill="currentColor" />

      <div className="relative z-10 flex h-full flex-col pt-12">
        {diary.contributorCount > 0 && (
          <div className="mb-4 inline-flex w-fit items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground">
            <Users className="h-4 w-4" />
            {diary.contributorCount}
          </div>
        )}

        <h3 className="line-clamp-2 text-xl font-extrabold text-foreground">
          {diary.title}
        </h3>

        {diary.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {diary.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{timeAgo}</span>
          </div>

          <span>
            {diary.totalNotes} {diary.totalNotes === 1 ? 'note' : 'notes'}
          </span>
        </div>
      </div>
    </article>
  );
}
