function LoadingSpinner({ message = "Ładowanie..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Spinning loader */}
        <div className="border-primary/20 border-t-primary h-12 w-12 animate-spin rounded-full border-4"></div>
        <p className="text-text-muted text-lg">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
