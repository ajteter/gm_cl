import GameCard from './GameCard'
import styles from '../styles/components/GameList.module.css'

export default function GameList({ items }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-0 m-0 list-none w-full">
      {items?.map((game, index) => (
        <div key={game.id} className="w-full flex">
          <GameCard game={game} />
          {index === 0 && (
            <li className="col-span-1 w-full flex justify-center items-center p-4 bg-card rounded-xl border border-card-border overflow-hidden">
              <div className="w-full max-w-[300px] h-[250px] flex justify-center items-center">
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <style>
                        body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
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
            <li className="col-span-1 w-full flex justify-center items-center p-4">
              <div id={`ezoic-ad-${index + 1}`} className="w-full min-h-[100px] flex justify-center" />
            </li>
          )}
        </div>
      ))}
    </ul>
  )
}