import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

export function Button({ className, variant = 'primary', icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-brand text-white shadow-lg shadow-brand/20 hover:bg-[#E9514B]',
        variant === 'secondary' && 'border border-border-subtle bg-panel text-gray-300 hover:bg-white/5',
        variant === 'ghost' && 'text-gray-400 hover:bg-white/5 hover:text-white',
        variant === 'danger' && 'bg-[#621212] text-white hover:bg-brand',
        className,
      )}
      type={props.type ?? 'button'}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
