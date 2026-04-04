import { Navigate, useParams } from 'react-router'

export function GamesPage() {
  const params = useParams()
  const gameId = params.gameId ? decodeURIComponent(params.gameId) : null

  if (gameId) {
    return <Navigate replace to={`/library/${encodeURIComponent(gameId)}`} />
  }

  return <Navigate replace to="/library" />
}
