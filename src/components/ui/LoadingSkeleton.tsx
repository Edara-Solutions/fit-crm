export function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-14 animate-pulse rounded border border-border-subtle bg-white/5" />
      ))}
    </div>
  );
}
