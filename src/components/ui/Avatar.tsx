export function Avatar({ name }: { name?: string | null }) {
  const safeName = name?.trim() || 'Unknown User';
  const initials = safeName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-bg-deep text-[10px] font-black text-white ring-1 ring-border-subtle">
      {initials}
    </div>
  );
}
