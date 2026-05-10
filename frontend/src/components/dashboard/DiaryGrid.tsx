/**
 * DiaryGrid Component
 * Responsive grid layout for diary cards
 */

import { useNavigate } from 'react-router-dom';
import DiaryCard from './DiaryCard';
import { DashboardDiary } from '../../types';

interface DiaryGridProps {
  diaries: DashboardDiary[];
  loading?: boolean;
  onDeleteDiary: (diary: DashboardDiary) => void;
}

export default function DiaryGrid({
  diaries,
  loading = false,
  onDeleteDiary,
}: DiaryGridProps) {
  const navigate = useNavigate();

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-6 border-2 border-secondary-200 bg-secondary-100 animate-pulse"
          >
            <div className="h-6 bg-secondary-300 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-secondary-300 rounded mb-2 w-full"></div>
            <div className="h-4 bg-secondary-300 rounded mb-4 w-2/3"></div>
            <div className="h-4 bg-secondary-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (diaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-secondary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
          No diaries yet
        </h3>
        <p className="text-secondary-600 text-center mb-6 max-w-md">
          Create your first diary to start collecting precious memories and farewell messages.
        </p>
        <button
          onClick={() => navigate('/create')}
          className="btn btn-primary"
        >
          Create Your First Diary
        </button>
      </div>
    );
  }

  // Grid with diaries
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {diaries.map((diary, index) => (
        <DiaryCard
          key={diary.id}
          diary={diary}
          colorIndex={index}
          onClick={() => navigate(`/notes?diaryId=${diary.id}`)}
          onDeleteClick={() => onDeleteDiary(diary)}
        />
      ))}
    </div>
  );
}
