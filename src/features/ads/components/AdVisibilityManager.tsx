import React from 'react';
import { useAdVisibility } from '../hooks/useAdVisibility';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AdVisibilityManagerProps {
  className?: string;
}

/**
 * AdVisibilityManager component
 * 
 * This component provides an admin interface to control which ad placeholders
 * are visible on the site. It should only be used in admin pages.
 */
const AdVisibilityManager: React.FC<AdVisibilityManagerProps> = ({ className = '' }) => {
  const {
    visibilityConfig,
    setAdSpaceVisibility,
    resetVisibilityConfig,
    isInitialized
  } = useAdVisibility();

  if (!isInitialized) {
    return <div>Loading ad visibility settings...</div>;
  }

  const handleToggleVisibility = (label: string) => {
    setAdSpaceVisibility(label, !visibilityConfig[label]);
    toast.success(`${label} visibility updated`);
  };

  const handleResetConfig = () => {
    resetVisibilityConfig();
    toast.success('Ad visibility settings reset to default');
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Ad Placeholder Visibility</CardTitle>
        <CardDescription>
          Control which ad placeholders are visible on the site. 
          Hidden placeholders will not take up any space in the layout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(visibilityConfig).map(([label, isVisible]) => (
            <div key={label} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={`ad-visibility-${label}`}>{label}</Label>
                <p className="text-sm text-muted-foreground">
                  {isVisible ? 'Currently visible' : 'Currently hidden'}
                </p>
              </div>
              <Switch
                id={`ad-visibility-${label}`}
                checked={isVisible}
                onCheckedChange={() => handleToggleVisibility(label)}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleResetConfig}>
          Reset to Default
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdVisibilityManager;
