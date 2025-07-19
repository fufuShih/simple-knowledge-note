import Sidebar from '../components/Sidebar'
import DirectoryPanel from '../components/DirectoryPanel'
import ContentArea from '../components/ContentArea'
import SecondaryPanel from '../components/SecondaryPanel'

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
      <SecondaryPanel />
    </div>
  )
}

export default HomePage
