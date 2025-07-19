export interface BaseNodeData {
  id: string;
  title: string;
  type: 'folder' | 'note' | 'webNote';
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface FolderNodeData extends BaseNodeData {
  type: 'folder';
  children: string[]; // 子節點ID列表
  expanded: boolean;
}

export interface NoteNodeData extends BaseNodeData {
  type: 'note';
  content: any; // Plate editor content
  tags: string[];
  summary?: string;
}

export interface WebNoteNodeData extends BaseNodeData {
  type: 'webNote';
  url: string;
  notes: any; // Plate editor content for notes
  showNotes: boolean;
  tags: string[];
  summary?: string;
}

export type NodeData = FolderNodeData | NoteNodeData | WebNoteNodeData;

export interface NodeTreeItem {
  id: string;
  title: string;
  type: 'folder' | 'note' | 'webNote';
  children?: NodeTreeItem[];
  expanded?: boolean;
  parentId?: string;
  level: number;
}

export interface NodeOperations {
  createNode: (type: 'folder' | 'note' | 'webNote', title: string, parentId?: string, additionalData?: any) => Promise<string>;
  updateNode: (id: string, updates: Partial<NodeData>) => Promise<void>;
  deleteNode: (id: string) => Promise<void>;
  moveNode: (nodeId: string, newParentId?: string) => Promise<void>;
  getNode: (id: string) => NodeData | undefined;
  getChildren: (parentId?: string) => NodeData[];
  getTree: () => NodeTreeItem[];
}

export interface NodeComponentProps {
  node: NodeTreeItem;
  onSelect: (node: NodeTreeItem) => void;
  onCreateChild?: (parentId: string, type: 'folder' | 'note' | 'webNote') => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onMove?: (nodeId: string, newParentId?: string) => void;
} 
