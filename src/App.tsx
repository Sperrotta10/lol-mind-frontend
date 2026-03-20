import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout.tsx'
import { ChampionDetailsPage } from './pages/ChampionDetails.tsx'
import { ChampionsPage } from './pages/Champions.tsx'
import { HomePage } from './pages/Home.tsx'
import { MatchupPage } from './pages/Matchup.tsx'
import { RoulettePage } from './pages/Roulette.tsx'
import { TeamBuilderPage } from './pages/TeamBuilder.tsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="champions" element={<ChampionsPage />} />
        <Route path="champions/:id" element={<ChampionDetailsPage />} />
        <Route path="tools/matchup" element={<MatchupPage />} />
        <Route path="tools/team-builder" element={<TeamBuilderPage />} />
        <Route path="tools/roulette" element={<RoulettePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
