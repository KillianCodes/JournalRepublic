'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import JournalCard from '../components/JournalCard';

interface Journal {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  entryCount: number;
}

export default function Shelf() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newJournalTitle, setNewJournalTitle] = useState('');
  const [newJournalDescription, setNewJournalDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const storedJournals = JSON.parse(localStorage.getItem('journals') || '[]');
    setJournals(storedJournals);
  }, [router]);

  const createJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const newJournal: Journal = {
      id: Date.now().toString(),
      title: newJournalTitle,
      description: newJournalDescription,
      createdAt: new Date().toISOString(),
      entryCount: 0
    };

    const updatedJournals = [...journals, newJournal];
    setJournals(updatedJournals);
    localStorage.setItem('journals', JSON.stringify(updatedJournals));
    
    setNewJournalTitle('');
    setNewJournalDescription('');
    setShowCreateForm(false);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📚 Your Journal Shelf</h1>
          <button onClick={logout} className="text-gray-500 hover:text-gray-700">Logout</button>
        </div>

        {/* New Journal Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            + New Journal
          </button>
        </div>

        {/* Create Journal Form */}
        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Journal</h2>
            <form onSubmit={createJournal}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Journal title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newJournalTitle}
                  onChange={(e) => setNewJournalTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Journal description (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  value={newJournalDescription}
                  onChange={(e) => setNewJournalDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Create
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

        {/* Journal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journals.map((journal) => (
            <JournalCard
              key={journal.id}
              title={journal.title}
              lastEdited={new Date(journal.createdAt).toLocaleDateString()}
              onClick={() => router.push(`/workspace/${journal.id}`)}
            />
          ))}
        </div>

        {/* Empty State */}
        {journals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No journals yet. Create your first journal to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
