import React, { useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  FileText, 
  Globe,
  Plus, 
  MoreHorizontal 
} from 'lucide-react';
import { BaseNodeItem } from './BaseNodeItem';
import type { BaseNodeItemProps } from './BaseNodeItem';
import { NodeItem } from './NodeItem';
import { useNodeContext } from './NodeContext';

interface FolderNodeItemProps extends Omit<BaseNodeItemProps, 'icon' | 'expandButton' | 'actionButtons' | 'contextMenuItems' | 'children'> {
}

export const FolderNodeItem: React.FC<FolderNodeItemProps> = ({
  node,
  onSelect,
  onCreateChild,
  onDelete,
  onRename,
  onMove,
  isActive = false,
}) => {
  const { toggleFolderExpanded } = useNodeContext();

  const handleToggleExpanded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFolderExpanded(node.id);
  }, [node.id, toggleFolderExpanded]);

  const handleCreateFolder = useCallback(() => {
    onCreateChild?.(node.id, 'folder');
  }, [node.id, onCreateChild]);

  const handleCreateNote = useCallback(() => {
    onCreateChild?.(node.id, 'note');
  }, [node.id, onCreateChild]);

  const handleCreateWebNote = useCallback(() => {
    onCreateChild?.(node.id, 'webNote');
  }, [node.id, onCreateChild]);

  const expandButton = (
    <button
      onClick={handleToggleExpanded}
      className="mr-1 p-0.5 hover:bg-gray-600 rounded flex-shrink-0"
    >
      {node.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
    </button>
  );

  const icon = node.expanded ? <FolderOpen size={16} /> : <Folder size={16} />;

  const actionButtons = (
    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
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
      <button
        onClick={(e) => {
          e.stopPropagation();
          // Context menu will be handled by BaseNodeItem
        }}
        className="p-1 hover:bg-gray-600 rounded"
      >
        <MoreHorizontal size={12} />
      </button>
    </div>
  );

  const contextMenuItems = (
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
      <button
        onClick={handleCreateWebNote}
        className="w-full px-3 py-1 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center"
      >
        <Globe size={14} className="mr-2" />
        New Web Note
      </button>
    </>
  );

  const children = node.expanded && node.children && (
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
  );

  return (
    <BaseNodeItem
      node={node}
      onSelect={onSelect}
      onDelete={onDelete}
      onRename={onRename}
      isActive={isActive}
      icon={icon}
      expandButton={expandButton}
      actionButtons={actionButtons}
      contextMenuItems={contextMenuItems}
    >
      {children}
    </BaseNodeItem>
  );
}; 
