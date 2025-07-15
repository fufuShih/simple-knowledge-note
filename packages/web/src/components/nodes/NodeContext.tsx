import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { NodeContextValue, NodeData } from './types';
import { NodeManager } from './NodeManager';

const NodeContext = createContext<NodeContextValue | undefined>(undefined);

export const useNodeContext = () => {
  const context = useContext(NodeContext);
  if (!context) {
    throw new Error('useNodeContext must be used within a NodeProvider');
  }
  return context;
};

interface NodeProviderProps {
  children: React.ReactNode;
}

export const NodeProvider: React.FC<NodeProviderProps> = ({ children }) => {
  const [nodeManager] = useState(() => new NodeManager());
  const [nodes, setNodes] = useState<Map<string, NodeData>>(nodeManager.getAllNodes());
  const [activeNodeId, setActiveNodeId] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsubscribe = nodeManager.subscribe(() => {
      setNodes(nodeManager.getAllNodes());
      setRefreshKey(prev => prev + 1);
    });

    return unsubscribe;
  }, [nodeManager]);

  const contextValue: NodeContextValue = useMemo(() => ({
    nodes,
    activeNodeId,
    setActiveNodeId,
    createNode: nodeManager.createNode.bind(nodeManager),
    updateNode: nodeManager.updateNode.bind(nodeManager),
    deleteNode: nodeManager.deleteNode.bind(nodeManager),
    moveNode: nodeManager.moveNode.bind(nodeManager),
    getNode: nodeManager.getNode.bind(nodeManager),
    getChildren: nodeManager.getChildren.bind(nodeManager),
    getTree: nodeManager.getTree.bind(nodeManager),
    refreshTree: () => setRefreshKey(prev => prev + 1),
    toggleFolderExpanded: nodeManager.toggleFolderExpanded.bind(nodeManager),
  }), [nodes, activeNodeId, nodeManager, refreshKey]);

  return (
    <NodeContext.Provider value={contextValue}>
      {children}
    </NodeContext.Provider>
  );
}; 
