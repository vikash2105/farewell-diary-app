import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingActionButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/diaries/new')}
      className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
    >
      <Plus size={24} />
    </button>
  );
}
