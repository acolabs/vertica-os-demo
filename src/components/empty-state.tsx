import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center mb-4 text-zinc-500">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-zinc-400 mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 text-center max-w-sm">{description}</p>
    </div>
  );
}
