'use client';

import * as React from 'react';

type ToolbarProps = {
  editor: any;
  className?: string;
  saveStatus?: 'idle' | 'saving' | 'saved';
};

export default function Toolbar({ editor, className, saveStatus = 'idle' }: ToolbarProps) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
                  w-full max-w-4xl bg-white border border-gray-200 
                  shadow-lg rounded-2xl flex items-center justify-between p-4
                  ${className ?? ''}`}
      role="toolbar"
      aria-label="Main Toolbar"
    >
      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg 
                   hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        ← Back
      </button>

      {/* Save status indicator */}
      <div className="text-sm text-gray-500">
        {saveStatus === 'saving' && <span className="animate-pulse">Saving...</span>}
        {saveStatus === 'saved' && <span>✓ Saved</span>}
      </div>
    </div>
  );
}
