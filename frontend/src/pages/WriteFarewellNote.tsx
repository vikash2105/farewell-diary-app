/**
 * WriteFarewellNote.tsx - Contribution Editor
 * 
 * Route: /write/:link
 * Access: Requires authentication
 * 
 * Features:
 * - Font style selection
 * - Live preview (updates on every keystroke)
 * - Auto-save drafts
 * - Post-submission redirect to dashboard
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Send, Type, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { notesApi, diaryApi } from '../api';
import { useAuthStore } from '../stores/authStore';

export default function WriteFarewellNote() {
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [content, setContent] = useState('');
  const [fontStyle, setFontStyle] = useState<'default' | 'handwriting' | 'serif' | 'cursive'>('default');

  // Fetch diary details for title
  const { data: diary } = useQuery({
    queryKey: ['diaryPublic', link],
    queryFn: () => diaryApi.getByLink(link!).then(res => res.data.data),
    enabled: !!link
  });

  /**
   * AUTH GATE: Redirect to login if not authenticated
   * This page requires authentication - redirect to Google OAuth if needed
   */
  useEffect(() => {
    if (!link) return;
    
    if (!isAuthenticated) {
      // User is not authenticated - redirect to Google OAuth
      const currentUrl = window.location.href;
      const callbackUrl = encodeURIComponent(currentUrl);
      const authUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/google?callbackUrl=${callbackUrl}`;
      
      toast.info('Please sign in to write your farewell note');
      
      setTimeout(() => {
        window.location.href = authUrl;
      }, 1000);
    }
  }, [isAuthenticated, link]);

  // Load saved draft (only for authenticated users)
  useEffect(() => {
    if (!link || !isAuthenticated) return;
    
    const draftKey = `farewell_draft_${link}`;
    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
      try {
        const { content: savedContent, fontStyle: savedFont } = JSON.parse(savedDraft);
        if (savedContent) setContent(savedContent);
        if (savedFont) setFontStyle(savedFont);
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, [link, isAuthenticated]);

  const createNoteMutation = useMutation({
    mutationFn: () => notesApi.create(link!, {
      content,
      fontStyle,
      isAnonymous: false,
    }),
    onSuccess: () => {
      // Clear draft on success
      localStorage.removeItem(`farewell_draft_${link}`);
      
      toast.success('✅ Your farewell note was submitted successfully!', {
        duration: 3000,
      });
      
      // ✅ NEW: Redirect to dashboard after submission
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to save note');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (content.trim().length < 10) {
      toast.error('Please write at least 10 characters');
      return;
    }

    createNoteMutation.mutate();
  };

  // Auto-save draft
  useEffect(() => {
      if (!link || !isAuthenticated) return;
      const draftKey = `farewell_draft_${link}`;
      localStorage.setItem(draftKey, JSON.stringify({ content, fontStyle }));
  }, [content, fontStyle, link, isAuthenticated]);

  const getFontClass = (style: string) => {
    switch (style) {
      case 'handwriting': return 'font-handwriting';
      case 'serif': return 'font-serif';
      case 'cursive': return 'font-cursive';
      default: return 'font-sans';
    }
  };

  // Show loading if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">Write Your Farewell Note</h1>
        {diary && (
             <p className="text-center text-secondary-600 mb-8">
                 Writing for <span className="font-semibold">{diary.title}</span>
             </p>
        )}
        {!diary && <div className="mb-8 h-6"></div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* EDITOR COLUMN */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Type className="w-5 h-5 text-primary-600" />
                Compose
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Font Selection */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['default', 'handwriting', 'serif', 'cursive'].map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setFontStyle(style as any)}
                          className={`px-3 py-2 border rounded-lg text-sm transition-all ${
                            fontStyle === style
                              ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium ring-2 ring-primary-100'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={`w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none text-lg leading-relaxed ${getFontClass(fontStyle)}`}
                    placeholder="Write your heartfelt message here..."
                    required
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {content.length} characters
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={createNoteMutation.isPending}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {createNoteMutation.isPending ? (
                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                     <Send className="w-5 h-5" />
                  )}
                  Submit Farewell Note
                </button>
              </form>
            </div>
          </div>

          {/* PREVIEW COLUMN */}
          <div className="hidden lg:block space-y-6">
             <div className="sticky top-8">
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary-600" />
                      Live Preview
                   </h2>
                   <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      What the owner sees
                   </span>
                </div>

                {/* Preview Card */}
                <div className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 min-h-[400px] flex flex-col relative overflow-hidden transition-all duration-300`}>
                   {/* Decorative Quote Mark */}
                   <div className="absolute top-4 left-4 text-primary-100 opacity-50 pointer-events-none">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                      </svg>
                   </div>

                   {/* Content */}
                   <div className={`relative z-10 flex-grow whitespace-pre-wrap text-gray-800 leading-relaxed text-lg ${getFontClass(fontStyle)}`}>
                      {content || <span className="text-gray-300 italic">Your message will appear here...</span>}
                   </div>

                   {/* Footer */}
                   <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-primary-100 text-primary-600">
                            {(user?.name || 'You').charAt(0).toUpperCase()}
                         </div>
                         <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">
                               {user?.name || 'Your Name'}
                            </span>
                            <span className="text-xs text-gray-500">
                               {new Date().toLocaleDateString()}
                            </span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
