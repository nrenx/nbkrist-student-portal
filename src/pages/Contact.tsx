
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { AdBanner } from '@/features/ads';
import { useIsMobile } from '@/hooks/use-mobile';

const Contact = () => {
  const isMobile = useIsMobile();

  // Add LocalBusiness structured data for better SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "N.B.K.R. Institute of Science & Technology",
      "url": "https://nbkrstudenthub.me",
      "logo": "https://nbkrstudenthub.me/NBKRIST_logo.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Vidyanagar",
        "addressLocality": "SPSR Nellore District",
        "addressRegion": "Andhra Pradesh",
        "postalCode": "524413",
        "addressCountry": "IN"
      },
      "telephone": "+91 1234567890",
      "email": "info@nbkrist.ac.in",
      "openingHours": [
        "Mo-Fr 09:00-17:00",
        "Sa 09:00-13:00"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91 9849839819",
        "contactType": "customer service",
        "availableLanguage": ["English", "Telugu"]
      }
    };

    let script = document.querySelector('#contact-structured-data') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'contact-structured-data';
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    } else {
      script.textContent = JSON.stringify(structuredData);
    }

    return () => {
      // Clean up on unmount
      const scriptToRemove = document.querySelector('#contact-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent. We'll get back to you soon!");
    // In a real application, this would send the form data to your backend
  };

  return (
    <Layout
      title="Contact NBKRIST | Get in Touch with NBKR Student Hub"
      description="Contact NBKR Institute of Science & Technology for inquiries about admissions, academics, or technical support. Reach us via phone, email, or our contact form."
      keywords="nbkr contact, nbkrist contact, nbkr student portal contact, nbkr ist contact, nbkr institute contact, nbkr help"
      ogType="website"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Admin Contact Banner - Prominent at the top */}
          <div className="bg-green-50 rounded-lg shadow-lg border border-green-200 overflow-hidden mb-10">
            <div className="bg-green-600 py-3 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Admin Contact
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Need help with the student portal?</h3>
                  <p className="text-gray-600 mb-2">Contact admin directly via WhatsApp if you need to update details or find any issues:</p>
                  <p className="text-2xl font-bold text-green-600">9849839819</p>
                  <p className="text-sm text-gray-500 mt-2">WhatsApp messages only.</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <a
                    href="https://wa.me/919849839819"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <Input id="name" placeholder="Enter your name" required />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input id="email" type="email" placeholder="Enter your email" required />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <Input id="subject" placeholder="Enter subject" required />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea id="message" placeholder="Enter your message" rows={5} required />
                  </div>

                  <Button type="submit" className="w-full bg-nbkr hover:bg-nbkr-dark">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-nbkr mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600 mt-1">
                        N.B.K.R. Institute of Science & Technology, Vidyanagar,<br />
                        SPSR Nellore District, Andhra Pradesh - 524413
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-nbkr mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600 mt-1">
                        +91 1234567890<br />
                        +91 9876543210
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-nbkr mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600 mt-1">
                        info@nbkrist.ac.in<br />
                        admissions@nbkrist.ac.in
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-nbkr mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Office Hours</h3>
                      <p className="text-gray-600 mt-1">
                        Monday - Friday: 9:00 AM - 5:00 PM<br />
                        Saturday: 9:00 AM - 1:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>


                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-w-16 aspect-h-9 w-full h-96">
                  {/* Replace with actual Google Maps embed or other map service */}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <p>Google Maps will be embedded here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Post-search ad - high engagement area */}
          <div className="mt-8">
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

export default Contact;
