'use client';

import React, { useMemo, useRef, useState } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Divider from '@yoopta/divider';

import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

type PaperProps = {
  initialContent: any;
  onChange: (val: any) => void;
  placeholder?: string;
};

const plugins = [
  Paragraph,
  Table,
  Divider,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
  Image,
  Video,
  File,
];

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

export default function Paper({ initialContent, onChange, placeholder }: PaperProps) {
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState<any>(initialContent);

  const tools = {
    ActionMenu: { render: DefaultActionMenuRender, tool: ActionMenuList },
    Toolbar: { render: Toolbar, tool: Toolbar },
    LinkTool: { render: DefaultLinkToolRender, tool: LinkTool },
  };

  return (
    <div
      ref={selectionRef}
      className="w-[70%] mx-auto rounded-2xl border border-gray-200 bg-white shadow-sm p-6 min-h-[600px]"
    >
      <YooptaEditor
        editor={editor}
        plugins={plugins as any}
        marks={MARKS as any}
        tools={tools as any}
        selectionBoxRoot={selectionRef}
        value={value}
        placeholder={placeholder ?? 'Start writing...'}
        onChange={(v: any) => {
          setValue(v);
          onChange(v); // ✅ pass raw object to parent
        }}
      />
    </div>
  );
}
