'use client';

interface Props {
  tocVisible: boolean;
  onToggle: () => void;
}

export default function FloatingTocButton({ tocVisible, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={tocVisible}
      aria-label={tocVisible ? 'Hide table of contents' : 'Show table of contents'}
      className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground hover:border-orange-400 hover:text-orange-500 transition-all active:scale-95"
    >
      <svg
        width="15" height="15"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="shrink-0"
      >
        <path d="M2 4h12M2 8h8M2 12h5" />
      </svg>
      <span>{tocVisible ? 'Hide contents' : 'Show contents'}</span>
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
          tocVisible ? 'bg-orange-500' : 'bg-muted-foreground/30'
        }`}
      />
    </button>
  );
}