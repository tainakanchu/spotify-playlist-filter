export const Progress: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <svg
        aria-label="Searching"
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
      >
        <title>Searching</title>
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8 8 0 0012 20v-4.291L6.709 17.5z"
        />
      </svg>
      <p>Searching...</p>
    </div>
  );
};
