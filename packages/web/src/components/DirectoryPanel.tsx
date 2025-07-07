import { BookOpen, FileText, Search } from "lucide-react"

interface DirectoryPanelProps {}

const DirectoryPanel: React.FC<DirectoryPanelProps> = () => {
  const mockData = [
    {
      id: 1,
      title: "Getting Started",
      description: "Introduction to the knowledge base",
      type: "folder",
    },
  ];

  return (
    <section className="w-80 bg-gray-100 border-r border-gray-300 p-2 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-blue-500">Knowledge Base</h2>
        <button className="p-1 hover:bg-gray-200 rounded">
          <Search size={16} />
        </button>
      </div>
      {mockData.map((item) => (
        <div className="p-3 bg-white rounded shadow-sm hover:shadow-md cursor-pointer border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold mb-2 text-blue-500">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
      ))}
    </section>
  )
}

export default DirectoryPanel
