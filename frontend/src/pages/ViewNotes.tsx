import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Share2, ExternalLink } from "lucide-react";
import { diaryApi } from "../api";
import { FarewellNote, Diary } from "../types";
import { toast } from "sonner";

export default function ViewNotes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<FarewellNote[]>([]);
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      diaryApi.getMyNotes(),
      diaryApi.getMy()
    ])
      .then(([notesRes, diaryRes]) => {
          if (notesRes.data.data) {
             setNotes(notesRes.data.data.notes);
          }
          if (diaryRes.data.data) {
             setDiary(diaryRes.data.data.diary);
          }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const copyLink = () => {
    if (!diary) return;
    const url = `${window.location.origin}/diary/${diary.uniqueLink}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const openPublic = () => {
      if (!diary) return;
      window.open(`/diary/${diary.uniqueLink}`, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-200 rounded-full transition-colors mb-4 inline-flex items-center gap-2 text-gray-600">
                <ArrowLeft className="w-5 h-5" /> Back to Dashboard
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                     <h1 className="text-3xl font-bold text-gray-900">{diary?.title || 'My Farewell Notes'}</h1>
                     {diary?.description && <p className="text-gray-600 mt-2">{diary.description}</p>}
                </div>
                <div className="flex gap-2">
                    <button onClick={copyLink} className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <Share2 className="w-4 h-4"/> Copy Link
                    </button>
                    <button onClick={openPublic} className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4"/> View Public
                    </button>
                </div>
            </div>
        </div>
        
        {notes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400"/>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No notes yet</h3>
                <p className="text-gray-500 mb-6">Share your diary link to receive farewell messages.</p>
                <button onClick={copyLink} className="btn btn-primary">
                    Copy Share Link
                </button>
            </div>
        ) : (
            <div className="grid gap-6">
            {notes.map((n) => (
                <div key={n.id} className={`p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow font-${n.fontStyle || 'default'}`}>
                    <p className="text-xl mb-6 whitespace-pre-wrap text-gray-800 leading-relaxed">{n.content}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50 text-sm text-gray-500 font-sans">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                              {n.isAnonymous ? '?' : n.authorName.charAt(0).toUpperCase()}
                           </div>
                           <span className="font-medium">
                              {n.isAnonymous ? 'Anonymous' : n.authorName}
                           </span>
                        </div>
                        <time dateTime={n.createdAt}>
                          {new Date(n.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
