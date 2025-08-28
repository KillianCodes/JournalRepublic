'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Paper from '../../../components/Paper';
import Toolbar from '../../../components/Toolbar';

export default function EntryEditor() {
  const [content, setContent] = useState('');
  const router = useRouter();
  const params = useParams();
  const journalId = params.journalId as string;
  const entryId = params.entryId as string;

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

    setContent(currentEntry.content || '');
  }, [journalId, entryId, router]);

  return (
    <main
      style={{
        minHeight: '1000vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // centers horizontally
      }}
    >
      {/* Paper with margin from the top */}
      <div style={{ marginTop: '160px' }}>
        <Paper
          initialContent={content}
          onChange={setContent}
          placeholder="Start writing your thoughts..."
        />
      </div>

      {/* Toolbar is fully styled inside its own component */}
      <Toolbar editor={null} />
    </main>
  );
}
