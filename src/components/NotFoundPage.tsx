import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <div className="min-h-screen page-bg">
      <div className="max-w-3xl mx-auto px-6 py-32">
        <h1 className="text-5xl md:text-6xl mb-6 text-foreground font-light tracking-tight">
          404
        </h1>
        <p className="text-lg text-subtle leading-relaxed mb-8">
          The page you're looking for doesn't exist. It might have been moved or
          deleted.
        </p>
        <Link
          to="/"
          className="relative group text-foreground hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300"
        >
          <span className="relative">
            Go back home
            <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-blue-700 dark:bg-blue-400 transition-all duration-300 ease-out group-hover:w-full"></span>
          </span>
        </Link>
      </div>
    </div>
  );
}
