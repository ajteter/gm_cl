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

  // Use the same ad configuration as RandomGamePage
  const homeAdConfig = {
    key: '866f788a538c789345f3c99981b528db',
    height: 50,
    width: 320,
    maxHeight: '50px',
    script: '//www.highperformanceformat.com/866f788a538c789345f3c99981b528db/invoke.js',
    delay: 1000
  }

  // Native ad configuration for floppybird page
  const nativeAd = {
    scriptSrc: 'https://pl28930965.profitablecpmratenetwork.com/94dce533c4905a36ce0e031ab154baca/invoke.js',
    containerId: 'container-94dce533c4905a36ce0e031ab154baca'
  }

  return (
    <GameClientUI
      game={floppyGame}
      title={floppyGame.title}
      showTitle={false} // Hidden for a cleaner fullscreen look like a real app
      adConfig={null}
      nativeAdConfig={nativeAd}
      onMoreGames={handleMoreGames}
    />
  )
}