'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface Entry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  journalId: string;
}

interface Journal {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  entryCount: number;
}

// 🔧 Helper: extract readable preview text from Yoopta JSON
function getEntryPreview(content: string, maxLength: number = 100): string {
  if (!content) return 'No content yet...';

  try {
    const parsed = JSON.parse(content);

    // Flatten all blocks into text
    const text = Object.values(parsed)
      .map((block: any) => {
        if (Array.isArray(block)) {
          return block
            .map((b) =>
              b.children?.map((c: any) => c.text || '').join(' ')
            )
            .join(' ');
        }
        return '';
      })
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
  } catch {
    return 'No content yet...';
  }
}

export default function JournalWorkspace() {
  const [journal, setJournal] = useState<Journal | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const router = useRouter();
  const params = useParams();
  const journalId = params.journalId as string;

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Load journal
    const journals = JSON.parse(localStorage.getItem('journals') || '[]');
    const currentJournal = journals.find((j: Journal) => j.id === journalId);

    if (!currentJournal) {
      router.push('/shelf');
      return;
    }

    setJournal(currentJournal);

    // Load entries for this journal
    const allEntries = JSON.parse(localStorage.getItem('entries') || '[]');
    const journalEntries = allEntries.filter(
      (entry: Entry) => entry.journalId === journalId
    );
    setEntries(journalEntries);
  }, [journalId, router]);

  const createEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Entry = {
      id: Date.now().toString(),
      title: newEntryTitle,
      content: '',
      createdAt: new Date().toISOString(),
      journalId: journalId,
    };

    const allEntries = JSON.parse(localStorage.getItem('entries') || '[]');
    const updatedEntries = [...allEntries, newEntry];
    localStorage.setItem('entries', JSON.stringify(updatedEntries));

    // Update journal entry count
    const journals = JSON.parse(localStorage.getItem('journals') || '[]');
    const updatedJournals = journals.map((j: Journal) =>
      j.id === journalId ? { ...j, entryCount: j.entryCount + 1 } : j
    );
    localStorage.setItem('journals', JSON.stringify(updatedJournals));

    setNewEntryTitle('');
    setShowCreateForm(false);

    // Navigate to the new entry
    router.push(`/workspace/${journalId}/${newEntry.id}`);
  };

  if (!journal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/shelf"
            className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
          >
            ← Back to Shelf
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{journal.title}</h1>
          {journal.description && (
            <p className="text-gray-600 mt-2">{journal.description}</p>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            + New Entry
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Entry</h2>
            <form onSubmit={createEntry}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Entry title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newEntryTitle}
                  onChange={(e) => setNewEntryTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Create & Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/workspace/${journalId}/${entry.id}`}
              className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {entry.title}
              </h3>
              <p className="text-gray-600 mb-2 line-clamp-3">
                {getEntryPreview(entry.content)}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(entry.createdAt).toLocaleDateString()} at{' '}
                {new Date(entry.createdAt).toLocaleTimeString()}
              </p>
            </Link>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No entries yet. Create your first entry to start journaling!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
