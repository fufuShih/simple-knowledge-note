import React from 'react';
import { Globe, MoreHorizontal } from 'lucide-react';
import { BaseNodeItem } from './BaseNodeItem';
import type { BaseNodeItemProps } from './BaseNodeItem';

interface WebNoteNodeItemProps extends Omit<BaseNodeItemProps, 'icon' | 'expandButton' | 'actionButtons' | 'contextMenuItems' | 'children'> {
}

export const WebNoteNodeItem: React.FC<WebNoteNodeItemProps> = ({
  node,
  onSelect,
  onDelete,
  onRename,
  isActive = false,
}) => {
  const expandButton = <span className="mr-1 w-4" />;

  const icon = <Globe size={16} />;

  const actionButtons = (
    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
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
    />
  );
}; 
