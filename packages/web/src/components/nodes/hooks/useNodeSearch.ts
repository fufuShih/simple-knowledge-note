import { useState, useMemo, useCallback } from 'react';
import { useNodeContext } from '../NodeContext';
import type { NodeTreeItem } from '../types';

export const useNodeSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { getTree } = useNodeContext();

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) {
      return getTree();
    }

    const filterTree = (nodes: NodeTreeItem[]): NodeTreeItem[] => {
      return nodes.reduce((acc: NodeTreeItem[], node) => {
        const matchesSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (matchesSearch) {
          acc.push({
            ...node,
            children: node.children ? filterTree(node.children) : undefined
          });
        } else if (node.children) {
          const filteredChildren = filterTree(node.children);
          if (filteredChildren.length > 0) {
            acc.push({
              ...node,
              children: filteredChildren,
              expanded: true
            });
          }
        }
        
        return acc;
      }, []);
    };

    return filterTree(getTree());
  }, [searchQuery, getTree]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filteredNodes,
    clearSearch,
    hasResults: filteredNodes.length > 0,
    isEmpty: searchQuery.trim() !== '' && filteredNodes.length === 0
  };
};
