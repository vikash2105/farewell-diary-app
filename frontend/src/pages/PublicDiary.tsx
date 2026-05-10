import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Edit, Heart, Lock, Shield, User } from 'lucide-react';
import { authApi, diaryApi, notesApi } from '../api';
import ThemeToggle from '../components/ThemeToggle';
import { useAuthStore } from '../stores/authStore';
import { rememberAuthReturnUrl, toAbsoluteFrontendUrl } from '../utils/authRedirect';

export default function PublicDiary() {
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const { data: diaryResponse, isLoading } = useQuery({
    queryKey: ['publicDiary', link],
    queryFn: () => diaryApi.getByLink(link!),
    enabled: !!link,
  });

  const diaryData = diaryResponse?.data.data;

  const { data: checkData } = useQuery({
    queryKey: ['checkNote', link],
    queryFn: async () => {
      const res = await notesApi.checkUserNote(link!);
      return res.data.data;
    },
    enabled: !!link && isAuthenticated,
  });

  const hasWritten = checkData?.hasWritten || false;

  const handleWriteNote = () => {
    if (!link) return;

    const writePath = `/write/${link}`;
    if (!isAuthenticated) {
      rememberAuthReturnUrl(writePath);
      authApi.loginWithGoogle(toAbsoluteFrontendUrl(writePath));
      return;
    }

    navigate(writePath);
  };

  if (isLoading) {
    return (
      <div className="site-shell flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!diaryData) {
    return (
      <div className="site-shell flex items-center justify-center px-4">
        <div className="sanctuary-card max-w-md p-10 text-center">
          <Heart className="mx-auto mb-4 h-14 w-14 text-destructive" fill="currentColor" />
          <h2 className="mb-2 text-2xl font-bold">Diary Not Found</h2>
          <p className="text-muted-foreground">This link is invalid or no longer active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="site-shell px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" fill="currentColor" />
            <span className="brand-script text-3xl font-bold text-primary">Farewell Diary</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="sanctuary-card overflow-hidden">
          <div className="border-b border-border/60 bg-primary/10 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This diary was shared with you by</p>
                <h2 className="text-xl font-bold text-foreground">
                  {diaryData.ownerName || 'Someone special'}
                </h2>
              </div>
            </div>
          </div>

          <div className="border-b border-border/60 px-8 py-10 text-center">
            <Heart className="mx-auto mb-4 h-16 w-16 text-primary" fill="currentColor" />
            <h1 className="brand-script mb-3 text-5xl font-bold text-primary">
              {diaryData.title}
            </h1>
            {diaryData.description && (
              <p className="mx-auto max-w-xl text-muted-foreground">{diaryData.description}</p>
            )}
          </div>

          <div className="p-8">
            {checkData?.isOwner ? (
              <StatusPanel
                tone="info"
                title="This is your diary"
                message="View all farewell messages from your dashboard."
                action="Go to Dashboard"
                onAction={() => navigate('/dashboard')}
              />
            ) : hasWritten ? (
              <StatusPanel
                tone="success"
                title="Thank you"
                message="You have already written a farewell message."
                action="Go to Dashboard"
                onAction={() => navigate('/dashboard')}
              />
            ) : (
              <div className="space-y-5">
                <InfoPanel
                  icon={Heart}
                  title="What is Farewell Diary"
                  copy="A private space to write one meaningful message that will be preserved forever."
                />
                <InfoPanel
                  icon={Shield}
                  title="Why sign in"
                  copy="Signed-in contributors help keep messages trusted, accountable, and protected from spam."
                />
                <InfoPanel
                  icon={Lock}
                  title="Privacy"
                  copy="Only the owner can read your message, and each person can submit one note."
                />

                <div className="pt-4 text-center">
                  <button onClick={handleWriteNote} className="btn btn-primary mx-auto px-8 py-4 text-base">
                    <Edit className="h-5 w-5" />
                    Write a Farewell Message
                  </button>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {isAuthenticated ? 'You are signed in.' : 'Google sign in required.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">Powered by Farewell Diary</p>
      </div>
    </div>
  );
}

function InfoPanel({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof Heart;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/50 p-5">
      <h3 className="mb-2 flex items-center gap-2 font-bold">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h3>
      <p className="text-sm leading-6 text-muted-foreground">{copy}</p>
    </div>
  );
}

function StatusPanel({
  tone,
  title,
  message,
  action,
  onAction,
}: {
  tone: 'info' | 'success';
  title: string;
  message: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/10 p-8 text-center">
      <CheckCircle className={`mx-auto mb-4 h-12 w-12 ${tone === 'success' ? 'text-green-600 dark:text-green-300' : 'text-primary'}`} />
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="mb-6 text-muted-foreground">{message}</p>
      <button onClick={onAction} className="btn btn-primary px-8">
        {action}
      </button>
    </div>
  );
}
