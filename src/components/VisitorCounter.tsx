import React from 'react';
import { useVisitorCount } from '@/hooks/use-visitor-count';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users } from 'lucide-react';

interface VisitorCounterProps {
  className?: string;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({ className }) => {
  const { visitorCount, isLoading, error } = useVisitorCount();

  if (error) {
    console.error('Visitor counter error:', error);
    return null; // Don't show anything if there's an error
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`fixed bottom-6 right-20 bg-nbkr text-white p-2 rounded-full shadow-lg hover:bg-nbkr-dark transition-colors z-50 flex items-center justify-center ${className}`}
            aria-label="Users Online"
          >
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                <Badge variant="secondary" className="bg-white text-nbkr">
                  {visitorCount}
                </Badge>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Users Online</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VisitorCounter;
