import { formatDistanceToNow } from 'date-fns';
import type { FarewellNote } from '../types';

export default function NoteCard({ note }: { note: FarewellNote }) {
  return (
    <div className={`note-card font-${note.fontStyle}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-semibold text-lg">{note.authorName}</p>
          <p className="text-sm text-secondary-500">
            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      <p className="note-content whitespace-pre-wrap">{note.content}</p>
    </div>
  );
}
