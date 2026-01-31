import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Heart, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { diaryApi } from '../api';

export default function CreateDiary() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createMutation = useMutation({
    mutationFn: () => diaryApi.create({ title, description }),
    onSuccess: () => {
      toast.success('Diary created successfully!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to create diary';
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 3) {
      toast.error('Title must be at least 3 characters');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary-600" fill="currentColor" />
            <span className="text-2xl font-bold text-primary-600">Farewell Diary</span>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Back</span>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary-600" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-3">
              Create Your Farewell Diary
            </h1>
            <p className="text-secondary-600 text-lg">
              A safe space to collect heartfelt messages from your loved ones
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Diary Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="e.g., My Farewell Journey"
                required
                minLength={3}
                maxLength={255}
              />
              <p className="text-xs text-secondary-500 mt-1">
                Choose a meaningful title (3-255 characters)
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-secondary-300 rounded-xl h-32 resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="A brief description of what this diary means to you..."
                maxLength={1000}
              />
              <p className="text-xs text-secondary-500 mt-1">
                Help contributors understand the purpose of your diary
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
              <h3 className="font-semibold text-primary-900 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-primary-800">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-0.5">✓</span>
                  <span>You'll get a unique shareable link</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-0.5">✓</span>
                  <span>Friends and family can write you farewell notes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-0.5">✓</span>
                  <span>Only you can read the messages - they're encrypted</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-300 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none"
            >
              {createMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Create My Diary
                </span>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}