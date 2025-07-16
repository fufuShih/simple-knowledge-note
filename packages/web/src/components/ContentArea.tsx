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
import { useNodeContext, useNodeOperations } from './nodes';
import type { NoteNodeData, FolderNodeData, WebNoteNodeData, NodeData } from './nodes';
import WebNote from './nodes/WebNote';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Calendar, 
  Clock, 
  Hash,
  Plus,
  Grid3X3,
  List,
  Globe
} from 'lucide-react';

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
  const { activeNodeId, getNode, getChildren, updateNode } = useNodeContext();
  const { handleCreateFolder, handleCreateNote, handleCreateWebNote, handleSelectNode } = useNodeOperations();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<Value>(defaultValue);
  const [isEditing, setIsEditing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const activeNode = activeNodeId ? getNode(activeNodeId) : null;
  const isNote = activeNode?.type === 'note';
  const isFolder = activeNode?.type === 'folder';
  const isWebNote = activeNode?.type === 'webNote';

  const editor = usePlateEditor({
    plugins: [BoldPlugin, ItalicPlugin, UnderlinePlugin],
    value: content,
  });

  // Get children for folder view
  const children = isFolder ? getChildren(activeNodeId) : [];

  // Load node content when active node changes
  useEffect(() => {
    if (activeNode && isNote) {
      const noteNode = activeNode as NoteNodeData;
      setTitle(noteNode.title);
      setContent(noteNode.content || defaultValue);
      setIsEditing(false);
    } else if (activeNode && isWebNote) {
      const webNoteNode = activeNode as WebNoteNodeData;
      setTitle(webNoteNode.title);
      setContent(webNoteNode.notes || defaultValue);
      setIsEditing(false);
    } else if (activeNode && activeNode.type === 'folder') {
      setTitle(activeNode.title);
      setContent(defaultValue);
      setIsEditing(false);
    } else {
      setTitle('');
      setContent(defaultValue);
      setIsEditing(false);
    }
  }, [activeNode, isNote, isWebNote]);

  const handleSave = useCallback(async () => {
    if (!activeNode || (!isNote && !isWebNote) || !isEditing) return;

    try {
      if (isNote) {
        await updateNode(activeNodeId!, {
          title,
          content,
        });
      } else if (isWebNote) {
        await updateNode(activeNodeId!, {
          title,
          notes: content,
        });
      }
      setIsEditing(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save node:', error);
    }
  }, [activeNode, isNote, isWebNote, isEditing, activeNodeId, title, content, updateNode]);

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

  const handleCreateChild = useCallback(async (type: 'folder' | 'note' | 'webNote') => {
    if (!activeNode || !isFolder) return;
    
    if (type === 'folder') {
      await handleCreateFolder(activeNodeId);
    } else if (type === 'note') {
      await handleCreateNote(activeNodeId);
    } else if (type === 'webNote') {
      await handleCreateWebNote(activeNodeId);
    }
  }, [activeNode, isFolder, activeNodeId, handleCreateFolder, handleCreateNote, handleCreateWebNote]);

  const handleChildClick = useCallback((child: NodeData) => {
    handleSelectNode(child.id);
  }, [handleSelectNode]);

  const formatDateLocal = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getNodeIcon = (node: NodeData) => {
    if (node.type === 'folder') {
      return <Folder className="w-8 h-8 text-blue-500" />;
    } else if (node.type === 'webNote') {
      return <Globe className="w-8 h-8 text-purple-500" />;
    } else {
      return <FileText className="w-8 h-8 text-green-500" />;
    }
  };

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
    <section className="flex-1 bg-white h-full flex flex-col">
      {/* Header with title and controls */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-2xl font-bold bg-transparent border-none outline-none focus:ring-0 p-0"
            placeholder="Enter document title..."
            disabled={!isNote && !isWebNote}
          />
        </div>
        <div className="flex items-center space-x-2">
          {isFolder && (
            <>
              <div className="flex items-center space-x-1 mr-4">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                  title="Grid view"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                  title="List view"
                >
                  <List size={16} />
                </button>
              </div>
              <button
                onClick={() => handleCreateChild('folder')}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center"
              >
                <Plus size={14} className="mr-1" />
                Folder
              </button>
              <button
                onClick={() => handleCreateChild('note')}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center"
              >
                <Plus size={14} className="mr-1" />
                Note
              </button>
              <button
                onClick={() => handleCreateChild('webNote')}
                className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 flex items-center"
              >
                <Plus size={14} className="mr-1" />
                Web Note
              </button>
            </>
          )}
          {(isNote || isWebNote) && (
            <>
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
            </>
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
      ) : isWebNote ? (
        /* WebNote Area */
        <WebNote
          node={activeNode as WebNoteNodeData}
          onUpdate={(updates) => {
            if (updates.notes) {
              setContent(updates.notes);
            }
            if (updates.title) {
              setTitle(updates.title);
            }
            setIsEditing(true);
          }}
          onSave={handleSave}
          isEditing={isEditing}
          lastSaved={lastSaved || undefined}
        />
      ) : (
        /* Folder view */
        <div className="flex-1 overflow-y-auto p-4">
          {children.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FolderOpen className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Empty Folder</h3>
              <p className="text-center mb-4">This folder doesn't contain any items yet.</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCreateChild('folder')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add Folder
                </button>
                <button
                  onClick={() => handleCreateChild('note')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add Note
                </button>
                <button
                  onClick={() => handleCreateChild('webNote')}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add Web Note
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Folder info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <FolderOpen className="w-6 h-6 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span className="flex items-center">
                    <Hash className="w-4 h-4 mr-1" />
                    {children.length} items
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created: {formatDateLocal(activeNode.createdAt)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Modified: {formatDateLocal(activeNode.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Children grid/list */}
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                  : 'space-y-2'
              }>
                {children.map((child) => (
                  <div
                    key={child.id}
                    onClick={() => handleChildClick(child)}
                    className={`
                      cursor-pointer border rounded-lg p-4 transition-all duration-200 hover:shadow-md hover:border-blue-300
                      ${viewMode === 'grid' ? 'text-center' : 'flex items-center space-x-3'}
                    `}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="mb-3 flex justify-center">
                          {getNodeIcon(child)}
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2 truncate">{child.title}</h4>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex items-center justify-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDateLocal(child.updatedAt)}
                          </div>
                          {child.type === 'folder' && (
                            <div className="flex items-center justify-center">
                              <Hash className="w-3 h-3 mr-1" />
                              {(child as FolderNodeData).children.length} items
                            </div>
                          )}
                          {child.type === 'note' && (
                            <div className="flex items-center justify-center">
                              <FileText className="w-3 h-3 mr-1" />
                              Note
                            </div>
                          )}
                          {child.type === 'webNote' && (
                            <div className="flex items-center justify-center">
                              <Globe className="w-3 h-3 mr-1" />
                              Web Note
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-shrink-0">
                          {getNodeIcon(child)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{child.title}</h4>
                          <div className="text-sm text-gray-500 flex items-center space-x-4">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDateLocal(child.updatedAt)}
                            </span>
                            {child.type === 'folder' && (
                              <span className="flex items-center">
                                <Hash className="w-3 h-3 mr-1" />
                                {(child as FolderNodeData).children.length} items
                              </span>
                            )}
                            {child.type === 'note' && (
                              <span className="flex items-center">
                                <FileText className="w-3 h-3 mr-1" />
                                Note
                              </span>
                            )}
                            {child.type === 'webNote' && (
                              <span className="flex items-center">
                                <Globe className="w-3 h-3 mr-1" />
                                Web Note
                              </span>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  )
}

export default ContentArea
