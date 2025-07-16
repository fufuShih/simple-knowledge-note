import React, { useState, useCallback, useEffect } from 'react';
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
import { 
  StickyNote, 
  X, 
  Save, 
  ExternalLink, 
  Globe,
  Edit3
} from 'lucide-react';
import type { WebNoteNodeData } from './types';

interface WebNoteProps {
  node: WebNoteNodeData;
  onUpdate: (updates: Partial<WebNoteNodeData>) => void;
  onSave: () => void;
  isEditing: boolean;
  lastSaved?: Date;
}

const WebNote: React.FC<WebNoteProps> = ({ 
  node, 
  onUpdate, 
  onSave, 
  isEditing, 
  lastSaved 
}) => {
  const [showNotes, setShowNotes] = useState(node.showNotes);
  const [notes, setNotes] = useState<Value>(node.notes);
  const [url, setUrl] = useState(node.url);
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  const editor = usePlateEditor({
    plugins: [BoldPlugin, ItalicPlugin, UnderlinePlugin],
    value: notes,
  });

  // Update local state when node changes
  useEffect(() => {
    setShowNotes(node.showNotes);
    setNotes(node.notes);
    setUrl(node.url);
  }, [node]);

  // Update notes when editor content changes
  useEffect(() => {
    if (editor && editor.children) {
      const currentContent = editor.children;
      if (JSON.stringify(currentContent) !== JSON.stringify(notes)) {
        setNotes(currentContent);
        onUpdate({ notes: currentContent });
      }
    }
  }, [editor, notes, onUpdate]);

  const handleToggleNotes = useCallback(() => {
    const newShowNotes = !showNotes;
    setShowNotes(newShowNotes);
    onUpdate({ showNotes: newShowNotes });
  }, [showNotes, onUpdate]);

  const handleUrlChange = useCallback((newUrl: string) => {
    setUrl(newUrl);
    onUpdate({ url: newUrl });
  }, [onUpdate]);

  const handleUrlSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingUrl(false);
    handleUrlChange(url);
  }, [url, handleUrlChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      onSave();
    }
  }, [onSave]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="flex-1 h-full relative bg-gray-50" onKeyDown={handleKeyDown}>
      {/* URL Bar */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center space-x-3">
        <Globe size={16} className="text-gray-500" />
        {isEditingUrl ? (
          <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center space-x-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter URL..."
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Go
            </button>
            <button
              type="button"
              onClick={() => setIsEditingUrl(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex-1 flex items-center space-x-2">
            <span className="text-sm text-gray-700 truncate">{url}</span>
            <button
              onClick={() => setIsEditingUrl(true)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Edit URL"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => window.open(url, '_blank')}
              className="p-1 hover:bg-gray-100 rounded"
              title="Open in new tab"
            >
              <ExternalLink size={14} />
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          {isEditing && (
            <button
              onClick={onSave}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center"
            >
              <Save size={14} className="mr-1" />
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

            {/* Main Content Area */}
      <div className="relative h-full">
        {/* Iframe Container - Always full width */}
        <div className="w-full h-full relative">
          {isValidUrl(url) ? (
            <iframe
              src={url}
              className="w-full h-full border-0"
              title={node.title}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="text-center">
                <Globe size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">Invalid URL</p>
                <p className="text-sm text-gray-400">Please enter a valid URL to display the webpage</p>
              </div>
            </div>
          )}
        </div>

        {/* Notes Panel - Floating overlay */}
        {showNotes && (
          <div className="absolute top-0 right-0 w-96 h-full bg-white border-l border-gray-200 flex flex-col shadow-lg z-40">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <StickyNote size={16} className="mr-2" />
                Notes
              </h3>
              <button
                onClick={handleToggleNotes}
                className="p-1 hover:bg-gray-100 rounded"
                title="Close notes"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Plate 
                editor={editor}
              >
                <FixedToolbar className="justify-start rounded-none border-b">
                  <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">B</MarkToolbarButton>
                  <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">I</MarkToolbarButton>
                  <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">U</MarkToolbarButton>
                </FixedToolbar>
                <EditorContainer className="h-full">
                  <Editor placeholder="Add your notes here..." />
                </EditorContainer>
              </Plate>
            </div>
          </div>
        )}
      </div>

      {/* FAB Button */}
      <button
        onClick={handleToggleNotes}
        className={`absolute bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center ${
          showNotes 
            ? 'bg-orange-500 hover:bg-orange-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white z-50`}
        title={showNotes ? 'Close notes' : 'Open notes'}
      >
        {showNotes ? <X size={24} /> : <StickyNote size={24} />}
      </button>
    </div>
  );
};

export default WebNote; 
