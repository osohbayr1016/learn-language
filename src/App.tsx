import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './components/Layout.tsx'
import { Home } from './pages/Home.tsx'
import { KanaChart } from './pages/KanaChart.tsx'
import { Placeholder } from './pages/Placeholder.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'kana', element: <KanaChart /> },
      { path: 'review', element: <Placeholder titleKey="review.title" /> },
      { path: 'progress', element: <Placeholder titleKey="progress.title" /> },
      { path: 'settings', element: <Placeholder titleKey="settings.title" /> },
      { path: '*', element: <Placeholder titleKey="error.notFound" /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
