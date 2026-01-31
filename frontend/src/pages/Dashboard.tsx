/**
 * Dashboard Page - Enhanced Version
 * Shows user's diary collection with filters and enhanced UI
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  User,
  Plus,
  ChevronDown,
  Settings,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';

import DiaryGrid from '../components/dashboard/DiaryGrid';
import DiaryFilters from '../components/dashboard/DiaryFilters';
import FloatingActionButton from '../components/dashboard/FloatingActionButton';
import { diaryApi } from '../api';
import { DashboardDiary } from '../types';
import { useAuthStore } from '../stores/authStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const [diaries, setDiaries] = useState<DashboardDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'shared' | 'private'>('all');

  // Profile dropdown state
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadDiaries();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadDiaries = async () => {
    try {
      const response = await diaryApi.getUserDiaries();
      setDiaries(response.data?.data ?? []);
    } catch (error) {
      console.error('Failed to load diaries:', error);
      toast.error('Failed to load diaries');
      setDiaries([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter diaries
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

  // Filter counts
  const filterCounts = useMemo(
    () => ({
      all: diaries.length,
      shared: diaries.filter((d) => d.contributorCount > 0).length,
      private: diaries.filter((d) => d.contributorCount === 0).length,
    }),
    [diaries]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 shadow-sm sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary-600" fill="currentColor" />
            <span className="text-2xl font-bold text-primary-600">
              Farewell Diary
            </span>
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Profile</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-secondary-200 z-50 overflow-hidden">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setProfileOpen(false);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-secondary-700 hover:bg-secondary-50 transition"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
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

            {diaries.length > 0 && (
              <DiaryFilters
                filter={filter}
                onFilterChange={setFilter}
                counts={filterCounts}
              />
            )}
          </div>
        </div>

        {/* Empty State */}
        {!loading && diaries.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-primary-600" fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-3">
                Create Your First Diary
              </h2>
              <p className="text-secondary-600 mb-8">
                Start collecting heartfelt farewell messages from your loved
                ones
              </p>
              <button
                onClick={() => navigate('/create')}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-xl inline-flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Create Diary
              </button>
            </div>
          </div>
        )}

        {/* Diary Grid */}
        {diaries.length > 0 && (
          <DiaryGrid diaries={filteredDiaries} loading={loading} />
        )}

        {/* Floating Action Button */}
        <FloatingActionButton />
      </main>
    </div>
  );
}
