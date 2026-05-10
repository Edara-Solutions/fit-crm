export function Breadcrumbs({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">
      Root <span className="text-gray-700">/</span> {label}
    </div>
  );
}
