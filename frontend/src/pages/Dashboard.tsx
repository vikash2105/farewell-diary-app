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

  const { data: diaryData, isLoading } = useQuery({
    queryKey: ['myDiary'],
    queryFn: async () => {
      const res = await diaryApi.getMy();
      return res.data.data;
    },
  });

  const { data: notesData } = useQuery({
    queryKey: ['myNotes'],
    queryFn: async () => {
      const res = await diaryApi.getMyNotes();
      return res.data.data;
    },
    enabled: !!diaryData?.diary,
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
    if (diaryData?.shareableUrl) {
      navigator.clipboard.writeText(diaryData.shareableUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  const regenerateMutation = useMutation({
    mutationFn: () => diaryApi.regenerateLink(diaryData!.diary.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDiary'] });
      toast.success('New link generated successfully!');
    },
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Farewell Diary</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary-600">Hello, {user?.name}</span>
            <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!diaryData?.diary ? (
          <div className="text-center py-20">
            <BookOpen className="w-24 h-24 text-primary-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Create Your Farewell Diary</h2>
            <p className="text-secondary-600 mb-8 max-w-md mx-auto">
              Start by creating your diary. You'll get a unique link to share with friends.
            </p>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary flex items-center gap-2 mx-auto">
              <Plus className="w-5 h-5" />
              Create Diary
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-4">
                <h2 className="text-2xl font-bold mb-4">{diaryData.diary.title}</h2>
                {diaryData.diary.description && (
                  <p className="text-secondary-600 mb-6">{diaryData.diary.description}</p>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Shareable Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={diaryData.shareableUrl}
                        readOnly
                        className="input flex-1 text-sm"
                      />
                      <button onClick={copyLink} className="btn btn-secondary p-3">
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

                  <div className="pt-4 border-t border-secondary-200">
                    <p className="text-2xl font-bold text-primary-600">{diaryData.noteCount}</p>
                    <p className="text-sm text-secondary-600">Farewell Notes Received</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Your Farewell Notes</h2>
              {notesData?.notes && notesData.notes.length > 0 ? (
                <div className="space-y-4">
                  {notesData.notes.map((note) => (
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

      {showCreateModal && <CreateDiaryModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}
