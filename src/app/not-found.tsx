import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 text-white p-6 text-center">
      <h1 className="text-6xl font-black text-brand-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-full bg-gradient-to-r from-brand-600 to-ocean px-6 py-3 font-semibold text-white shadow-lg hover:opacity-90 transition-all"
      >
        Return Home
      </Link>
    </div>
  );
}
