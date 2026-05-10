import { ImagePlus } from 'lucide-react';

export function ImageUploader() {
  return (
    <div className="flex min-h-40 items-center justify-center rounded border border-dashed border-border-subtle bg-bg-deep/50 p-6 text-center">
      <div>
        <ImagePlus className="mx-auto mb-3 h-8 w-8 text-gray-600" />
        <p className="text-xs font-bold uppercase text-white">Upload product images</p>
        <p className="mt-1 text-[10px] text-gray-500">Drag images here or choose files when backend storage is connected.</p>
      </div>
    </div>
  );
}
