import { Link } from 'react-router-dom'
import { useNotFoundSEO } from '../hooks/useSEO'

function NotFoundPage() {
  // Set up SEO for 404 page
  useNotFoundSEO()
  return (
    <div className="container">
      <h1 className="title">Page Not Found</h1>
      <div className="empty">
        <div className="emptyText">The page you're looking for doesn't exist.</div>
        <div style={{ marginTop: '20px' }}>
          <Link to="/game" className="playBtn" style={{ display: 'inline-block', width: 'auto', padding: '10px 20px' }}>
            Back to Games
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage