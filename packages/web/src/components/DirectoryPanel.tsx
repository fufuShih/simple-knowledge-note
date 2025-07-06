import { BookOpen, FileText, Search } from "lucide-react"

interface DirectoryPanelProps {}

const DirectoryPanel: React.FC<DirectoryPanelProps> = () => {
    return (
        <section className="w-80 bg-gray-100 border-r border-gray-300 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Knowledge Base</h2>
          <button className="p-1 hover:bg-gray-200 rounded">
            <Search size={16} />
          </button>
        </div>
        <div className="space-y-2">
          <div className="p-3 bg-white rounded shadow-sm hover:shadow-md cursor-pointer border-l-4 border-blue-500">
            <div className="flex items-center space-x-2">
              <BookOpen size={16} className="text-blue-500" />
              <h3 className="font-medium">Getting Started</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">Introduction to the knowledge base</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-gray-500">Last edited: 2 hours ago</span>
            </div>
          </div>
          <div className="p-3 bg-white rounded shadow-sm hover:shadow-md cursor-pointer">
            <div className="flex items-center space-x-2">
              <FileText size={16} className="text-green-500" />
              <h3 className="font-medium">Project Notes</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">Development and planning notes</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-gray-500">Last edited: 1 day ago</span>
            </div>
          </div>
          <div className="p-3 bg-white rounded shadow-sm hover:shadow-md cursor-pointer">
            <div className="flex items-center space-x-2">
              <BookOpen size={16} className="text-purple-500" />
              <h3 className="font-medium">Reference Materials</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">Important references and resources</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-gray-500">Last edited: 3 days ago</span>
            </div>
          </div>
        </div>
      </section>
    )
}

export default DirectoryPanel