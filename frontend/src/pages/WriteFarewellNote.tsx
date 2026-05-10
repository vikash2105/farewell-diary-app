import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Eye, Heart, Send, Type } from 'lucide-react';
import { toast } from 'sonner';
import { diaryApi, notesApi } from '../api';
import ThemeToggle from '../components/ThemeToggle';
import { useAuthStore } from '../stores/authStore';

type FontStyle = 'default' | 'handwriting' | 'serif' | 'cursive';

const fontOptions: FontStyle[] = ['default', 'handwriting', 'serif', 'cursive'];

export default function WriteFarewellNote() {
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [content, setContent] = useState('');
  const [fontStyle, setFontStyle] = useState<FontStyle>('default');

  const { data: diaryResponse } = useQuery({
    queryKey: ['diaryPublic', link],
    queryFn: () => diaryApi.getByLink(link!),
    enabled: !!link,
  });

  const diary = diaryResponse?.data.data;

  useEffect(() => {
    if (!link || !isAuthenticated) return;

    const savedDraft = localStorage.getItem(`farewell_draft_${link}`);
    if (!savedDraft) return;

    try {
      const { content: savedContent, fontStyle: savedFont } = JSON.parse(savedDraft);
      if (savedContent) setContent(savedContent);
      if (savedFont) setFontStyle(savedFont);
    } catch (error) {
      console.error('Failed to parse draft', error);
    }
  }, [link, isAuthenticated]);

  useEffect(() => {
    if (!link || !isAuthenticated) return;
    localStorage.setItem(`farewell_draft_${link}`, JSON.stringify({ content, fontStyle }));
  }, [content, fontStyle, link, isAuthenticated]);

  const createNoteMutation = useMutation({
    mutationFn: () =>
      notesApi.create(link!, {
        content,
        fontStyle,
        isAnonymous: false,
      }),
    onSuccess: () => {
      localStorage.removeItem(`farewell_draft_${link}`);
      toast.success('Your farewell note was submitted successfully!', {
        duration: 3000,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to save note');
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (content.trim().length < 10) {
      toast.error('Please write at least 10 characters');
      return;
    }

    createNoteMutation.mutate();
  };

  const getFontClass = (style: string) => {
    switch (style) {
      case 'handwriting':
        return 'font-handwriting';
      case 'serif':
        return 'font-serif';
      case 'cursive':
        return 'font-cursive';
      default:
        return 'font-default';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="site-shell flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

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
              <span className="hidden md:inline">Dashboard</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="page-container py-8 md:py-12">
        <h1 className="brand-script mb-2 text-center text-5xl font-bold text-primary">
          Write Your Farewell Note
        </h1>
        {diary ? (
          <p className="mb-8 text-center text-muted-foreground">
            Writing for <span className="font-bold text-foreground">{diary.title}</span>
          </p>
        ) : (
          <div className="mb-8 h-6" />
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="sanctuary-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <Type className="h-5 w-5 text-primary" />
                Compose
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-bold text-muted-foreground">
                    Font Style
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {fontOptions.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setFontStyle(style)}
                        className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                          fontStyle === style
                            ? 'border-primary bg-primary/10 font-bold text-primary ring-2 ring-primary/20'
                            : 'border-border text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-muted-foreground">
                    Message
                  </label>
                  <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    className={`textarea h-64 text-lg leading-relaxed ${getFontClass(fontStyle)}`}
                    placeholder="Write your heartfelt message here..."
                    required
                  />
                  <div className="mt-2 text-right text-xs text-muted-foreground">
                    {content.length} characters
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createNoteMutation.isPending}
                  className="btn btn-primary w-full py-4 text-lg"
                >
                  {createNoteMutation.isPending ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  Submit Farewell Note
                </button>
              </form>
            </div>
          </div>

          <div className="hidden space-y-6 lg:block">
            <div className="sticky top-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Eye className="h-5 w-5 text-primary" />
                  Live Preview
                </h2>
                <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                  What the owner sees
                </span>
              </div>

              <div className="sanctuary-card relative flex min-h-[400px] flex-col overflow-hidden p-8">
                <div className="pointer-events-none absolute left-4 top-4 text-primary/10">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M14.017 21v-3c0-1.105.895-2 2-2h3c.552 0 1-.448 1-1V9c0-.552-.448-1-1-1h-4c-.552 0-1 .448-1 1v2c0 .552-.448 1-1 1h-1V5h10v10c0 3.314-2.686 6-6 6h-2Zm-9 0v-3c0-1.105.895-2 2-2h3c.552 0 1-.448 1-1V9c0-.552-.448-1-1-1h-4c-.552 0-1 .448-1 1v2c0 .552-.448 1-1 1h-1V5h10v10c0 3.314-2.686 6-6 6h-2Z" />
                  </svg>
                </div>

                <div className={`relative z-10 flex-grow whitespace-pre-wrap text-lg leading-relaxed text-foreground ${getFontClass(fontStyle)}`}>
                  {content || <span className="italic text-muted-foreground/50">Your message will appear here...</span>}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {(user?.name || 'You').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {user?.name || 'Your Name'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
