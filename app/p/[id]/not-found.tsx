import Link from "next/link";

export default function PostNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Post not found
        </h1>

        <p className="mt-2 text-gray-500">
          This LocaPost doesn't exist or is no longer available.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-gray-900 underline"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}