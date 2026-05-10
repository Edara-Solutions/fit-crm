import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
}

export function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
        <Construction className="w-8 h-8 text-slate-400" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
        <p className="text-slate-500 max-w-xs mx-auto">
          We're currently refactoring this section to the new component-based structure. Check back soon!
        </p>
      </div>
      <button 
        onClick={() => window.history.back()}
        className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}
