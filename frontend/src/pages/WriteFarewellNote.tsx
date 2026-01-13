import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { notesApi, authApi } from '../api/client';
import { useAuthStore } from '../stores/authStore';

export default function WriteFarewellNote() {
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [content, setContent] = useState('');
  const [fontStyle, setFontStyle] = useState<'default' | 'handwriting' | 'serif' | 'cursive'>('default');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const createNoteMutation = useMutation({
    mutationFn: () => notesApi.create(link!, { content, fontStyle, isAnonymous }),
    onSuccess: () => {
      toast.success('Your farewell note has been saved!');
      navigate(`/diary/${link}`);
    },
    onError: () => {
      toast.error('Failed to save note');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      authApi.loginWithGoogle();
      return;
    }
    if (content.trim().length < 10) {
      toast.error('Please write at least 10 characters');
      return;
    }
    createNoteMutation.mutate();
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="card p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Write Your Farewell Note</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Your Message</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`textarea h-64 font-${fontStyle}`}
                placeholder="Write your heartfelt message here..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Font Style</label>
                <select
                  value={fontStyle}
                  onChange={(e) => setFontStyle(e.target.value as any)}
                  className="input"
                >
                  <option value="default">Default</option>
                  <option value="handwriting">Handwriting</option>
                  <option value="serif">Serif</option>
                  <option value="cursive">Cursive</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Post anonymously</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              Submit Farewell Note
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
