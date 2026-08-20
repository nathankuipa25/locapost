import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5">
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-400">
          404
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Article not found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          This article doesn't exist or is no longer available.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}