export function Connector({ label }: { label?: string }) {
  return (
    <div className="relative flex h-14 w-full flex-col items-center justify-center">
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line" />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <svg width="11" height="7" viewBox="0 0 11 7" aria-hidden="true">
          <path d="M5.5 7L0.3 0h10.4L5.5 7z" className="fill-line" />
        </svg>
      </span>
      {label ? (
        <span className="relative z-10 rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-muted-foreground">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export function BranchSplit() {
  return (
    <div className="relative h-8 w-full">
      <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-line" />
      <span className="absolute left-1/4 right-1/4 top-4 h-px bg-line" />
      <span className="absolute left-1/4 top-4 h-4 w-px bg-line" />
      <span className="absolute right-1/4 top-4 h-4 w-px bg-line" />
    </div>
  );
}

export function BranchMerge() {
  return (
    <div className="relative h-10 w-full">
      <span className="absolute left-1/4 top-0 h-4 w-px bg-line" />
      <span className="absolute right-1/4 top-0 h-4 w-px bg-line" />
      <span className="absolute left-1/4 right-1/4 top-4 h-px bg-line" />
      <span className="absolute left-1/2 top-4 h-6 w-px -translate-x-1/2 bg-line" />
    </div>
  );
}
