import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout.jsx'
import { legacyRedirects } from './data/portfolio.js'
import Home from './pages/Home.jsx'
import { CompetitiveProgrammingPage, NotFoundPage, ProjectsPage, WritingPage } from './pages/DetailPages.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="competitive-programming" element={<CompetitiveProgrammingPage />} />
        <Route path="writing" element={<WritingPage />} />
        {/* Old detail routes now point at their homepage section. vercel.json issues the same redirects server-side. */}
        {legacyRedirects.map(({ from, to }) => <Route key={from} path={from.slice(1)} element={<Navigate to={to} replace />} />)}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
