import { Users, Clock, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DashboardDiary } from '../../types';

interface DiaryCardProps {
  diary: DashboardDiary;
}

const pastelVariants = [
  'bg-purple-50 border-purple-100',
  'bg-blue-50 border-blue-100',
  'bg-orange-50 border-orange-100',
  'bg-teal-50 border-teal-100',
];

export default function DiaryCard({ diary }: DiaryCardProps) {
  const variant =
    pastelVariants[String(diary.id).charCodeAt(0) % pastelVariants.length];

  const sharedCount = (diary as any).sharedWithCount ?? 0;
  const description = (diary as any).description ?? '';

  return (
    <div
      className={`relative rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${variant}`}
    >
      {/* Friend badge */}
      {sharedCount > 0 && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs text-gray-600 shadow-sm">
          <Users size={12} />
          {sharedCount} friends
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900">
        {diary.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
        {description || 'No description'}
      </p>

      <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          Updated{' '}
          {formatDistanceToNow(new Date(diary.updatedAt), {
            addSuffix: true,
          })}
        </div>

        <Star size={16} className="text-gray-400" />
      </div>
    </div>
  );
}
