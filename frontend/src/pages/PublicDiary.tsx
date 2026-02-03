// frontend/src/pages/PublicDiary.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Edit } from 'lucide-react';
import { diaryApi, notesApi } from '../api';
import { useAuthStore } from '../stores/authStore';

export default function PublicDiary() {
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const { data: diaryData, isLoading } = useQuery({
    queryKey: ['publicDiary', link],
    queryFn: async () => {
      const res = await diaryApi.getByLink(link!);
      return res.data.data;
    },
  });

  const { data: checkData } = useQuery({
    queryKey: ['checkNote', link],
    queryFn: async () => {
      const res = await notesApi.checkUserNote(link!);
      return res.data.data;
    },
    enabled: !!link,
  });

  // Check local storage for anonymous submission
  const hasLocalSubmission = link ? localStorage.getItem(`farewell_note_written_${link}`) === 'true' : false;
  
  const hasWritten = checkData?.hasWritten || hasLocalSubmission;

  /**
   * ✅ FIXED: Authentication-aware CTA handler
   * 
   * Case A: User is logged in → Navigate directly to write page
   * Case B: User is NOT logged in → Redirect to Google OAuth with callback
   */
  const handleWriteNote = () => {
    if (isAuthenticated) {
      // Case A: Already authenticated - direct navigation
      navigate(`/diary/${link}/write`);
    } else {
      // Case B: Not authenticated - redirect to Google OAuth
      // Construct callback URL to return to write page after login
      const writePageUrl = `${window.location.origin}/diary/${link}/write`;
      const callbackUrl = encodeURIComponent(writePageUrl);
      const authUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/google?callbackUrl=${callbackUrl}`;
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!diaryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Diary not found</h2>
          <p className="text-gray-600">This diary link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <BookOpen className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{diaryData.title}</h1>
          {diaryData.description && (
            <p className="text-gray-600 mb-8">
              {diaryData.description}
            </p>
          )}

          {checkData?.isOwner ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-900 font-medium">
                This is your diary. Visit your dashboard to view notes.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          ) : hasWritten ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-green-900 font-medium">
                You've already written a farewell note. Thank you!
              </p>
            </div>
          ) : (
            <div>
              {/* ✅ CONTRIBUTOR GUIDANCE */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Before you write:</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>
                      You can write <strong>one farewell note</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>
                      Your message is <strong>encrypted and private</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Only the diary owner can read it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>You can choose to post anonymously</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">ℹ</span>
                    <span>
                      {isAuthenticated 
                        ? 'You are signed in and ready to write' 
                        : 'You will be asked to sign in with Google'}
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleWriteNote}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Edit className="w-5 h-5" />
                {isAuthenticated ? 'Write Your Farewell Note' : 'Sign In & Write Note'}
              </button>
              
              {!isAuthenticated && (
                <p className="text-xs text-gray-500 mt-3">
                  You'll be redirected to Google to sign in securely
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
