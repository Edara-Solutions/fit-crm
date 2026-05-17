import { Image, Upload, X } from 'lucide-react';
import { useId, useRef } from 'react';
import { Button } from './Button';

type ImageUploadFieldProps = {
  label: string;
  previewUrl?: string;
  fileName?: string;
  fallbackText?: string;
  onChange: (file: File) => void;
  onClear?: () => void;
};

export function ImageUploadField({ label, previewUrl, fileName, fallbackText = 'No image selected', onChange, onClear }: ImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
      <div className="grid gap-3 rounded border border-border-subtle bg-bg-deep p-3 sm:grid-cols-[140px_minmax(0,1fr)]">
        <div className="flex h-32 items-center justify-center overflow-hidden rounded border border-border-subtle bg-panel">
          {previewUrl ? (
            <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Image className="h-7 w-7" />
              <span className="text-center text-[10px] font-bold uppercase tracking-widest">{fallbackText}</span>
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="truncate text-xs font-bold text-gray-200">{fileName || (previewUrl ? 'Current image' : fallbackText)}</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">JPG, PNG, or WebP. Max 5MB.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label htmlFor={inputId} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-border-subtle bg-panel px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-300 transition-colors hover:bg-white/5">
              <Upload className="h-4 w-4" />
              {previewUrl ? 'Change Image' : 'Upload Image'}
            </label>
            {fileName && onClear && (
              <Button
                variant="secondary"
                icon={<X className="h-4 w-4" />}
                onClick={() => {
                  if (inputRef.current) inputRef.current.value = '';
                  onClear();
                }}
              >
                Clear
              </Button>
            )}
          </div>
          <input
            id={inputId}
            ref={inputRef}
            className="sr-only"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onChange(file);
            }}
          />
        </div>
      </div>
    </div>
  );
}
