import React, { useState, useRef, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  MoreHorizontal 
} from 'lucide-react';
import type { NodeComponentProps } from './types';
import { useNodeContext } from './NodeContext';

interface NodeItemProps extends NodeComponentProps {
  isActive?: boolean;
}

export const NodeItem: React.FC<NodeItemProps> = ({
  node,
  onSelect,
  onCreateChild,
  onDelete,
  onRename,
  onMove,
  isActive = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(node.title);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggleFolderExpanded } = useNodeContext();

  const handleToggleExpanded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      toggleFolderExpanded(node.id);
    }
  }, [node.id, node.type, toggleFolderExpanded]);

  const handleSelect = useCallback(() => {
    if (!isEditing) {
      onSelect(node);
    }
  }, [isEditing, onSelect, node]);

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
    setEditTitle(node.title);
    setShowContextMenu(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [node.title]);

  const handleSaveEdit = useCallback(() => {
    if (editTitle.trim() && editTitle !== node.title) {
      onRename(node.id, editTitle.trim());
    }
    setIsEditing(false);
  }, [editTitle, node.id, node.title, onRename]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditTitle(node.title);
  }, [node.title]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  }, [handleSaveEdit, handleCancelEdit]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  }, []);

  const handleCreateFolder = useCallback(() => {
    onCreateChild(node.id, 'folder');
    setShowContextMenu(false);
  }, [node.id, onCreateChild]);

  const handleCreateNote = useCallback(() => {
    onCreateChild(node.id, 'note');
    setShowContextMenu(false);
  }, [node.id, onCreateChild]);

  const handleDeleteNode = useCallback(() => {
    onDelete(node.id);
    setShowContextMenu(false);
  }, [node.id, onDelete]);

  const getNodeIcon = () => {
    if (node.type === 'folder') {
      return node.expanded ? <FolderOpen size={16} /> : <Folder size={16} />;
    }
    return <FileText size={16} />;
  };

  const paddingLeft = node.level * 20 + 8;

  return (
    <>
      <div
        className={`flex items-center py-1 px-2 cursor-pointer text-sm select-none relative group ${
          isActive 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-300 hover:bg-gray-700'
        }`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleSelect}
        onContextMenu={handleContextMenu}
      >
        {/* Expand/Collapse Button */}
        {node.type === 'folder' && (
          <button
            onClick={handleToggleExpanded}
            className="mr-1 p-0.5 hover:bg-gray-600 rounded flex-shrink-0"
          >
            {node.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        )}
        {node.type === 'note' && <span className="mr-1 w-4" />}

        {/* Icon */}
        <span className="mr-2 flex-shrink-0 text-gray-400">
          {getNodeIcon()}
        </span>

        {/* Title */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="bg-gray-700 text-white px-1 py-0.5 rounded text-sm outline-none border border-gray-500 flex-1"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="truncate flex-1">{node.title}</span>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            {node.type === 'folder' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateNote();
                }}
                className="p-1 hover:bg-gray-600 rounded"
                title="Add note"
              >
                <Plus size={12} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setContextMenuPosition({ x: e.clientX, y: e.clientY });
                setShowContextMenu(true);
              }}
              className="p-1 hover:bg-gray-600 rounded"
            >
              <MoreHorizontal size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed bg-gray-800 border border-gray-600 rounded shadow-lg py-1 z-50 min-w-[150px]"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
          }}
          onMouseLeave={() => setShowContextMenu(false)}
        >
          {node.type === 'folder' && (
            <>
              <button
                onClick={handleCreateFolder}
                className="w-full px-3 py-1 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center"
              >
                <Folder size={14} className="mr-2" />
                New Folder
              </button>
              <button
                onClick={handleCreateNote}
                className="w-full px-3 py-1 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center"
              >
                <FileText size={14} className="mr-2" />
                New Note
              </button>
              <hr className="my-1 border-gray-600" />
            </>
          )}
          <button
            onClick={handleStartEdit}
            className="w-full px-3 py-1 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center"
          >
            <Edit3 size={14} className="mr-2" />
            Rename
          </button>
          <button
            onClick={handleDeleteNode}
            className="w-full px-3 py-1 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center"
          >
            <Trash2 size={14} className="mr-2" />
            Delete
          </button>
        </div>
      )}

      {/* Render Children */}
      {node.type === 'folder' && node.expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <NodeItem
              key={child.id}
              node={child}
              onSelect={onSelect}
              onCreateChild={onCreateChild}
              onDelete={onDelete}
              onRename={onRename}
              onMove={onMove}
              isActive={isActive}
            />
          ))}
        </div>
      )}
    </>
  );
}; 
