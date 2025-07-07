import React, { useState } from "react"
import { BookOpen, FileText, Search, ChevronRight, ChevronDown, Folder, FolderOpen, Calendar, Code, Briefcase, Heart, NotebookPen } from "lucide-react"

interface TreeNode {
  id: string
  title: string
  type: 'folder' | 'note' | 'journal' | 'learning' | 'software' | 'management' | 'life' | 'project'
  children?: TreeNode[]
  expanded?: boolean
}

interface DirectoryPanelProps {}

const DirectoryPanel: React.FC<DirectoryPanelProps> = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>([
    {
      id: 'root',
      title: 'root',
      type: 'folder',
      expanded: true,
      children: []
    },
    {
      id: 'journal',
      title: 'Journal',
      type: 'journal',
      expanded: true,
      children: [
        {
          id: 'journal-2025',
          title: '2025',
          type: 'folder',
          expanded: true,
          children: [
            {
              id: 'journal-2025-07',
              title: '07 - July',
              type: 'folder',
              expanded: true,
              children: [
                {
                  id: 'journal-2025-07-07',
                  title: '07 - Monday',
                  type: 'note',
                },
                {
                  id: 'journal-2025-07-08',
                  title: '08 - Tuesday',
                  type: 'note',
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'learning',
      title: 'Learning Area',
      type: 'learning',
      expanded: false,
      children: [
        {
          id: 'learning-react',
          title: 'React Learning Notes',
          type: 'note',
        },
        {
          id: 'learning-typescript',
          title: 'TypeScript Advanced',
          type: 'note',
        }
      ]
    },
    {
      id: 'software',
      title: 'Software Area',
      type: 'software',
      expanded: false,
      children: [
        {
          id: 'software-projects',
          title: 'Project Management',
          type: 'folder',
          children: [
            {
              id: 'software-projects-current',
              title: 'Current Projects',
              type: 'note',
            }
          ]
        }
      ]
    },
    {
      id: 'management',
      title: 'Management Area',
      type: 'management',
      expanded: false,
      children: []
    },
    {
      id: 'life',
      title: 'Life Area',
      type: 'life',
      expanded: true,
      children: []
    },
    {
      id: 'simple-knowledge',
      title: 'Simple Knowledge',
      type: 'project',
      expanded: true,
      children: [
        {
          id: 'simple-knowledge-requirements',
          title: 'Project Requirements',
          type: 'note',
        }
      ]
    }
  ])

  const getNodeIcon = (type: TreeNode['type'], expanded?: boolean) => {
    switch (type) {
      case 'folder':
        return expanded ? <FolderOpen size={16} /> : <Folder size={16} />
      case 'note':
        return <FileText size={16} />
      case 'journal':
        return <Calendar size={16} />
      case 'learning':
        return <BookOpen size={16} />
      case 'software':
        return <Code size={16} />
      case 'management':
        return <Briefcase size={16} />
      case 'life':
        return <Heart size={16} />
      case 'project':
        return <NotebookPen size={16} />
      default:
        return <FileText size={16} />
    }
  }

  const toggleNode = (nodeId: string) => {
    const updateNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded }
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) }
        }
        return node
      })
    }
    setTreeData(updateNode(treeData))
  }

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const paddingLeft = level * 20 + 8

    return (
      <div key={node.id} className="select-none">
        <div
          className="flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer text-gray-300 text-sm"
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren && (
            <span className="mr-1 flex-shrink-0">
              {node.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
          )}
          {!hasChildren && <span className="mr-1 w-3" />}
          
          <span className="mr-2 flex-shrink-0 text-gray-400">
            {getNodeIcon(node.type, node.expanded)}
          </span>
          
          <span className="truncate">{node.title}</span>
        </div>
        
        {hasChildren && node.expanded && (
          <div>
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="w-80 bg-gray-800 border-r border-gray-600 p-2 space-y-2">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-semibold text-white">Quick Search</h2>
        <button className="p-1 hover:bg-gray-700 rounded text-gray-400">
          <Search size={16} />
        </button>
      </div>
      
      <div className="overflow-y-auto max-h-full">
        {treeData.map(node => renderTreeNode(node))}
      </div>
    </section>
  )
}

export default DirectoryPanel
