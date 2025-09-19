import GameCard2 from './GameCard2'
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
                <iframe 
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <script id="aclib" type="text/javascript" src="//acscdn.com/script/aclib.js"></script>
                      <style>
                        body { margin: 0; padding: 0; overflow: hidden; }
                        * { max-width: 100% !important; max-height: 250px !important; }
                      </style>
                    </head>
                    <body>
                      <div>
                        <script type="text/javascript">
                          aclib.runBanner({
                            zoneId: '10422246'
                          });
                        </script>
                      </div>
                    </body>
                    </html>
                  `}
                  sandbox="allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-popups"
                  style={{
                    width: '100%',
                    height: '250px',
                    border: 0,
                    maxHeight: '250px',
                    overflow: 'hidden'
                  }}
                  title="Advertisement"
                />
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