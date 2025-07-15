import { createBrowserRouter, RouterProvider } from 'react-router'
import HomePage from './pages/HomePage'
import { NodeProvider } from './components/nodes'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage title="HomePage" />,
  },
])

function App() {
  return (
    <NodeProvider>
      <RouterProvider router={router} />
    </NodeProvider>
  )
}

export default App
