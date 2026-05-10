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
import DeleteDiaryDialog from '../components/dashboard/DeleteDiaryDialog';
import { authApi, diaryApi } from '../api';
import { DashboardDiary } from '../types';
import { useAuthStore } from '../stores/authStore';
import { consumeAuthReturnUrl } from '../utils/authRedirect';
import ThemeToggle from '../components/ThemeToggle';

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const [diaries, setDiaries] = useState<DashboardDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'shared' | 'private'>('all');
  const [diaryPendingDelete, setDiaryPendingDelete] =
    useState<DashboardDiary | null>(null);
  const [deletingDiaryId, setDeletingDiaryId] = useState<string | null>(null);

  // Profile dropdown state
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fallback for OAuth providers/browsers that drop the server-side callback session.
    const returnUrl = consumeAuthReturnUrl();
    if (returnUrl && returnUrl !== '/dashboard') {
      navigate(returnUrl, { replace: true });
      return;
    }
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

  const handleLogout = async () => {
    setProfileOpen(false);

    try {
      await authApi.logout();
    } catch (error) {
      if ((error as any)?.response?.status === 401) {
        logout();
        navigate('/', { replace: true });
        return;
      }

      console.error('Failed to destroy server session:', error);
      toast.error('Could not fully sign out. Please try again.');
      return;
    }

    logout();
    navigate('/', { replace: true });
  };

  const handleDeleteDiary = async () => {
    if (!diaryPendingDelete) return;

    setDeletingDiaryId(diaryPendingDelete.id);

    try {
      await diaryApi.delete(diaryPendingDelete.id);
      setDiaries((currentDiaries) =>
        currentDiaries.filter((diary) => diary.id !== diaryPendingDelete.id)
      );
      toast.success('Diary deleted successfully');
      setDiaryPendingDelete(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to delete diary');
    } finally {
      setDeletingDiaryId(null);
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
    <div className="site-shell">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
        <nav className="page-container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-7 w-7 text-primary" fill="currentColor" />
            <span className="brand-script text-3xl font-bold text-primary">
              Farewell Diary
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="btn btn-secondary"
            >
              <User className="h-5 w-5" />
              <span className="hidden md:inline">Profile</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {profileOpen && (
              <div className="sanctuary-card absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl p-1">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-foreground transition hover:bg-muted"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-destructive transition hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
          </div>
        </nav>
      </header>

      <main className="page-container py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="brand-script mb-2 text-5xl font-bold text-primary">
                My Collection
                {diaries.length > 0 && (
                  <span className="ml-3 align-middle text-lg font-bold text-muted-foreground">
                    {diaries.length}
                  </span>
                )}
              </h1>
              <p className="text-muted-foreground">
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
            <div className="sanctuary-card mx-auto max-w-2xl p-12">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-12 w-12 text-primary" fill="currentColor" />
              </div>
              <h2 className="brand-script mb-3 text-4xl font-bold text-primary">
                Create Your First Diary
              </h2>
              <p className="mb-8 text-muted-foreground">
                Start collecting heartfelt farewell messages from your loved
                ones
              </p>
              <button
                onClick={() => navigate('/create')}
                className="btn btn-primary px-8"
              >
                <Plus className="w-5 h-5" />
                Create Diary
              </button>
            </div>
          </div>
        )}

        {/* Diary Grid */}
        {diaries.length > 0 && (
          <DiaryGrid
            diaries={filteredDiaries}
            loading={loading}
            onDeleteDiary={setDiaryPendingDelete}
          />
        )}

        {/* Floating Action Button */}
        <FloatingActionButton />
      </main>

      {diaryPendingDelete && (
        <DeleteDiaryDialog
          diary={diaryPendingDelete}
          isDeleting={deletingDiaryId === diaryPendingDelete.id}
          onClose={() => {
            if (!deletingDiaryId) {
              setDiaryPendingDelete(null);
            }
          }}
          onConfirm={handleDeleteDiary}
        />
      )}
    </div>
  );
}
