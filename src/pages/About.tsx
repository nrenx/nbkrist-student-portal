
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { AdBanner } from '@/features/ads';
import { useIsMobile } from '@/hooks/use-mobile';

const About = () => {
  const isMobile = useIsMobile();

  return (
    <Layout
      title="About NBKRIST | NBKR Institute of Science & Technology"
      description="Learn about NBKR Institute of Science & Technology (NBKRIST), established in 1979, one of the premier engineering institutions in Andhra Pradesh."
      keywords="nbkr, nbkrist, nbkr college, nbkr engineering college, nbkr ist, nbkr institute of science and technology"
      ogImage="https://nbkrstudenthub.me/NBKRIST_logo.png"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">About N.B.K.R.I.S.T</h1>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Our Institution</h2>
              <p className="text-gray-700 mb-4">
                N.B.K.R. Institute of Science & Technology (N.B.K.R.I.S.T), established in 1979, is one of the premier
                engineering institutions in Andhra Pradesh. The institute offers undergraduate, postgraduate and doctoral
                programs in various disciplines of engineering and science.
              </p>
              <p className="text-gray-700">
                The institution is committed to providing quality education with state-of-the-art infrastructure,
                well-qualified and experienced faculty, well-equipped laboratories, and a well-stocked library.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Our Vision</h2>
              <p className="text-gray-700">
                To be a premier technological institute striving for excellence with global perspective and commitment
                to the nation.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>To impart quality technical education through experiential learning.</li>
                <li>To foster innovation through research and development.</li>
                <li>To inculcate holistic approach for problem solving with ethical values.</li>
                <li>To address societal challenges through collaborative activities.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Student Portal</h2>
              <p className="text-gray-700 mb-4">
                The N.B.K.R.I.S.T Student Portal provides students with easy access to their academic information,
                attendance records, examination results, and other important details. This portal aims to streamline
                the communication between the institution and its students.
              </p>
              <p className="text-gray-700">
                For any technical issues related to the portal, please contact the IT support team at
                it.support@nbkrist.ac.in.
              </p>
            </CardContent>
          </Card>

          {/* Post-search ad - high engagement area */}
          <div className="mt-8 mb-8">
            <AdBanner
              width="w-full"
              height="h-auto"
              slotId="2501197332"
              network="google"
              adConfig={{
                'data-ad-client': 'ca-pub-7831792005606531',
                'data-ad-slot': '2501197332',
                'data-ad-format': 'auto',
                'data-full-width-responsive': 'true'
              }}
            />
          </div>

          {/* Bottom Banner Ad */}
          <div className="mt-8">
            <AdBanner
              width="w-full"
              height="h-auto"
              slotId="8416703140"
              network="google"
              adConfig={{
                'data-ad-client': 'ca-pub-7831792005606531',
                'data-ad-slot': '8416703140',
                'data-ad-format': 'auto',
                'data-full-width-responsive': 'true'
              }}
            />
          </div>

          {/* Mobile Banner ad - for mobile users */}
          {isMobile && (
            <div className="mt-8">
              <AdBanner
                width="w-full"
                height="h-auto"
                slotId="8380435316"
                network="google"
                adConfig={{
                  'data-ad-client': 'ca-pub-7831792005606531',
                  'data-ad-slot': '8380435316',
                  'data-ad-format': 'auto',
                  'data-full-width-responsive': 'true'
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default About;
