import React, { useState } from "react"
import { Clock, FileText, Tags, Star, Folder, Hash, PanelRightOpen, PanelRightClose } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNodeContext } from "./nodes"
import type { NoteNodeData } from "./nodes"
import { formatDate, getNodeStats, estimateReadingTime } from "./nodes/utils/nodeUtils"

interface PropertiesPanelProps {}

const SecondaryPanel: React.FC<PropertiesPanelProps> = () => {
  const { activeNodeId, getNode, getChildren } = useNodeContext()
  const activeNode = activeNodeId ? getNode(activeNodeId) : null
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <motion.section
      className="bg-gray-50 border-l border-gray-300 flex"
      animate={{ width: isCollapsed ? 40 : 320 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {/* Collapsed state */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            key="collapsed"
            className="w-10 flex items-start justify-center pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <button
              onClick={toggleCollapse}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Expand properties panel"
            >
              <PanelRightOpen size={16} className="text-gray-600" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded state */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            key="expanded"
            className="w-80 p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={toggleCollapse}
                className="p-1 hover:bg-gray-200 rounded transition-colors ml-auto"
                title="Collapse properties panel"
              >
                <PanelRightClose size={16} className="text-gray-600" />
              </button>
            </div>

            {!activeNode ? (
              <div className="text-center text-gray-500 mt-8">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select a note or folder to view its properties</p>
              </div>
            ) : (
              <PropertiesContent 
                activeNode={activeNode} 
                isNote={activeNode.type === 'note'}
                isFolder={activeNode.type === 'folder'}
                children={activeNode.type === 'folder' ? getChildren(activeNodeId) : []}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

// Simplified properties content component without internal animations
interface PropertiesContentProps {
  activeNode: any
  isNote: boolean
  isFolder: boolean
  children: any[]
}

const PropertiesContent: React.FC<PropertiesContentProps> = ({ 
  activeNode, 
  isNote, 
  isFolder, 
  children 
}) => {
  const nodeStats = getNodeStats(activeNode)

  return (
    <div className="space-y-4">
      {/* Node Type & Name */}
      <div className="bg-white p-3 rounded shadow-sm">
        <h3 className="font-medium mb-2 flex items-center">
          {isFolder ? <Folder size={16} className="mr-2 text-blue-500" /> : <FileText size={16} className="mr-2 text-green-500" />}
          {nodeStats.type}
        </h3>
        <p className="text-sm text-gray-600 truncate" title={activeNode.title}>
          {activeNode.title}
        </p>
      </div>

      {/* Tags (for notes) */}
      {isNote && (
        <div className="bg-white p-3 rounded shadow-sm">
          <h3 className="font-medium mb-2 flex items-center">
            <Tags size={16} className="mr-2" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {(activeNode as NoteNodeData).tags.length > 0 ? (
              (activeNode as NoteNodeData).tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No tags</span>
            )}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white p-3 rounded shadow-sm">
        <h3 className="font-medium mb-2 flex items-center">
          <Hash size={16} className="mr-2" />
          Statistics
        </h3>
        <div className="space-y-2 text-sm">
          {isFolder && (
            <div className="flex justify-between">
              <span className="text-gray-600">Items:</span>
              <span>{nodeStats.childCount}</span>
            </div>
          )}
          {isNote && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Word count:</span>
                <span>{nodeStats.wordCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reading time:</span>
                <span>{estimateReadingTime(nodeStats.wordCount || 0)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Date Info */}
      <div className="bg-white p-3 rounded shadow-sm">
        <h3 className="font-medium mb-2 flex items-center">
          <Clock size={16} className="mr-2" />
          Timestamps
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Created:</span>
            <span>{formatDate(activeNode.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Modified:</span>
            <span>{formatDate(activeNode.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Folder Contents Preview */}
      {isFolder && children.length > 0 && (
        <div className="bg-white p-3 rounded shadow-sm">
          <h3 className="font-medium mb-2 flex items-center">
            <Folder size={16} className="mr-2" />
            Contents
          </h3>
          <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
            {children.slice(0, 5).map((child) => (
              <div key={child.id} className="flex items-center py-1">
                {child.type === 'folder' ? 
                  <Folder size={12} className="mr-2 text-blue-500 flex-shrink-0" /> : 
                  <FileText size={12} className="mr-2 text-green-500 flex-shrink-0" />
                }
                <span className="truncate">{child.title}</span>
              </div>
            ))}
            {children.length > 5 && (
              <div className="text-gray-500 text-xs">
                ... and {children.length - 5} more items
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white p-3 rounded shadow-sm">
        <h3 className="font-medium mb-2 flex items-center">
          <Star size={16} className="mr-2" />
          Quick Actions
        </h3>
        <div className="space-y-2">
          {isNote && (
            <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
              Add to Favorites
            </button>
          )}
          <button className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm">
            Share {nodeStats.type}
          </button>
          {isNote && (
            <button className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm">
              Export as PDF
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SecondaryPanel
