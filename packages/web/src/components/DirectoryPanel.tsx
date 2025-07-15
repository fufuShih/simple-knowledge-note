import React, { useState, useCallback } from "react"
import { Search, Plus, FolderPlus, FileText } from "lucide-react"
import { useNodeContext, useNodeOperations, useNodeSearch, NodeItem } from "./nodes"
import type { NodeTreeItem } from "./nodes"

interface DirectoryPanelProps {}

const DirectoryPanel: React.FC<DirectoryPanelProps> = () => {
  const { activeNodeId } = useNodeContext()
  const { 
    handleCreateFolder, 
    handleCreateNote, 
    handleRenameNode, 
    handleDeleteNode, 
    handleMoveNode, 
    handleSelectNode 
  } = useNodeOperations()
  const { searchQuery, setSearchQuery, filteredNodes, clearSearch } = useNodeSearch()
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  
  const handleNodeSelect = useCallback((node: NodeTreeItem) => {
    handleSelectNode(node.id)
  }, [handleSelectNode])

  const handleCreateChild = useCallback(async (parentId: string, type: 'folder' | 'note') => {
    if (type === 'folder') {
      await handleCreateFolder(parentId)
    } else {
      await handleCreateNote(parentId)
    }
  }, [handleCreateFolder, handleCreateNote])

  const handleRename = useCallback(async (id: string, newTitle: string) => {
    await handleRenameNode(id, newTitle)
  }, [handleRenameNode])

  const handleDelete = useCallback(async (id: string) => {
    await handleDeleteNode(id)
  }, [handleDeleteNode])

  const handleMove = useCallback(async (nodeId: string, newParentId?: string) => {
    await handleMoveNode(nodeId, newParentId)
  }, [handleMoveNode])

  const handleCreateRootFolder = useCallback(async () => {
    await handleCreateFolder('root')
    setShowCreateMenu(false)
  }, [handleCreateFolder])

  const handleCreateRootNote = useCallback(async () => {
    await handleCreateNote('root')
    setShowCreateMenu(false)
  }, [handleCreateNote])

  return (
    <section className="w-80 bg-gray-800 border-r border-gray-600 p-2 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-semibold text-white">Knowledge Base</h2>
        <div className="flex items-center space-x-1">
          <button 
            className="p-1 hover:bg-gray-700 rounded text-gray-400"
            title="Search"
          >
            <Search size={16} />
          </button>
          <div className="relative">
            <button 
              className="p-1 hover:bg-gray-700 rounded text-gray-400"
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              title="Add new"
            >
              <Plus size={16} />
            </button>
            {showCreateMenu && (
              <div className="absolute right-0 top-8 bg-gray-800 border border-gray-600 rounded shadow-lg py-1 z-50 min-w-[140px]">
                <button
                  onClick={handleCreateRootFolder}
                  className="w-full px-3 py-1 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                >
                  <FolderPlus size={14} className="mr-2" />
                  New Folder
                </button>
                <button
                  onClick={handleCreateRootNote}
                  className="w-full px-3 py-1 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                >
                  <FileText size={14} className="mr-2" />
                  New Note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-700 text-white px-3 py-1 rounded text-sm outline-none border border-gray-600 focus:border-blue-500"
        />
      </div>
      
      {/* Tree View */}
      <div className="overflow-y-auto max-h-full">
        {filteredNodes.map(node => (
          <NodeItem
            key={node.id}
            node={node}
            onSelect={handleNodeSelect}
            onCreateChild={handleCreateChild}
            onDelete={handleDelete}
            onRename={handleRename}
            onMove={handleMove}
            isActive={activeNodeId === node.id}
          />
        ))}
        {filteredNodes.length === 0 && searchQuery && (
          <div className="text-gray-500 text-sm text-center py-4">
            No nodes found matching "{searchQuery}"
            <button 
              onClick={clearSearch}
              className="block mt-2 text-blue-400 hover:text-blue-300"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default DirectoryPanel
