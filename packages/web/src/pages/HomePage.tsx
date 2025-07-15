import Sidebar from '../components/Sidebar'
import DirectoryPanel from '../components/DirectoryPanel'
import ContentArea from '../components/ContentArea'
import PropertiesPanel from '../components/PropertiesPanel'

interface HomePageProps {
  title?: string
}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div className="flex h-screen">
      {/* Icon Sidebar */}
      <Sidebar />

      {/* Directory Panel */}
      <DirectoryPanel />

      {/* Content Area */}
      <ContentArea />

      {/* Properties Panel */}
      <PropertiesPanel />
    </div>
  )
}

export default HomePage
