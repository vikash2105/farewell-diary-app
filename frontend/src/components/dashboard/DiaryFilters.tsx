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
    <div className="flex gap-2 rounded-full border border-border/70 bg-card/75 p-1.5 shadow-sm backdrop-blur">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={`
            rounded-full px-5 py-2 font-bold transition-all duration-200
            ${
              filter === f.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
                    ? 'bg-white/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
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
