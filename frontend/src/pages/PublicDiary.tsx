import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Edit } from 'lucide-react';
import { diaryApi, notesApi } from '../api';
import { useAuthStore } from '../stores/authStore';

export default function PublicDiary() {
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate();
useAuthStore();

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

  const handleWriteNote = () => {
    navigate(`/diary/${link}/write`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!diaryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Diary not found
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <BookOpen className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">{diaryData.title}</h1>
          {diaryData.description && (
            <p className="text-secondary-600 mb-8">
              {diaryData.description}
            </p>
          )}

          {checkData?.isOwner ? (
            <p className="text-secondary-600">
              This is your diary. Visit your dashboard to view notes.
            </p>
          ) : checkData?.hasWritten ? (
            <p className="text-secondary-600">
              You've already written a farewell note. Thank you!
            </p>
          ) : (
            <div>
              {/* ✅ CONTRIBUTOR GUIDANCE */}
              <div className="bg-secondary-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold mb-3">Before you write:</h3>
                <ul className="space-y-2 text-secondary-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>
                      You can write <strong>one farewell note</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>
                      Your message is <strong>encrypted and private</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Only the diary owner can read it</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>You can choose to post anonymously</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleWriteNote}
                className="btn btn-primary flex items-center gap-2 mx-auto"
              >
                <Edit className="w-5 h-5" />
                Write Your Farewell Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
