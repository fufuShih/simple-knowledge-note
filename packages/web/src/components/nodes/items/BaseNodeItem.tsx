import React, { useState, useRef, useCallback } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import type { NodeComponentProps } from '../types';

export interface BaseNodeItemProps extends Omit<NodeComponentProps, 'onCreateChild' | 'onMove'> {
  isActive?: boolean;
  icon: React.ReactNode;
  expandButton?: React.ReactNode;
  actionButtons?: React.ReactNode;
  contextMenuItems?: React.ReactNode;
  children?: React.ReactNode;
  onCreateChild?: NodeComponentProps['onCreateChild'];
  onMove?: NodeComponentProps['onMove'];
}

export const BaseNodeItem: React.FC<BaseNodeItemProps> = ({
  node,
  onSelect,
  onDelete,
  onRename,
  isActive = false,
  icon,
  expandButton,
  actionButtons,
  contextMenuItems,
  children,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(node.title);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleDeleteNode = useCallback(() => {
    onDelete(node.id);
    setShowContextMenu(false);
  }, [node.id, onDelete]);

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
        {expandButton}

        {/* Icon */}
        <span className="mr-2 flex-shrink-0 text-gray-400">
          {icon}
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
        {!isEditing && actionButtons}
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
          {contextMenuItems}
          {contextMenuItems && <hr className="my-1 border-gray-600" />}
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
      {children}
    </>
  );
}; 
