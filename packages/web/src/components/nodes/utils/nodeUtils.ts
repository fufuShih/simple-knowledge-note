import type { NodeData, FolderNodeData, NoteNodeData } from '../types';

export const getNodeIcon = (nodeType: 'folder' | 'note', expanded?: boolean) => {
  if (nodeType === 'folder') {
    return expanded ? 'FolderOpen' : 'Folder';
  }
  return 'FileText';
};

export const getNodeStats = (node: NodeData): { type: string; childCount?: number; wordCount?: number } => {
  if (node.type === 'folder') {
    const folderNode = node as FolderNodeData;
    return {
      type: 'Folder',
      childCount: folderNode.children.length
    };
  } else {
    const noteNode = node as NoteNodeData;
    const wordCount = countWordsInContent(noteNode.content);
    return {
      type: 'Note',
      wordCount
    };
  }
};

export const countWordsInContent = (content: any[]): number => {
  if (!content || !Array.isArray(content)) return 0;
  
  let wordCount = 0;
  
  const extractText = (item: any): string => {
    if (typeof item === 'string') return item;
    if (item.text) return item.text;
    if (item.children && Array.isArray(item.children)) {
      return item.children.map(extractText).join(' ');
    }
    return '';
  };
  
  content.forEach(block => {
    const text = extractText(block);
    if (text.trim()) {
      wordCount += text.trim().split(/\s+/).length;
    }
  });
  
  return wordCount;
};

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

export const estimateReadingTime = (wordCount: number): string => {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `~${minutes} min`;
};

export const generateNodeId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateNodeTitle = (title: string): { isValid: boolean; error?: string } => {
  const trimmed = title.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Title cannot be empty' };
  }
  
  if (trimmed.length > 100) {
    return { isValid: false, error: 'Title cannot exceed 100 characters' };
  }
  
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(trimmed)) {
    return { isValid: false, error: 'Title contains invalid characters' };
  }
  
  return { isValid: true };
};
