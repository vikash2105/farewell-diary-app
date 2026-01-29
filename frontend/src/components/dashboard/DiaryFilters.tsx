/**
 * DiaryFilters Component
 * Tab-style filters for All/Shared/Private diaries
 */

interface DiaryFiltersProps {
  filter: 'all' | 'shared' | 'private';
  onFilterChange: (filter: 'all' | 'shared' | 'private') => void;
  counts?: {
    all: number;
    shared: number;
    private: number;
  };
}

export default function DiaryFilters({ filter, onFilterChange, counts }: DiaryFiltersProps) {
  const filters = [
    { id: 'all', label: 'All', count: counts?.all },
    { id: 'shared', label: 'Shared', count: counts?.shared },
    { id: 'private', label: 'Private', count: counts?.private },
  ] as const;

  return (
    <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm border border-secondary-200">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={`
            px-6 py-2 rounded-lg font-medium transition-all duration-200
            ${
              filter === f.id
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-secondary-600 hover:bg-secondary-100'
            }
          `}
        >
          {f.label}
          {counts && f.count !== undefined && (
            <span
              className={`
                ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
                ${
                  filter === f.id
                    ? 'bg-white/20 text-white'
                    : 'bg-secondary-200 text-secondary-600'
                }
              `}
            >
              {f.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
