import React from 'react'
import { useNavigate } from 'react-router-dom'
import GameClientUI from '../components/GameClientUI'
import { useHomeSEO } from '../hooks/useSEO'

export default function HomePage() {
  const navigate = useNavigate()

  // Keep SEO hooks happy
  useHomeSEO(1, 1)

  const floppyGame = {
    id: 'floppybird',
    title: 'Floppy Bird',
    url: '/games/floppybird/index.html'
  }

  const handleMoreGames = () => {
    navigate('/game/random')
  }

  return (
    <GameClientUI
      game={floppyGame}
      title={floppyGame.title}
      showTitle={false} // Hidden for a cleaner fullscreen look like a real app
      adConfig={null}
      onMoreGames={handleMoreGames}
    />
  )
}
