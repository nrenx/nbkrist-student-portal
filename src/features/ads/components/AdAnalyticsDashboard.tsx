import React, { useState, useEffect } from 'react';
import { useAdPerformance } from '@/features/ads/hooks/useAdPerformance';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AdAnalyticsDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdAnalyticsDashboard = ({ open, onOpenChange }: AdAnalyticsDashboardProps) => {
  const { getAllMetrics, isInitialized } = useAdPerformance();
  const [metrics, setMetrics] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Load metrics when the dashboard is opened
  useEffect(() => {
    if (open && isInitialized) {
      setMetrics(getAllMetrics());
    }
  }, [open, isInitialized, getAllMetrics]);

  // Refresh metrics every 5 seconds when dashboard is open
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setMetrics(getAllMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, [open, getAllMetrics]);

  if (!isInitialized) {
    return null;
  }

  // Calculate summary metrics
  const calculateSummary = () => {
    const summary = {
      totalImpressions: 0,
      totalClicks: 0,
      totalViewTime: 0,
      averageViewability: 0,
      networks: new Set<string>(),
      adSlots: new Set<string>(),
      clickThroughRate: 0
    };

    let viewabilitySum = 0;
    let viewabilityCount = 0;

    Object.entries(metrics).forEach(([key, data]: [string, any]) => {
      const [network, adId] = key.split('_');
      
      summary.totalImpressions += data.impressions || 0;
      summary.totalClicks += data.clicks || 0;
      summary.totalViewTime += data.viewTime || 0;
      
      if (data.viewability > 0) {
        viewabilitySum += data.viewability;
        viewabilityCount++;
      }
      
      summary.networks.add(network);
      summary.adSlots.add(adId);
    });

    // Calculate average viewability
    summary.averageViewability = viewabilityCount > 0 ? viewabilitySum / viewabilityCount : 0;
    
    // Calculate click-through rate
    summary.clickThroughRate = summary.totalImpressions > 0 
      ? (summary.totalClicks / summary.totalImpressions) * 100 
      : 0;

    return summary;
  };

  const summary = calculateSummary();

  // Format metrics for display
  const formatMetrics = () => {
    return Object.entries(metrics).map(([key, data]: [string, any]) => {
      const [network, adId] = key.split('_');
      const ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
      
      return {
        id: key,
        network,
        adId,
        impressions: data.impressions || 0,
        clicks: data.clicks || 0,
        viewTime: data.viewTime || 0,
        viewability: data.viewability || 0,
        ctr: ctr.toFixed(2),
        lastUpdated: new Date(data.lastUpdated).toLocaleString()
      };
    }).sort((a, b) => b.impressions - a.impressions);
  };

  const formattedMetrics = formatMetrics();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ad Performance Analytics</DialogTitle>
          <DialogDescription>
            View performance metrics for ads across your site
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{summary.totalImpressions}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{summary.totalClicks}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">CTR</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{summary.clickThroughRate.toFixed(2)}%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">View Time</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{summary.totalViewTime}s</div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Ads</CardTitle>
                <CardDescription>Ads with the highest impressions and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ad Slot</TableHead>
                      <TableHead>Network</TableHead>
                      <TableHead>Impressions</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>CTR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formattedMetrics.slice(0, 5).map((metric) => (
                      <TableRow key={metric.id}>
                        <TableCell>{metric.adId}</TableCell>
                        <TableCell>{metric.network}</TableCell>
                        <TableCell>{metric.impressions}</TableCell>
                        <TableCell>{metric.clicks}</TableCell>
                        <TableCell>{metric.ctr}%</TableCell>
                      </TableRow>
                    ))}
                    {formattedMetrics.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">No data available yet</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Ad Performance</CardTitle>
                <CardDescription>Complete metrics for all ad slots</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ad Slot</TableHead>
                      <TableHead>Network</TableHead>
                      <TableHead>Impressions</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>CTR</TableHead>
                      <TableHead>View Time</TableHead>
                      <TableHead>Viewability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formattedMetrics.map((metric) => (
                      <TableRow key={metric.id}>
                        <TableCell>{metric.adId}</TableCell>
                        <TableCell>{metric.network}</TableCell>
                        <TableCell>{metric.impressions}</TableCell>
                        <TableCell>{metric.clicks}</TableCell>
                        <TableCell>{metric.ctr}%</TableCell>
                        <TableCell>{metric.viewTime}s</TableCell>
                        <TableCell>{metric.viewability.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                    {formattedMetrics.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">No data available yet</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleString()}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setMetrics(getAllMetrics())}
                >
                  Refresh Data
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdAnalyticsDashboard;
