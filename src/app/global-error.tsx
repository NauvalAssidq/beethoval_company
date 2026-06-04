"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-6">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
          <p className="text-lg text-gray-600 mb-8">
            Something went wrong. Please try again.
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
