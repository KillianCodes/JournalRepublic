'use client';

import * as React from 'react';

type YooptaEditorLike = any;

interface ToolbarProps {
  editor: YooptaEditorLike | null | undefined;
  className?: string;
}

export default function Toolbar({ editor }: ToolbarProps) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        position: 'fixed', // ✅ escape parent flexbox restrictions
        width: '1272px',
        height: '112px',
        left: '158px',
        top: '632px',
        background: '#FFFFFF',
        border: '4px dashed #2B55C0',
        boxShadow:
          '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)',
        borderRadius: '37px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000, // ✅ keep it on top
      }}
      role="toolbar"
      aria-label="Main Toolbar"
    >
      {/* Back button only */}
      <button
        onClick={() => window.history.back()}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#2B55C0',
          background: 'transparent',
          border: '2px solid #2B55C0',
          borderRadius: '12px',
          cursor: 'pointer',
        }}
      >
        ← Back
      </button>
    </div>
  );
}
