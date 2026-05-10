import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { diaryApi } from '../api';
import ThemeToggle from '../components/ThemeToggle';

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (title.trim().length < 3) {
      toast.error('Title must be at least 3 characters');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="site-shell">
      <header className="border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
        <nav className="page-container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-7 w-7 text-primary" fill="currentColor" />
            <span className="brand-script text-3xl font-bold text-primary">Farewell Diary</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden md:inline">Back</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="page-container py-12">
        <div className="sanctuary-card mx-auto max-w-3xl p-8 md:p-12">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h1 className="brand-script mb-3 text-5xl font-bold text-primary">
              Create Your Farewell Diary
            </h1>
            <p className="text-lg text-muted-foreground">
              A safe space to collect heartfelt messages from your loved ones.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-muted-foreground">
                Diary Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="input"
                placeholder="e.g., My Farewell Journey"
                required
                minLength={3}
                maxLength={255}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Choose a meaningful title, between 3 and 255 characters.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-muted-foreground">
                Description
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="textarea h-32"
                placeholder="A brief description of what this diary means to you..."
                maxLength={1000}
              />
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/10 p-5">
              <h2 className="mb-3 font-bold text-primary">What happens next?</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>You'll get a unique shareable link.</li>
                <li>Friends and family can write private farewell notes.</li>
                <li>Only you can read the collected messages.</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn btn-primary w-full py-4 text-base"
            >
              {createMutation.isPending ? (
                <span className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
              {createMutation.isPending ? 'Creating...' : 'Create My Diary'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
