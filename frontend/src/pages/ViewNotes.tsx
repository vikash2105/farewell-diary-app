import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/client";

export default function ViewNotes() {
  const { link } = useParams<{ link: string }>();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    apiClient.get(`/diary/${link}/notes`)
      .then(res => setNotes(res.data.data.notes))
      .catch(console.error);
  }, [link]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Farewell Notes</h1>
      {notes.map((n: any) => (
        <p key={n.id} className="mb-2">{n.message}</p>
      ))}
    </div>
  );
}
