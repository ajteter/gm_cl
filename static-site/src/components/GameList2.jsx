import GameCard2 from './GameCard2'
import MagSrvIframeAd from './MagSrvIframeAd'
import styles from '../styles/components/GameList.module.css'

export default function GameList2({ items }) {
  return (
    <ul className="grid onecol">
      {items?.map((game, index) => (
        <div key={game.id}>
          <GameCard2 game={game} />
          {index === 0 && (
            <li className={styles.adItem}>
              <div className={styles.adContainer}>
                <MagSrvIframeAd zoneId="5729202" width={300} height={250} />
              </div>
            </li>
          )}
          {(index + 1) % 5 === 0 && (
            <li>
              <div id={`ezoic-ad-game2-${index + 1}`} />
            </li>
          )}
        </div>
      ))}
    </ul>
  )
}