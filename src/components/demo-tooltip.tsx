'use client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface DemoTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function DemoTooltip({ content, children, side = 'top' }: DemoTooltipProps) {
  return (
    <div className="flex items-center gap-2">
      {children}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary-10)] hover:bg-[var(--primary-20)] transition-colors flex-shrink-0">
              <Info className="w-3 h-3 text-[var(--primary)]" />
            </button>
          </TooltipTrigger>
          <TooltipContent side={side} className="max-w-xs text-sm leading-relaxed">
            {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
