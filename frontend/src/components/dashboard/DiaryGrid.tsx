import { useNavigate } from 'react-router-dom';
import DiaryCard from './DiaryCard';
import { DashboardDiary } from '../../types';

interface DiaryGridProps {
  diaries: DashboardDiary[];
  loading?: boolean;
}

export default function DiaryGrid({ diaries, loading }: DiaryGridProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {diaries.map((diary) => (
        <div
          key={diary.id}
          onClick={() => navigate(`/diaries/${diary.id}`)}
          className="cursor-pointer"
        >
          <DiaryCard diary={diary} />
        </div>
      ))}
    </div>
  );
}
