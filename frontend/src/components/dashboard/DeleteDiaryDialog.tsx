import { useEffect, useId, useRef, useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { DashboardDiary } from '../../types';

interface DeleteDiaryDialogProps {
  diary: DashboardDiary;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteDiaryDialog({
  diary,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteDiaryDialogProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const titleId = useId();
  const descriptionId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const isConfirmed = confirmationText === diary.title;

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDeleting, onClose]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isConfirmed || isDeleting) {
      return;
    }

    await onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onSubmit={handleSubmit}
        className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl border border-red-200"
      >
        <div className="flex items-start justify-between gap-4 border-b border-red-100 bg-red-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-red-100 p-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 id={titleId} className="text-lg font-semibold text-red-950">
                Delete diary
              </h2>
              <p id={descriptionId} className="mt-1 text-sm text-red-800">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-md p-1 text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close delete diary dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            Permanently deleting <strong>{diary.title}</strong> will remove the
            diary and all related farewell contributions.
          </div>

          <label className="block">
            <span className="text-sm font-medium text-secondary-900">
              Type the diary name to confirm
            </span>
            <input
              ref={inputRef}
              value={confirmationText}
              onChange={(event) => setConfirmationText(event.target.value)}
              placeholder={diary.title}
              disabled={isDeleting}
              autoComplete="off"
              className="mt-2 w-full rounded-lg border border-secondary-300 px-4 py-3 text-secondary-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-secondary-100"
            />
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-secondary-100 bg-secondary-50 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-secondary-300 bg-white px-4 py-2 font-medium text-secondary-700 transition hover:bg-secondary-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isConfirmed || isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete this diary
          </button>
        </div>
      </form>
    </div>
  );
}
