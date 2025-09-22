import GameCard from './GameCard'
import styles from '../styles/components/GameList.module.css'

export default function GameList({ items }) {
  return (
    <ul className="grid onecol">
      {items?.map((game, index) => (
        <div key={game.id}>
          <GameCard game={game} />
          {index === 0 && (
            <li className={styles.adItem}>
              <div className={styles.adContainer}>
                <iframe 
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <style>
                        body { margin: 0; padding: 0; overflow: hidden; }
                        * { max-width: 100% !important; max-height: 50px !important; }
                      </style>
                    </head>
                    <body>
                      <script type="text/javascript">
                        window.atOptions = {
                          'key': '9adddfc2b9f962e7595071bcbd5cc4e5',
                          'format': 'iframe',
                          'height': 50,
                          'width': 320,
                          'params': {}
                        };
                      </script>
                      <script type="text/javascript" src="//www.highperformanceformat.com/9adddfc2b9f962e7595071bcbd5cc4e5/invoke.js"></script>
                    </body>
                    </html>
                  `}
                  sandbox="allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-popups"
                  style={{
                    width: '100%',
                    height: '50px',
                    border: 0,
                    maxHeight: '50px',
                    overflow: 'hidden'
                  }}
                  title="Advertisement"
                />
              </div>
            </li>
          )}
          {(index + 1) % 5 === 0 && (
            <li>
              <div id={`ezoic-ad-${index + 1}`} />
            </li>
          )}
        </div>
      ))}
    </ul>
  )
}