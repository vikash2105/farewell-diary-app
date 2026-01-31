import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { diaryApi, notesApi } from '../api/client';
import UserMenu from '../components/UserMenu';
import type { FarewellNote } from '../types';
import { format } from 'date-fns';

export default function ViewNotes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<FarewellNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await diaryApi.getMyNotes();
      setNotes(response.data.data?.notes || []);
    } catch (error: any) {
      console.error('Failed to load notes:', error);
      toast.error(error.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    setDeleting(noteId);
    try {
      await notesApi.delete(noteId);
      toast.success('Note deleted successfully');
      setNotes(notes.filter(n => n.id !== noteId));
    } catch (error: any) {
      console.error('Failed to delete note:', error);
      toast.error(error.response?.data?.message || 'Failed to delete note');
    } finally {
      setDeleting(null);
    }
  };

  const getFontClass = (fontStyle: string) => {
    switch (fontStyle) {
      case 'handwriting':
        return 'font-handwriting';
      case 'serif':
        return 'font-serif';
      case 'cursive':
        return 'font-cursive';
      default:
        return 'font-sans';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 shadow-sm sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-secondary-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-primary-600" fill="currentColor" />
              <span className="text-2xl font-bold text-primary-600">Farewell Notes</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors"
          >
            <UserMenu />
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Your Farewell Notes
            {notes.length > 0 && (
              <span className="ml-3 text-lg text-secondary-500 font-normal">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </span>
            )}
          </h1>
          <p className="text-secondary-600">
            Heartfelt messages from people who care about you
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && notes.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-primary-600" fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-3">
                No Notes Yet
              </h2>
              <p className="text-secondary-600 mb-8">
                Share your diary link with others so they can leave farewell messages for you
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-xl inline-flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {!loading && notes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 border border-secondary-100"
              >
                {/* Note Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-900">
                        {note.isAnonymous ? 'Anonymous' : note.authorName}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {format(new Date(note.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(note.id)}
                    disabled={deleting === note.id}
                    className="text-secondary-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Delete note"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Note Content */}
                <div className={`text-secondary-700 leading-relaxed ${getFontClass(note.fontStyle)}`}>
                  <p className="whitespace-pre-wrap">{note.content}</p>
                </div>

                {/* Note Footer */}
                {!note.isAnonymous && note.authorEmail && (
                  <div className="mt-4 pt-4 border-t border-secondary-100">
                    <p className="text-xs text-secondary-500 truncate">
                      {note.authorEmail}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
