/**
 * Dashboard Page - Enhanced Version
 * Shows user's diary collection with filters and enhanced UI
 * 
 * INSTRUCTIONS:
 * Replace your existing Dashboard.tsx with this enhanced version
 * OR manually integrate the new components into your existing Dashboard
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, User } from 'lucide-react';
import DiaryGrid from '../components/dashboard/DiaryGrid';
import DiaryFilters from '../components/dashboard/DiaryFilters';
import FloatingActionButton from '../components/dashboard/FloatingActionButton';

// Update this import to match your actual API client location
// import { diaryApi } from '../api/diaryApi';

interface Diary {
  id: string;
  title: string;
  description: string | null;
  contributorCount: number;
  totalNotes: number;
  updatedAt: string;
  uniqueLink: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'shared' | 'private'>('all');

  useEffect(() => {
    loadDiaries();
  }, []);

  const loadDiaries = async () => {
    try {
      // Replace with your actual API call
      // const response = await diaryApi.getUserDiaries();
      // setDiaries(response.data);
      
      // Temporary: Fetch from your existing endpoint
      const response = await fetch('/api/diaries', {
        credentials: 'include',
      });
      const data = await response.json();
      setDiaries(data.data || []);
    } catch (error) {
      console.error('Failed to load diaries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter diaries based on selected filter
  const filteredDiaries = useMemo(() => {
    switch (filter) {
      case 'shared':
        return diaries.filter((d) => d.contributorCount > 0);
      case 'private':
        return diaries.filter((d) => d.contributorCount === 0);
      default:
        return diaries;
    }
  }, [diaries, filter]);

  // Calculate counts for filter badges
  const filterCounts = useMemo(() => ({
    all: diaries.length,
    shared: diaries.filter((d) => d.contributorCount > 0).length,
    private: diaries.filter((d) => d.contributorCount === 0).length,
  }), [diaries]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 shadow-sm sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary-600" fill="currentColor" />
            <span className="text-2xl font-bold text-primary-600">Farewell Diary</span>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="hidden md:inline">Profile</span>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                My Collection
                {diaries.length > 0 && (
                  <span className="ml-3 text-lg text-secondary-500 font-normal">
                    {diaries.length}
                  </span>
                )}
              </h1>
              <p className="text-secondary-600">
                Your collection of precious memories and farewell messages
              </p>
            </div>

            {/* Filters */}
            {diaries.length > 0 && (
              <DiaryFilters
                filter={filter}
                onFilterChange={setFilter}
                counts={filterCounts}
              />
            )}
          </div>
        </div>

        {/* Diary Grid */}
        <DiaryGrid diaries={filteredDiaries} loading={loading} />

        {/* Floating Action Button */}
        <FloatingActionButton />
      </main>
    </div>
  );
}
