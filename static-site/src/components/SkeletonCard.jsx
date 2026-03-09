import { LoadingSkeleton } from './LoadingSpinner'

export default function SkeletonCard() {
  return (
    <li className="bg-card border border-card-border rounded-xl p-4 flex flex-col w-full h-full">
      <div className="relative w-full aspect-video sm:aspect-[4/3] bg-background/50 rounded-lg overflow-hidden mb-4">
        <LoadingSkeleton
          width="100%"
          height="100%"
        />
      </div>
      <div className="flex flex-col gap-2">
        <LoadingSkeleton
          width="80%"
          height="1.25rem"
        />
        <LoadingSkeleton
          width="60%"
          height="1rem"
        />
        <LoadingSkeleton
          width="40%"
          height="0.875rem"
        />
      </div>
    </li>
  );
}