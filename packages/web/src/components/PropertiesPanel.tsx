import { Clock, FileText, Tags, Star } from "lucide-react"

interface PropertiesPanelProps {}

const PropertiesPanel: React.FC<PropertiesPanelProps> = () => {
    return (
      <section className="w-80 bg-gray-50 border-l border-gray-300 p-4">
        <h2 className="text-lg font-semibold mb-4">Document Inspector</h2>
        <div className="space-y-4">
          {/* Document Outline */}
          <div className="bg-white p-3 rounded shadow-sm">
            <h3 className="font-medium mb-2 flex items-center">
              <FileText size={16} className="mr-2" />
              Outline
            </h3>
            <div className="space-y-1 text-sm">
              <div className="pl-2 py-1 hover:bg-gray-50 cursor-pointer">1. Introduction</div>
              <div className="pl-2 py-1 hover:bg-gray-50 cursor-pointer">2. Getting Started</div>
              <div className="pl-4 py-1 hover:bg-gray-50 cursor-pointer text-gray-600">2.1 Setup</div>
              <div className="pl-4 py-1 hover:bg-gray-50 cursor-pointer text-gray-600">2.2 Configuration</div>
              <div className="pl-2 py-1 hover:bg-gray-50 cursor-pointer">3. Usage Guide</div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-3 rounded shadow-sm">
            <h3 className="font-medium mb-2 flex items-center">
              <Tags size={16} className="mr-2" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Documentation</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Tutorial</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Knowledge Base</span>
            </div>
          </div>

          {/* Document Info */}
          <div className="bg-white p-3 rounded shadow-sm">
            <h3 className="font-medium mb-2 flex items-center">
              <Clock size={16} className="mr-2" />
              Document Info
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>2024-01-01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Modified:</span>
                <span>2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Word count:</span>
                <span>1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reading time:</span>
                <span>~5 min</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-3 rounded shadow-sm">
            <h3 className="font-medium mb-2 flex items-center">
              <Star size={16} className="mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
                Add to Favorites
              </button>
              <button className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm">
                Share Document
              </button>
              <button className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm">
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </section>
    )
}

export default PropertiesPanel
