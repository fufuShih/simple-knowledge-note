import React, { useState, useCallback } from "react"
import { Search, Plus, FolderPlus, FileText } from "lucide-react"
import { useNodeContext } from "./nodes/NodeContext"
import { NodeItem } from "./nodes/NodeItem"
import type { NodeTreeItem } from "./nodes/types"

interface DirectoryPanelProps {}

const DirectoryPanel: React.FC<DirectoryPanelProps> = () => {
  const { getTree, createNode, updateNode, deleteNode, moveNode, activeNodeId, setActiveNodeId } = useNodeContext()
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const treeData = getTree()
  
  const handleNodeSelect = useCallback((node: NodeTreeItem) => {
    setActiveNodeId(node.id)
  }, [setActiveNodeId])

  const handleCreateChild = useCallback(async (parentId: string, type: 'folder' | 'note') => {
    const title = type === 'folder' ? 'New Folder' : 'New Note'
    await createNode(type, title, parentId)
  }, [createNode])

  const handleRename = useCallback(async (id: string, newTitle: string) => {
    await updateNode(id, { title: newTitle })
  }, [updateNode])

  const handleDelete = useCallback(async (id: string) => {
    await deleteNode(id)
    if (activeNodeId === id) {
      setActiveNodeId(undefined)
    }
  }, [deleteNode, activeNodeId, setActiveNodeId])

  const handleMove = useCallback(async (nodeId: string, newParentId?: string) => {
    await moveNode(nodeId, newParentId)
  }, [moveNode])

  const handleCreateRootFolder = useCallback(async () => {
    await createNode('folder', 'New Folder', 'root')
    setShowCreateMenu(false)
  }, [createNode])

  const handleCreateRootNote = useCallback(async () => {
    await createNode('note', 'New Note', 'root')
    setShowCreateMenu(false)
  }, [createNode])

  const filteredTreeData = treeData.filter(node => 
    node.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        {filteredTreeData.map(node => (
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
        {filteredTreeData.length === 0 && searchQuery && (
          <div className="text-gray-500 text-sm text-center py-4">
            No nodes found matching "{searchQuery}"
          </div>
        )}
      </div>
    </section>
  )
}

export default DirectoryPanel
