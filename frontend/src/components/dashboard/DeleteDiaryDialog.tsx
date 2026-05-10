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
        className="sanctuary-card w-full max-w-lg overflow-hidden rounded-xl border-destructive/25"
      >
        <div className="flex items-start justify-between gap-4 border-b border-destructive/15 bg-destructive/10 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-destructive/10 p-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 id={titleId} className="text-lg font-bold text-foreground">
                Delete diary
              </h2>
              <p id={descriptionId} className="mt-1 text-sm text-destructive">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-md p-1 text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close delete diary dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-foreground">
            Permanently deleting <strong>{diary.title}</strong> will remove the
            diary and all related farewell contributions.
          </div>

          <label className="block">
            <span className="text-sm font-bold text-muted-foreground">
              Type the diary name to confirm
            </span>
            <input
              ref={inputRef}
              value={confirmationText}
              onChange={(event) => setConfirmationText(event.target.value)}
              placeholder={diary.title}
              disabled={isDeleting}
              autoComplete="off"
              className="input mt-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border/60 bg-muted/50 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="btn btn-secondary rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isConfirmed || isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2 font-semibold text-destructive-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete this diary
          </button>
        </div>
      </form>
    </div>
  );
}
