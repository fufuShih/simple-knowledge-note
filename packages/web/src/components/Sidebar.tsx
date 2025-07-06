import { FileText, Search, Settings, Tags } from "lucide-react"
import { Brain } from "lucide-react"

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {

    const icons = [
        {
            icon: <FileText size={20} />,
            title: "Documents",
            onClick: () => {}
        },
        {
            icon: <Search size={20} />,
            title: "Search",
            onClick: () => {}
        },
        {
            icon: <Tags size={20} />,
            title: "Tags",
            onClick: () => {}
        }
    ];


    return (
        <section className="w-16 bg-gray-800 text-white flex flex-col">
        {/* Brand Section */}
        <div className="flex justify-center py-4 border-b border-gray-700">
          <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors" title="Knowledge Base">
            <Brain size={24} className="text-blue-400" />
          </button>
        </div>

        {/* Main Icons Section */}
        <div className="flex-1 flex flex-col items-center py-4 space-y-4">
            {
                icons.map((icon) => (
                    <button className="p-3 rounded-lg hover:bg-gray-700 transition-colors" title={icon.title} onClick={icon.onClick}>
                        {icon.icon}
                    </button>
                ))
            }
        </div>

        {/* Settings Section */}
        <div className="flex justify-center py-4 border-t border-gray-700">
          <button className="p-3 rounded-lg hover:bg-gray-700 transition-colors" title="Settings">
            <Settings size={20} />
          </button>
        </div>
      </section>
    )
}

export default Sidebar