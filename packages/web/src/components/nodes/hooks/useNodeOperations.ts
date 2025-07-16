import { useCallback } from 'react';
import { useNodeContext } from '../NodeContext';

export const useNodeOperations = () => {
  const { 
    createNode, 
    updateNode, 
    deleteNode, 
    moveNode, 
    setActiveNodeId,
    activeNodeId 
  } = useNodeContext();

  const handleCreateFolder = useCallback(async (parentId?: string, title: string = 'New Folder') => {
    return await createNode('folder', title, parentId);
  }, [createNode]);

  const handleCreateNote = useCallback(async (parentId?: string, title: string = 'New Note') => {
    const noteId = await createNode('note', title, parentId);
    setActiveNodeId(noteId);
    return noteId;
  }, [createNode, setActiveNodeId]);

  const handleCreateWebNote = useCallback(async (parentId?: string, title: string = 'New Web Note', url: string = 'https://example.com') => {
    const webNoteId = await createNode('webNote', title, parentId, { url });
    setActiveNodeId(webNoteId);
    return webNoteId;
  }, [createNode, setActiveNodeId]);

  const handleRenameNode = useCallback(async (id: string, newTitle: string) => {
    if (newTitle.trim()) {
      await updateNode(id, { title: newTitle.trim() });
    }
  }, [updateNode]);

  const handleDeleteNode = useCallback(async (id: string) => {
    await deleteNode(id);
    if (activeNodeId === id) {
      setActiveNodeId(undefined);
    }
  }, [deleteNode, activeNodeId, setActiveNodeId]);

  const handleMoveNode = useCallback(async (nodeId: string, newParentId?: string) => {
    await moveNode(nodeId, newParentId);
  }, [moveNode]);

  const handleSelectNode = useCallback((nodeId: string) => {
    setActiveNodeId(nodeId);
  }, [setActiveNodeId]);

  return {
    handleCreateFolder,
    handleCreateNote,
    handleCreateWebNote,
    handleRenameNode,
    handleDeleteNode,
    handleMoveNode,
    handleSelectNode,
  };
};
