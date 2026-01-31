interface DiaryFiltersProps {
  filter: 'all' | 'shared' | 'private';
  onFilterChange: (filter: 'all' | 'shared' | 'private') => void;
  counts?: {
    all: number;
    shared: number;
    private: number;
  };
}

const tabs = ['all', 'shared', 'private'] as const;

export default function DiaryFilters({
  filter,
  onFilterChange,
  counts,
}: DiaryFiltersProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-900">
        My Collection
        {counts && (
          <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-sm text-gray-600">
            {counts.all}
          </span>
        )}
      </h2>

      <div className="flex gap-6 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onFilterChange(tab)}
            className={`relative pb-1 capitalize ${
              filter === tab
                ? 'text-indigo-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {filter === tab && (
              <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded bg-indigo-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
