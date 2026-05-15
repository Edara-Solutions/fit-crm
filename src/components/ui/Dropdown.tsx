import type { ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';
import { IconButton } from './IconButton';

export function Dropdown({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2">
      {children}
      {/* <IconButton label="Open actions">
        <MoreVertical className="h-4 w-4" />
      </IconButton> */}
    </div>
  );
}
