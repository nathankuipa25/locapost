export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-1 px-5 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs text-neutral-400">
          &copy; {year} Nattixlabs. All rights reserved.
        </p>

        <p className="text-xs text-neutral-400">
          LocaPost — write. link. share.
        </p>
      </div>
    </footer>
  );
}
