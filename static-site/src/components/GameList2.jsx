import GameCard2 from './GameCard2'
import AdcashAd from './AdcashAd'
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
                <AdcashAd zoneId="10422246" />
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