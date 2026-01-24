import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogOut, Copy, RefreshCw, Plus, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { diaryApi, authApi } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import CreateDiaryModal from '../components/CreateDiaryModal';
import NoteCard from '../components/NoteCard';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch owner diary
  const { data: diaryData, isLoading } = useQuery({
    queryKey: ['myDiary'],
    queryFn: async () => {
      const res = await diaryApi.getMy();
      return res.data.data;
    },
  });

  // Fetch notes ONLY if diary exists
  const { data: notesData } = useQuery({
    queryKey: ['myNotes', diaryData?.diary?.id],
    queryFn: async () => {
      const res = await diaryApi.getMyNotes(diaryData!.diary.id);
      return res.data.data;
    },
    enabled: !!diaryData?.diary?.id,
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
      logout();
      navigate('/');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to logout');
    }
  };

  const copyLink = () => {
    if (!diaryData?.shareableUrl) return;
    navigator.clipboard.writeText(diaryData.shareableUrl);
    toast.success('Link copied to clipboard!');
  };

  const regenerateMutation = useMutation({
    mutationFn: () => {
      if (!diaryData?.diary?.id) {
        throw new Error('Diary not found');
      }
      return diaryApi.regenerateLink(diaryData.diary.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDiary'] });
      toast.success('New link generated successfully!');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">
            Farewell Diary
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary-600">
              Hello, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!diaryData?.diary ? (
          /* ✅ OWNER EMPTY STATE */
          <div className="text-center py-20 max-w-2xl mx-auto">
            <BookOpen className="w-24 h-24 text-primary-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Welcome to Farewell Diary
            </h2>
            <p className="text-secondary-600 mb-6">
              Create a private space where friends can write heartfelt farewell
              notes to you. All messages are encrypted and only you can read
              them.
            </p>

            <div className="bg-primary-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-lg mb-4">
                How it works:
              </h3>
              <ol className="space-y-3 text-secondary-700">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>Create your diary with a title and description</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>Share your unique link with friends</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>Friends write one farewell note each</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span>View all messages in your dashboard</span>
                </li>
              </ol>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary flex items-center gap-2 mx-auto text-lg px-8 py-3"
            >
              <Plus className="w-5 h-5" />
              Create Your Diary
            </button>
          </div>
        ) : (
          /* ✅ OWNER DASHBOARD */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-4">
                <h2 className="text-2xl font-bold mb-4">
                  {diaryData.diary.title}
                </h2>
                {diaryData.diary.description && (
                  <p className="text-secondary-600 mb-6">
                    {diaryData.diary.description}
                  </p>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Shareable Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={diaryData.shareableUrl}
                        readOnly
                        className="input flex-1 text-sm"
                      />
                      <button
                        onClick={copyLink}
                        className="btn btn-secondary p-3"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => regenerateMutation.mutate()}
                    className="btn btn-outline w-full flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate Link
                  </button>

                  {/* ✅ STEP 10: ENHANCED NOTE COUNTER */}
                  <div className="pt-4 border-t border-secondary-200">
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4">
                      <p className="text-4xl font-bold text-primary-600 mb-1">
                        {diaryData.noteCount}
                      </p>
                      <p className="text-sm font-medium text-primary-800">
                        {diaryData.noteCount === 1
                          ? 'Farewell Note'
                          : 'Farewell Notes'}
                      </p>
                      <p className="text-xs text-primary-600 mt-1">
                        {diaryData.noteCount === 0
                          ? 'Share your link to start receiving notes'
                          : 'Encrypted & Private'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">
                Your Farewell Notes
              </h2>
              {notesData?.notes?.length ? (
                <div className="space-y-4">
                  {notesData.notes.map((note: any) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <p className="text-secondary-600">
                    No notes yet. Share your diary link with friends!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateDiaryModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
