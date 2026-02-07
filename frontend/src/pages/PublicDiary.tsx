/**
 * PublicDiary.tsx - Trust & Context Page
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Shield, Lock, Edit, User, CheckCircle } from 'lucide-react';
import { diaryApi, notesApi, authApi } from '../api';
import { useAuthStore } from '../stores/authStore';

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
      authApi.loginWithGoogle(`${window.location.origin}${writePath}`);
      return;
    }

    navigate(writePath);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="h-12 w-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  if (!diaryData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md">
          <Heart className="w-14 h-14 text-red-500 mx-auto mb-4" fill="currentColor" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Diary Not Found
          </h2>
          <p className="text-gray-600">
            This link is invalid or no longer active.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center items-center mb-10 gap-2">
          <Heart className="w-8 h-8 text-primary-600" fill="currentColor" />
          <span className="text-2xl font-bold text-primary-700">
            Farewell Diary
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-8 py-6 border-b">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  This diary was shared with you by
                </p>
                <h2 className="text-xl font-semibold text-gray-900">
                  {diaryData.ownerName || 'Someone special'}
                </h2>
              </div>
            </div>
          </div>

          <div className="px-8 py-10 text-center border-b">
            <Heart className="w-16 h-16 text-primary-600 mx-auto mb-4" fill="currentColor" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {diaryData.title}
            </h1>
            {diaryData.description && (
              <p className="text-gray-600 max-w-xl mx-auto">
                {diaryData.description}
              </p>
            )}
          </div>

          <div className="p-8">
            {checkData?.isOwner ? (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  This is your diary
                </h3>
                <p className="text-blue-800 mb-6">
                  View all farewell messages from your dashboard.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : hasWritten ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-900 mb-2">
                  Thank you
                </h3>
                <p className="text-green-800 mb-6">
                  You have already written a farewell message.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-primary-50 rounded-2xl p-6 border">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary-600" fill="currentColor" />
                    What is Farewell Diary
                  </h3>
                  <p className="text-gray-700">
                    A private space to write one meaningful message that will be
                    preserved forever.
                  </p>
                </div>

                <div className="bg-secondary-50 rounded-2xl p-6 border">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-secondary-600" />
                    Why sign in
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Trusted and accountable messages
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Protection from spam
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Emotional safety
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-600" />
                    Privacy
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600" />
                      Only the owner can read your message
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600" />
                      One message per person
                    </li>
                  </ul>
                </div>

                <div className="pt-4 text-center">
                  <button
                    onClick={handleWriteNote}
                    className="px-10 py-4 rounded-2xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition flex items-center gap-3 mx-auto"
                  >
                    <Edit className="w-6 h-6" />
                    Write a Farewell Message
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    {isAuthenticated
                      ? 'You are signed in'
                      : 'Google sign in required'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Powered by Farewell Diary
        </p>
      </div>
    </div>
  );
}
