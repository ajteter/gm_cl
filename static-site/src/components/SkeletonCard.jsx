import { LoadingSkeleton } from './LoadingSpinner'

export default function SkeletonCard() {
  return (
    <li className="card">
      <div className="media">
        <LoadingSkeleton 
          width="100%" 
          height="200px" 
          className="thumb skeleton"
        />
      </div>
      <div className="content">
        <LoadingSkeleton 
          width="80%" 
          height="1.25rem" 
          className="skeleton skeleton-text"
        />
        <LoadingSkeleton 
          width="60%" 
          height="1rem" 
          className="skeleton skeleton-text"
        />
        <LoadingSkeleton 
          width="40%" 
          height="0.875rem" 
          className="skeleton skeleton-text-sm"
        />
      </div>
    </li>
  );
}