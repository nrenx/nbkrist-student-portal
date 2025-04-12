import React from 'react';
import { useAdPreferences, AdPreferenceType } from '@/hooks/useAdPreferences';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AdPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdPreferencesDialog = ({ open, onOpenChange }: AdPreferencesDialogProps) => {
  const {
    preferences,
    isAdTypeAllowed,
    toggleAdType,
    toggleReducedMotion,
    resetPreferences,
    isInitialized
  } = useAdPreferences();

  if (!isInitialized) {
    return null;
  }

  const handleToggleAdType = (type: AdPreferenceType) => {
    toggleAdType(type);
  };

  const handleResetPreferences = () => {
    resetPreferences();
    toast.success('Ad preferences have been reset to default');
  };

  const adTypeLabels: Record<AdPreferenceType, string> = {
    'all': 'All Advertisements',
    'standard': 'Standard Ads',
    'interstitial': 'Full-screen Ads',
    'exit-intent': 'Exit Intent Ads',
    'push-notification': 'Notification-style Ads',
    'floating-footer': 'Footer Ads',
    'sticky': 'Sticky Ads'
  };

  const adTypeDescriptions: Record<AdPreferenceType, string> = {
    'all': 'Control all types of advertisements on the site',
    'standard': 'Regular banner ads throughout the site',
    'interstitial': 'Full-screen ads that appear during page transitions',
    'exit-intent': 'Ads that appear when you try to leave the site',
    'push-notification': 'Small notification-style ads in the corner',
    'floating-footer': 'Ads that appear at the bottom of the screen',
    'sticky': 'Ads that stick to the screen as you scroll'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ad Preferences</DialogTitle>
          <DialogDescription>
            Customize your ad experience. Toggle which types of ads you'd like to see.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-4">
            {Object.entries(adTypeLabels).map(([type, label]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor={`ad-type-${type}`}>{label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {adTypeDescriptions[type as AdPreferenceType]}
                  </p>
                </div>
                <Switch
                  id={`ad-type-${type}`}
                  checked={isAdTypeAllowed(type as AdPreferenceType)}
                  onCheckedChange={() => handleToggleAdType(type as AdPreferenceType)}
                />
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Prefer simpler animations for ads
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={preferences.reducedMotion}
              onCheckedChange={toggleReducedMotion}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleResetPreferences}>
            Reset to Default
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdPreferencesDialog;
