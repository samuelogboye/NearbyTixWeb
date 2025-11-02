import clsx from 'clsx';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export const LoadingSkeleton = ({
  className,
  variant = 'rectangular',
  width,
  height,
}: LoadingSkeletonProps) => {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={clsx('animate-pulse bg-gray-200', variants[variant], className)}
      style={{ width, height }}
    />
  );
};

export const EventCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <LoadingSkeleton variant="rectangular" height="200px" className="rounded-none" />
      <div className="p-6 space-y-3">
        <LoadingSkeleton variant="text" height="24px" width="75%" />
        <LoadingSkeleton variant="text" height="16px" width="50%" />
        <LoadingSkeleton variant="text" height="16px" width="60%" />
        <div className="flex items-center justify-between pt-4">
          <LoadingSkeleton variant="text" height="20px" width="40%" />
          <LoadingSkeleton variant="rectangular" height="36px" width="100px" />
        </div>
      </div>
    </div>
  );
};
