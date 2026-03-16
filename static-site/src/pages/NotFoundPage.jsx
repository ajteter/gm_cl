import { Link } from 'react-router-dom'
import { useNotFoundSEO } from '../hooks/useSEO'
import { useI18n } from '../i18n'

function NotFoundPage() {
  const { t } = useI18n()
  // Set up SEO for 404 page
  useNotFoundSEO()
  return (
    <div className="container">
      <h1 className="title">{t('notFound.title')}</h1>
      <div className="empty">
        <div className="emptyText">{t('notFound.message')}</div>
        <div style={{ marginTop: '20px' }}>
          <Link to="/game" className="playBtn" style={{ display: 'inline-block', width: 'auto', padding: '10px 20px' }}>
            {t('notFound.backButton')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage