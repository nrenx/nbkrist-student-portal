import React from 'react';
import Layout from '@/components/Layout';
import FlowChart from '@/components/FlowChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AdPlaceholder } from '@/features/ads';

const FlowChartPage: React.FC = () => {
  return (
    <Layout
      title="How It Works | NBKRIST Student Portal"
      description="Interactive visual flowchart explaining how the NBKRIST Student Portal works. Learn about the data flow, student features, and admin functionality."
      keywords="nbkr, nbkrist, student portal, how it works, flowchart, data flow, system architecture"
      ogImage="https://nbkrstudenthub.me/NBKRIST_logo.png"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">How NBKR Student Portal Works</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Interactive System Flowchart</CardTitle>
              <CardDescription>
                Explore how the NBKRIST Student Portal works through this interactive visualization.
                Click on nodes to see more details, and use the controls to zoom and pan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[800px] w-full">
                <FlowChart />
              </div>
            </CardContent>
          </Card>

          <div className="my-8">
            <AdPlaceholder
              width="w-full"
              height="h-20"
              label="Post-flowchart Ad"
            />
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Understanding the System</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3>Student Features</h3>
              <p>
                Students can access their academic information in multiple ways:
              </p>
              <ul>
                <li><strong>Search by Roll Number</strong> - Directly access your information by entering your roll number</li>
                <li><strong>Search by Name</strong> - Find your roll number by searching with your name and academic year</li>
                <li><strong>Submit Content</strong> - Contribute to the platform by submitting blog posts or logo designs</li>
              </ul>

              <Separator className="my-6" />

              <h3>Data Flow</h3>
              <p>
                The system uses a sophisticated data pipeline:
              </p>
              <ol>
                <li>Admin triggers data update through the admin dashboard</li>
                <li>FlashAPI scripts run on Railway platform to scrape data from the college portal</li>
                <li>Data is processed and structured into JSON format</li>
                <li>Processed data is uploaded to Supabase storage</li>
                <li>Students can access this data through the web interface</li>
              </ol>

              <Separator className="my-6" />

              <h3>Admin Functionality</h3>
              <p>
                Administrators have special privileges:
              </p>
              <ul>
                <li><strong>Update Student Data</strong> - Trigger the data scraping and update process</li>
                <li><strong>Content Moderation</strong> - Review and approve blog posts and logo submissions</li>
                <li><strong>System Management</strong> - Monitor system performance and user activity</li>
              </ul>

              <Separator className="my-6" />

              <h3>Real-time Features</h3>
              <p>
                The portal includes real-time functionality:
              </p>
              <ul>
                <li><strong>Live Visitor Counter</strong> - See how many students are currently using the portal</li>
                <li><strong>Last Updated</strong> - Know when the academic data was last refreshed</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default FlowChartPage;
