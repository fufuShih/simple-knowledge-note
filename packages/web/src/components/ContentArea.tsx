import { Plate, usePlateEditor } from "platejs/react";
import type { Value } from 'platejs';
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react';
import { Editor, EditorContainer } from "@/components/ui/editor";
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button';
import { useNodeContext } from './nodes/NodeContext';
import type { NoteNodeData } from './nodes/types';

import { useState, useEffect, useCallback } from 'react';

const defaultValue: Value = [
  {
    type: 'p',
    children: [
      { text: 'Select a note from the directory panel to start editing...' },
    ],
  },
];

interface ContentAreaProps {}

const ContentArea: React.FC<ContentAreaProps> = () => {
  const { activeNodeId, getNode, updateNode } = useNodeContext();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<Value>(defaultValue);
  const [isEditing, setIsEditing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const activeNode = activeNodeId ? getNode(activeNodeId) : null;
  const isNote = activeNode?.type === 'note';

  const editor = usePlateEditor({
    plugins: [BoldPlugin, ItalicPlugin, UnderlinePlugin],
    value: content,
  });

  // Load node content when active node changes
  useEffect(() => {
    if (activeNode && isNote) {
      const noteNode = activeNode as NoteNodeData;
      setTitle(noteNode.title);
      setContent(noteNode.content || defaultValue);
      setIsEditing(false);
    } else if (activeNode && activeNode.type === 'folder') {
      setTitle(activeNode.title);
      setContent([
        {
          type: 'p',
          children: [
            { text: 'This is a folder. You can create notes and subfolders inside it.' },
          ],
        },
      ]);
      setIsEditing(false);
    } else {
      setTitle('');
      setContent(defaultValue);
      setIsEditing(false);
    }
  }, [activeNode, isNote]);

  const handleSave = useCallback(async () => {
    if (!activeNode || !isNote || !isEditing) return;

    try {
      await updateNode(activeNodeId!, {
        title,
        content,
      });
      setIsEditing(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save node:', error);
    }
  }, [activeNode, isNote, isEditing, activeNodeId, title, content, updateNode]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    setIsEditing(true);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  useEffect(() => {
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDownGlobal);
    return () => document.removeEventListener('keydown', handleKeyDownGlobal);
  }, [handleSave]);

  if (!activeNode) {
    return (
      <section className="flex-1 bg-white h-full flex flex-col items-center justify-center px-2 py-4">
        <div className="text-center text-gray-500">
          <h2 className="text-2xl font-semibold mb-2">Welcome to your Knowledge Base</h2>
          <p className="text-lg">Select a note from the directory panel to start editing</p>
          <p className="text-sm mt-2">Or create a new note or folder using the + button</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 bg-white h-full flex flex-col px-2 py-4">
      {/* Header with title and save status */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-2xl font-bold bg-transparent border-none outline-none focus:ring-0 p-0"
            placeholder="Enter document title..."
            disabled={!isNote}
          />
        </div>
        <div className="flex items-center space-x-2">
          {isEditing && (
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Save
            </button>
          )}
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Saved at {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {isEditing && (
            <span className="text-sm text-orange-500">
              Unsaved changes
            </span>
          )}
        </div>
      </div>

      {isNote ? (
        /* Editor Area */
        <div className="flex-1 overflow-hidden">
          <Plate editor={editor}>
            <FixedToolbar className="justify-start rounded-t-lg">
              <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">B</MarkToolbarButton>
              <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">I</MarkToolbarButton>
              <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">U</MarkToolbarButton>
            </FixedToolbar>
            <EditorContainer>     
              <Editor placeholder="Start typing..." />
            </EditorContainer>
          </Plate>
        </div>
      ) : (
        /* Folder view */
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <h3 className="text-xl font-semibold mb-2">📁 {title}</h3>
            <p>This is a folder. Use the directory panel to create notes and subfolders.</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default ContentArea
