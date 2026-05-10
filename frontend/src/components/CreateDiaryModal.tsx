import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { diaryApi } from '../api';

export default function CreateDiaryModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: () => diaryApi.create({ title, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDiary'] });
      toast.success('Diary created successfully!');
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="sanctuary-card w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="brand-script text-4xl font-bold text-primary">Create Your Diary</h2>
          <button onClick={onClose} className="rounded p-2 hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-muted-foreground">Diary Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="e.g., My Farewell Diary"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-muted-foreground">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea h-24"
              placeholder="A brief description..."
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Create Diary
          </button>
        </form>
      </div>
    </div>
  );
}
