import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';

const AdPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Advertising Policy</h1>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Our Advertising Approach</h2>
              <p className="text-gray-700 mb-4">
                The N.B.K.R.I.S.T Student Portal uses advertisements to support the maintenance and
                development of this free service. We are committed to providing a good user experience
                while balancing the need for advertising revenue.
              </p>
              <p className="text-gray-700">
                All advertisements on this site comply with Google AdSense policies and are designed
                to be non-intrusive and relevant to our users.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Ad Placement</h2>
              <p className="text-gray-700 mb-4">
                We carefully place advertisements in designated areas of our website to ensure they
                do not interfere with the core functionality of the student portal. Ads are clearly
                labeled as "Advertisement" to distinguish them from our content.
              </p>
              <p className="text-gray-700 mb-2">
                Our ad placements include:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-2 mb-4">
                <li>Banner ads at the top and bottom of pages</li>
                <li>In-content ads between sections of content</li>
                <li>Side ads on desktop views</li>
                <li>Mobile-specific ads optimized for smaller screens</li>
              </ul>
              <p className="text-gray-700">
                <strong>Important:</strong> We only display ads on pages with substantial content. Ads will not be shown during loading screens,
                on error pages, or on pages with minimal content. This ensures compliance with Google AdSense policies and provides a better user experience.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">User Privacy</h2>
              <p className="text-gray-700 mb-4">
                We respect your privacy. The advertisements on our site may use cookies to provide
                more relevant ads based on your browsing behavior. This is standard practice for
                online advertising.
              </p>
              <p className="text-gray-700">
                We do not share your personal information with advertisers. Any data collected
                through our advertising partners is subject to their respective privacy policies.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Google AdSense Compliance</h2>
              <p className="text-gray-700 mb-4">
                We strictly adhere to Google AdSense policies, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-2">
                <li>Not displaying ads on pages without substantial publisher content</li>
                <li>Not showing ads on error pages or during loading states</li>
                <li>Ensuring ads are clearly labeled and distinguishable from content</li>
                <li>Not encouraging accidental clicks or implementing deceptive layouts</li>
                <li>Respecting content policies regarding prohibited content</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Feedback</h2>
              <p className="text-gray-700 mb-4">
                We value your feedback on our advertising approach. If you encounter any issues
                with advertisements on our site, such as inappropriate content or technical problems,
                please contact us through our <a href="/contact" className="text-nbkr hover:underline">Contact Page</a>.
              </p>
              <p className="text-gray-700">
                Thank you for understanding our need to include advertisements to support this free service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdPolicy;
