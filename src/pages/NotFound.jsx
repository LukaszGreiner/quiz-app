function NotFound() {
  return (
    <div className="flex h-100 flex-col items-center justify-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <h2 className="mb-4 text-2xl font-semibold text-gray-600">
        Page Not Found
      </h2>
      <p className="mb-6 text-lg text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="bg-primary hover:bg-primary/90 inline-block rounded-md px-6 py-2 text-white transition-colors"
      >
        Back to Home
      </a>
    </div>
  );
}

export default NotFound;
