import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Heart, MessageCircle, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { diaryApi } from '../api';
import ThemeToggle from '../components/ThemeToggle';
import { Diary, FarewellNote } from '../types';

export default function ViewNotes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const diaryId = searchParams.get('diaryId') || undefined;

  const [notes, setNotes] = useState<FarewellNote[]>([]);
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    diaryApi
      .getMyNotes(diaryId)
      .then((res) => {
        if (res.data.data) {
          setNotes(res.data.data.notes);
          if (res.data.data.diary) setDiary(res.data.data.diary);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to load notes');
      })
      .finally(() => setLoading(false));
  }, [diaryId]);

  const copyLink = () => {
    if (!diary) return;
    navigator.clipboard.writeText(`${window.location.origin}/diary/${diary.uniqueLink}`);
    toast.success('Link copied to clipboard!');
  };

  const openPublic = () => {
    if (!diary) return;
    window.open(`/diary/${diary.uniqueLink}`, '_blank');
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

  if (loading) {
    return (
      <div className="site-shell flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="site-shell">
      <header className="border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
        <nav className="page-container flex h-16 items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="btn btn-ghost px-3">
            <ArrowLeft className="h-5 w-5" />
            Dashboard
          </button>
          <div className="flex items-center gap-2">
            <Heart className="h-7 w-7 text-primary" fill="currentColor" />
            <span className="brand-script hidden text-3xl font-bold text-primary sm:inline">
              Farewell Diary
            </span>
          </div>
          <ThemeToggle />
        </nav>
      </header>

      <main className="page-container py-8">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="brand-script text-5xl font-bold text-primary">
              {diary?.title || 'My Farewell Notes'}
            </h1>
            {diary?.description && (
              <p className="mt-2 max-w-2xl text-muted-foreground">{diary.description}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={copyLink} className="btn btn-secondary">
              <Share2 className="h-4 w-4" />
              Copy Link
            </button>
            <button onClick={openPublic} className="btn btn-secondary">
              <ExternalLink className="h-4 w-4" />
              View Public
            </button>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="sanctuary-card py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-1 text-lg font-bold">No notes yet</h2>
            <p className="mb-6 text-muted-foreground">Share your diary link to receive farewell messages.</p>
            <button onClick={copyLink} className="btn btn-primary">
              Copy Share Link
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {notes.map((note) => (
              <article key={note.id} className="sanctuary-card p-8">
                <p className={`note-content mb-6 whitespace-pre-wrap text-foreground ${getFontClass(note.fontStyle)}`}>
                  {note.content}
                </p>
                <div className="flex items-center justify-between border-t border-border/60 pt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      {note.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-foreground">{note.authorName}</span>
                  </div>
                  <time dateTime={note.createdAt}>
                    {new Date(note.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
