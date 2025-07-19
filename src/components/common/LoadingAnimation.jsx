import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-6">
      <div className="relative">
        {/* Quiz card background */}
        <div className="bg-surface rounded-xl border border-border shadow-md w-64 h-32 flex items-center justify-center mb-4 relative overflow-hidden">
          {/* Animated progress bar */}
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-surface-elevated border-border h-2 w-full rounded-full border overflow-hidden">
              <div className="bg-primary h-full rounded-full animate-loadingProgress origin-left" 
                   style={{animation: "loading 1.5s ease-in-out infinite"}}></div>
            </div>
          </div>
          
          {/* Animated placeholder content */}
          <div className="flex flex-col items-center space-y-2 pt-4">
            <div className="bg-surface-elevated rounded-lg h-3 w-32 animate-pulse"></div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-surface-elevated rounded-lg h-6 w-24 animate-pulse"></div>
              <div className="bg-surface-elevated rounded-lg h-6 w-24 animate-pulse delay-75"></div>
              <div className="bg-surface-elevated rounded-lg h-6 w-24 animate-pulse delay-150"></div>
              <div className="bg-surface-elevated rounded-lg h-6 w-24 animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
        
        {/* Animated dots */}
        <div className="flex justify-center items-center space-x-2 mt-2">
          <span className="text-primary font-semibold" translate="no">Ładowanie...</span>
          <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
          <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '250ms'}}></span>
          <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{animationDelay: '500ms'}}></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
