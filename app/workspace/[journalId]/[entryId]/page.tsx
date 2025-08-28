'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Paper from '../../../components/Paper';
import Toolbar from '../../../components/Toolbar';

export default function EntryPage() {
  const [content, setContent] = useState<any>(null); // keep as object
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const router = useRouter();
  const params = useParams();
  const journalId = params.journalId as string;
  const entryId = params.entryId as string;

  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  // Load entry
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const allEntries = JSON.parse(localStorage.getItem('entries') || '[]');
    const currentEntry = allEntries.find(
      (e: any) => e.id === entryId && e.journalId === journalId
    );

    if (!currentEntry) {
      router.push(`/workspace/${journalId}`);
      return;
    }

    // Parse string → object if needed
    let parsedContent = {};
    try {
      parsedContent =
        typeof currentEntry.content === 'string'
          ? JSON.parse(currentEntry.content)
          : currentEntry.content || {};
    } catch {
      parsedContent = {};
    }

    setContent(parsedContent);
    setLoaded(true);
  }, [journalId, entryId, router]);

  // Autosave effect
  useEffect(() => {
    if (!loaded) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);

    setSaveStatus('saving');

    saveTimer.current = setTimeout(() => {
      const allEntries = JSON.parse(localStorage.getItem('entries') || '[]');

      const updatedEntries = allEntries.map((e: any) =>
        e.id === entryId && e.journalId === journalId
          ? { ...e, content: JSON.stringify(content), updatedAt: Date.now() }
          : e
      );

      localStorage.setItem('entries', JSON.stringify(updatedEntries));

      setSaveStatus('saved');

      // Reset to idle after 2s
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [content, loaded, entryId, journalId]);

  return (
    <main className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="mt-40 flex justify-center w-full">
        {loaded && (
          <Paper
            initialContent={content}
            onChange={setContent}
            placeholder="Start writing your thoughts..."
          />
        )}
      </div>

      <Toolbar editor={null} saveStatus={saveStatus} />
    </main>
  );
}
