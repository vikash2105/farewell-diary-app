import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { diaryApi } from '../api';
import DiaryCover from '../components/diary/DiaryCover';
import DiaryShell from '../components/diary/DiaryShell';
import { Diary, FarewellNote } from '../types';

export default function ViewNotes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const diaryId = searchParams.get('diaryId') || undefined;

  const [notes, setNotes] = useState<FarewellNote[]>([]);
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="site-shell flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (notes.length > 0 && !isDiaryOpen) {
    return (
      <DiaryCover
        diary={diary}
        noteCount={notes.length}
        onBack={() => navigate('/dashboard')}
        onCopyLink={copyLink}
        onOpenPublic={openPublic}
        onOpenDiary={() => setIsDiaryOpen(true)}
      />
    );
  }

  if (notes.length > 0 && isDiaryOpen) {
    return (
      <DiaryShell
        diary={diary}
        notes={notes}
        onBack={() => navigate('/dashboard')}
        onCopyLink={copyLink}
        onOpenPublic={openPublic}
        onCloseDiary={() => setIsDiaryOpen(false)}
      />
    );
  }

  return (
    <div className="site-shell diary-stage">
      <main className="page-container py-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center">
          <div className="sanctuary-card w-full py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="brand-script mb-1 text-5xl font-bold text-primary">
              {diary?.title || 'Your diary is waiting'}
            </h1>
            <p className="mx-auto mb-6 max-w-sm text-muted-foreground">
              Share your diary link to receive farewell messages. Once notes arrive, this page opens as a living memory book.
            </p>
            <div className="flex justify-center gap-2">
              <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                Dashboard
              </button>
              <button onClick={copyLink} className="btn btn-primary">
                Copy Share Link
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
