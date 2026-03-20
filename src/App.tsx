import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout.tsx'
import { ChampionDetailPage } from './pages/ChampionDetailPage.tsx'
import { ChampionsPage } from './pages/Champions.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { MatchupPage } from './pages/Matchup.tsx'
import { RuletaPage } from './pages/RuletaPage.tsx'
import { TeamBuilderPage } from './pages/TeamBuilder.tsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="champions" element={<ChampionsPage />} />
        <Route path="champions/:id" element={<ChampionDetailPage />} />
        <Route path="tools/matchup" element={<MatchupPage />} />
        <Route path="tools/team-builder" element={<TeamBuilderPage />} />
        <Route path="tools/ruleta" element={<RuletaPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
