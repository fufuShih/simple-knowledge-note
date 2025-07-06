import { FileText, Tags } from "lucide-react"

interface ContentAreaProps {}

const ContentArea: React.FC<ContentAreaProps> = () => {
    return (
        <section className="flex-1 bg-white p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Content Area</h1>
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Your Knowledge Base</h2>
            <p className="text-gray-700 mb-4">
              This is your personal knowledge management system. Organize your notes, documents, and ideas in a structured way.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
              <h3 className="text-xl font-medium mb-2 text-blue-900">📝 Quick Start</h3>
              <p className="text-blue-800">
                Start by creating your first note or importing existing documents. Use tags and categories to organize your content.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 flex items-center">
                  <FileText size={16} className="mr-2" />
                  Create Notes
                </h4>
                <p className="text-green-700 text-sm mt-2">Write and organize your thoughts with rich text formatting</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 flex items-center">
                  <Tags size={16} className="mr-2" />
                  Tag & Categorize
                </h4>
                <p className="text-purple-700 text-sm mt-2">Use tags to connect related ideas and find content easily</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}

export default ContentArea
