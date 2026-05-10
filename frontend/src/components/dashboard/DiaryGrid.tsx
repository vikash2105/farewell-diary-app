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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="sanctuary-card animate-pulse rounded-xl p-6"
          >
            <div className="mb-4 h-6 w-3/4 rounded bg-muted"></div>
            <div className="mb-2 h-4 w-full rounded bg-muted"></div>
            <div className="mb-4 h-4 w-2/3 rounded bg-muted"></div>
            <div className="h-4 w-1/2 rounded bg-muted"></div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (diaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <svg
            className="h-12 w-12 text-muted-foreground"
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
        <h3 className="mb-2 text-xl font-bold text-foreground">
          No diaries yet
        </h3>
        <p className="mb-6 max-w-md text-center text-muted-foreground">
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
