/**
 * PublicDiary.tsx - Trust & Context Page
 * 
 * This is the landing page when someone opens a shared diary link.
 * Purpose: Build trust, explain the product, and guide to contribution.
 * 
 * Route: /diary/:link
 * 
 * Flow:
 * 1. Show who shared the diary
 * 2. Explain what Farewell Diary is
 * 3. Explain why login is required
 * 4. CTA: Write Farewell Message (redirects to /write/:link)
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Shield, Lock, Edit, User, CheckCircle } from 'lucide-react';
import { diaryApi, notesApi } from '../api';
import { authApi } from '../api';
import { useAuthStore } from '../stores/authStore';

export default function PublicDiary() {
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Type inference from API client - no casting needed
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

  /**
   * Handle "Write Farewell Message" CTA
   * 
   * Redirects to /write/:link (the contribution editor)
   * The WriteFarewellNote page will handle auth if needed
   */
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!diaryData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-50">
        <div className="text-center bg-white p-12 rounded-3xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Diary Not Found</h2>
          <p className="text-gray-600">This diary link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Logo Header */}
        <div className="flex items-center justify-center mb-8">
          <Heart className="w-8 h-8 text-primary-600 mr-2" fill="currentColor" />
          <span className="text-2xl font-bold text-primary-600">Farewell Diary</span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Owner Message Section */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-8 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">This farewell diary was shared with you by</p>
                <h2 className="text-2xl font-bold text-gray-900">{diaryData.ownerName || 'Someone special'}</h2>
              </div>
            </div>
          </div>

          {/* Diary Info */}
          <div className="p-8 text-center border-b border-gray-100">
            <Heart className="w-16 h-16 text-primary-600 mx-auto mb-4" fill="currentColor" />
            <h1 className="text-3xl font-bold mb-3 text-gray-900">{diaryData.title}</h1>
            {diaryData.description && (
              <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
                {diaryData.description}
              </p>
            )}
          </div>

          {/* Main Content */}
          <div className="p-8">
            {checkData?.isOwner ? (
              /* Owner View */
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-900 mb-2">This is Your Diary</h3>
                <p className="text-blue-800 mb-6">
                  Visit your dashboard to view all farewell messages.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : hasWritten ? (
              /* Already Submitted */
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-900 mb-2">Thank You!</h3>
                <p className="text-green-800">
                  You've already written a farewell note for this diary.
                </p>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-blue-800 mb-6">
                  Visit your dashboard to create your own farewell messages.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg"
                >
                  Go to Dashboard
                </button>
              </div>
              </div>
            ) : (
              /* Contributor Call to Action */
              <div className="space-y-8">
                {/* What is Farewell Diary */}
                <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary-600" fill="currentColor" />
                    What is Farewell Diary?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Farewell Diary is a private, meaningful space to leave a heartfelt message 
                    that will be preserved forever. Your words will be cherished by the diary owner.
                  </p>
                </div>

                {/* Why Login Required */}
                <div className="bg-secondary-50 rounded-2xl p-6 border border-secondary-100">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-secondary-600" />
                    Why We Ask You to Sign In
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    To protect these precious memories from spam and misuse, we ask contributors 
                    to sign in with Google. This ensures:
                  </p>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Messages are trustworthy and accountable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>No spam or impersonation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Emotional safety for everyone</span>
                    </li>
                  </ul>
                </div>

                {/* Privacy Reassurance */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-600" />
                    Your Privacy is Protected
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>Your message is <strong>encrypted</strong> and private</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>Only the diary owner can read it</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span>You can write <strong>one meaningful note</strong></span>
                    </li>
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="text-center pt-4">
                  <button
                    onClick={handleWriteNote}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-10 py-5 rounded-2xl transition-all duration-200 flex items-center gap-3 mx-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
                  >
                    <Edit className="w-6 h-6" />
                    Write a Farewell Message
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    {isAuthenticated 
                      ? 'You are signed in and ready to write' 
                      : 'You\'ll be asked to sign in with Google first'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by Farewell Diary • Preserving meaningful moments</p>
        </div>
      </div>
    </div>
  );
}
