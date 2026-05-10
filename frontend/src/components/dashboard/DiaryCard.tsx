/**
 * DiaryCard Component
 * Displays a single diary card on the dashboard with pastel colors
 */

import { Heart, Users, Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DashboardDiary } from '../../types';

interface DiaryCardProps {
  diary: DashboardDiary;
  colorIndex: number;
  onClick: () => void;
  onDeleteClick: () => void;
}

const pastelColors = [
  'bg-purple-100 hover:bg-purple-200 border-purple-300',
  'bg-blue-100 hover:bg-blue-200 border-blue-300',
  'bg-pink-100 hover:bg-pink-200 border-pink-300',
  'bg-green-100 hover:bg-green-200 border-green-300',
  'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
  'bg-indigo-100 hover:bg-indigo-200 border-indigo-300',
];

export default function DiaryCard({
  diary,
  colorIndex,
  onClick,
  onDeleteClick,
}: DiaryCardProps) {
  const colorClass = pastelColors[colorIndex % pastelColors.length];
  const timeAgo = formatDistanceToNow(new Date(diary.updatedAt), { addSuffix: true });

  return (
    <div
      onClick={onClick}
      className={`
        ${colorClass}
        rounded-2xl p-6 border-2 
        cursor-pointer
        transition-all duration-300
        hover:scale-105 hover:shadow-lg
        relative overflow-hidden
        group
      `}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDeleteClick();
        }}
        className="absolute right-4 top-4 z-20 rounded-full bg-white/80 p-2 text-red-600 shadow-sm transition hover:bg-red-50 hover:text-red-700 focus:bg-red-50"
        aria-label={`Delete ${diary.title}`}
        title="Delete diary"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Diary Icon */}
      <div className="absolute top-4 left-4 opacity-20 group-hover:opacity-30 transition-opacity">
        <Heart className="w-12 h-12" fill="currentColor" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Contributor Badge */}
        {diary.contributorCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full px-3 py-1 text-sm font-semibold flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{diary.contributorCount}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-secondary-900 mb-2 mt-8 line-clamp-2">
          {diary.title}
        </h3>

        {/* Description */}
        {diary.description && (
          <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
            {diary.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-300">
          <div className="flex items-center gap-1 text-secondary-600 text-xs">
            <Clock className="w-4 h-4" />
            <span>Updated {timeAgo}</span>
          </div>

          {diary.totalNotes > 0 && (
            <div className="text-secondary-600 text-xs">
              {diary.totalNotes} {diary.totalNotes === 1 ? 'note' : 'notes'}
            </div>
          )}
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
    </div>
  );
}
