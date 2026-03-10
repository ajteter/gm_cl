import GameCard from './GameCard'

export default function GameList({ items }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-0 m-0 list-none w-full">
      {items?.map((game) => (
        <li key={game.id} className="w-full flex">
          <GameCard game={game} />
        </li>
      ))}
    </ul>
  )
}