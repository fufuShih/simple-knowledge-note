import React from 'react';
import type { NodeComponentProps } from './types';
import { FolderNodeItem } from './FolderNodeItem';
import { NoteNodeItem } from './NoteNodeItem';
import { WebNoteNodeItem } from './WebNoteNodeItem';

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
  const commonProps = {
    node,
    onSelect,
    onCreateChild,
    onDelete,
    onRename,
    onMove,
    isActive,
  };

  switch (node.type) {
    case 'folder':
      return <FolderNodeItem {...commonProps} />;
    case 'webNote':
      return <WebNoteNodeItem {...commonProps} />;
    case 'note':
    default:
      return <NoteNodeItem {...commonProps} />;
  }
}; 
