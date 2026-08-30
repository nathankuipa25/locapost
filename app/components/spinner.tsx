type SpinnerProps = {
  className?: string;
};

export function Spinner({ className = "h-4 w-4" }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M12 2a10 10 0 0 1 10 10h-3.5A6.5 6.5 0 0 0 12 5.5V2Z"
      />
    </svg>
  );
}
