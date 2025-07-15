import type { NodeData, FolderNodeData, NoteNodeData, NodeTreeItem, NodeOperations } from './types';

export class NodeManager implements NodeOperations {
  private nodes: Map<string, NodeData> = new Map();
  private subscribers: Set<() => void> = new Set();

  constructor() {
    this.initializeDefaultNodes();
  }

  private initializeDefaultNodes() {
    // Create default root folder and example data
    const rootFolder: FolderNodeData = {
      id: 'root',
      title: 'Root',
      type: 'folder',
      children: ['quick-notes', 'projects', 'learning'],
      expanded: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const quickNotesFolder: FolderNodeData = {
      id: 'quick-notes',
      title: 'Quick Notes',
      type: 'folder',
      parentId: 'root',
      children: ['welcome-note'],
      expanded: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const projectsFolder: FolderNodeData = {
      id: 'projects',
      title: 'Projects',
      type: 'folder',
      parentId: 'root',
      children: ['simple-knowledge-project'],
      expanded: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const learningFolder: FolderNodeData = {
      id: 'learning',
      title: 'Learning',
      type: 'folder',
      parentId: 'root',
      children: [],
      expanded: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const welcomeNote: NoteNodeData = {
      id: 'welcome-note',
      title: 'Welcome to Knowledge Base',
      type: 'note',
      parentId: 'quick-notes',
      content: [
        {
          type: 'h1',
          children: [{ text: 'Welcome to Your Knowledge Base' }],
        },
        {
          type: 'p',
          children: [
            { text: 'This is your personal knowledge management system. You can create ' },
            { text: 'folders', bold: true },
            { text: ' and ' },
            { text: 'notes', bold: true },
            { text: ' to organize your thoughts and information.' },
          ],
        },
      ],
      tags: ['welcome', 'guide'],
      summary: 'Welcome guide for the knowledge base',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const projectNote: NoteNodeData = {
      id: 'simple-knowledge-project',
      title: 'Simple Knowledge Project',
      type: 'note',
      parentId: 'projects',
      content: [
        {
          type: 'h1',
          children: [{ text: 'Simple Knowledge Project' }],
        },
        {
          type: 'p',
          children: [{ text: 'This is the main project for building a simple knowledge base application.' }],
        },
      ],
      tags: ['project', 'development'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.nodes.set('root', rootFolder);
    this.nodes.set('quick-notes', quickNotesFolder);
    this.nodes.set('projects', projectsFolder);
    this.nodes.set('learning', learningFolder);
    this.nodes.set('welcome-note', welcomeNote);
    this.nodes.set('simple-knowledge-project', projectNote);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback());
  }

  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  async createNode(type: 'folder' | 'note', title: string, parentId?: string): Promise<string> {
    const id = this.generateId();
    const now = new Date();

    const baseData = {
      id,
      title,
      type,
      parentId,
      createdAt: now,
      updatedAt: now,
    };

    let newNode: NodeData;

    if (type === 'folder') {
      newNode = {
        ...baseData,
        type: 'folder',
        children: [],
        expanded: true,
      } as FolderNodeData;
    } else {
      newNode = {
        ...baseData,
        type: 'note',
        content: [
          {
            type: 'h1',
            children: [{ text: title }],
          },
          {
            type: 'p',
            children: [{ text: '' }],
          },
        ],
        tags: [],
      } as NoteNodeData;
    }

    this.nodes.set(id, newNode);

    // If parent node exists, add new node to parent's children
    if (parentId) {
      const parent = this.nodes.get(parentId);
      if (parent && parent.type === 'folder') {
        (parent as FolderNodeData).children.push(id);
        parent.updatedAt = now;
      }
    }

    this.notifySubscribers();
    return id;
  }

  async updateNode(id: string, updates: Partial<NodeData>): Promise<void> {
    const node = this.nodes.get(id);
    if (!node) {
      throw new Error(`Node with id ${id} not found`);
    }

    const updatedNode = {
      ...node,
      ...updates,
      updatedAt: new Date(),
    } as NodeData;

    this.nodes.set(id, updatedNode);
    this.notifySubscribers();
  }

  async deleteNode(id: string): Promise<void> {
    const node = this.nodes.get(id);
    if (!node) {
      throw new Error(`Node with id ${id} not found`);
    }

    // If it's a folder, delete all children first
    if (node.type === 'folder') {
      const folderNode = node as FolderNodeData;
      for (const childId of folderNode.children) {
        await this.deleteNode(childId);
      }
    }

    // Remove from parent's children
    if (node.parentId) {
      const parent = this.nodes.get(node.parentId);
      if (parent && parent.type === 'folder') {
        const parentFolder = parent as FolderNodeData;
        parentFolder.children = parentFolder.children.filter(childId => childId !== id);
        parent.updatedAt = new Date();
      }
    }

    this.nodes.delete(id);
    this.notifySubscribers();
  }

  async moveNode(nodeId: string, newParentId?: string): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node with id ${nodeId} not found`);
    }

    const oldParentId = node.parentId;

    // Remove from old parent's children
    if (oldParentId) {
      const oldParent = this.nodes.get(oldParentId);
      if (oldParent && oldParent.type === 'folder') {
        const oldParentFolder = oldParent as FolderNodeData;
        oldParentFolder.children = oldParentFolder.children.filter(childId => childId !== nodeId);
        oldParent.updatedAt = new Date();
      }
    }

    // Add to new parent's children
    if (newParentId) {
      const newParent = this.nodes.get(newParentId);
      if (newParent && newParent.type === 'folder') {
        (newParent as FolderNodeData).children.push(nodeId);
        newParent.updatedAt = new Date();
      }
    }

    // Update node's parentId
    node.parentId = newParentId;
    node.updatedAt = new Date();

    this.notifySubscribers();
  }

  getNode(id: string): NodeData | undefined {
    return this.nodes.get(id);
  }

  getChildren(parentId?: string): NodeData[] {
    return Array.from(this.nodes.values()).filter(node => node.parentId === parentId);
  }

  getTree(): NodeTreeItem[] {
    const buildTree = (parentId?: string, level: number = 0): NodeTreeItem[] => {
      const children = this.getChildren(parentId);
      return children.map(node => {
        const treeItem: NodeTreeItem = {
          id: node.id,
          title: node.title,
          type: node.type,
          parentId: node.parentId,
          level,
        };

        if (node.type === 'folder') {
          const folderNode = node as FolderNodeData;
          treeItem.expanded = folderNode.expanded;
          treeItem.children = buildTree(node.id, level + 1);
        }

        return treeItem;
      });
    };

    return buildTree();
  }

  getAllNodes(): Map<string, NodeData> {
    return new Map(this.nodes);
  }

  toggleFolderExpanded(id: string): void {
    const node = this.nodes.get(id);
    if (node && node.type === 'folder') {
      const folderNode = node as FolderNodeData;
      folderNode.expanded = !folderNode.expanded;
      node.updatedAt = new Date();
      this.notifySubscribers();
    }
  }
} 
