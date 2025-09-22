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
                        * { max-width: 100% !important; max-height: 250px !important; }
                      </style>
                    </head>
                    <body>
                      <script type="text/javascript">
                        window.atOptions = {
                          'key': '268fd9be7cb5acbc21f157c5611ba04f',
                          'format': 'iframe',
                          'height': 250,
                          'width': 300,
                          'params': {}
                        };
                      </script>
                      <script type="text/javascript" src="//www.highperformanceformat.com/268fd9be7cb5acbc21f157c5611ba04f/invoke.js"></script>
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
              <div id={`ezoic-ad-${index + 1}`} />
            </li>
          )}
        </div>
      ))}
    </ul>
  )
}