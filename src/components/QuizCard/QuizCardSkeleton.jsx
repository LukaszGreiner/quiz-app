function QuizCardSkeleton() {
  return (
    <div className="bg-surface border-border relative h-80 overflow-hidden rounded-xl border">
      {/* Image Section Skeleton - 3/4 height */}
      <div className="relative h-3/4 w-full bg-surface-elevated">
        {/* Category label skeleton - top left */}
        <div className="absolute top-3 left-3">
          <div className="bg-surface-elevated/80 rounded-full h-6 w-20 animate-pulse"></div>
        </div>
        
        {/* Metadata skeleton - bottom right */}
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <div className="bg-surface-elevated/80 rounded-full h-5 w-8 animate-pulse delay-100"></div>
          <div className="bg-surface-elevated/80 rounded-full h-5 w-10 animate-pulse delay-200"></div>
        </div>
        
        {/* Privacy indicator skeleton - bottom left */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-surface-elevated/60 rounded-full h-6 w-16 animate-pulse delay-300"></div>
        </div>
        
        {/* Animated gradient overlay for shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer -translate-x-full"></div>
      </div>

      {/* Content Section Skeleton - 1/4 height */}
      <div className="flex h-1/4 flex-col justify-center p-3 space-y-2">
        {/* Title skeleton - two lines */}
        <div className="space-y-2">
          <div className="bg-surface-elevated rounded h-4 w-4/5 animate-pulse"></div>
          <div className="bg-surface-elevated rounded h-4 w-3/5 animate-pulse delay-150"></div>
        </div>
        
        {/* Questions count skeleton */}
        <div className="flex justify-between items-center pt-1">
          <div className="bg-surface-elevated rounded h-3 w-16 animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
}

export default QuizCardSkeleton;
