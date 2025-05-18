
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';
import VisitorCounter from './VisitorCounter';
import { AdsterraPopunder } from '@/features/ads';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const Layout = ({
  children,
  title,
  description,
  keywords,
  ogImage,
  ogType,
  publishedTime,
  modifiedTime
}: LayoutProps) => {
  return (
    <SEO
      title={title}
      description={description}
      keywords={keywords}
      ogImage={ogImage}
      ogType={ogType}
      publishedTime={publishedTime}
      modifiedTime={modifiedTime}
    >
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <VisitorCounter />
        {/* Site-wide Adsterra Popunder */}
        <AdsterraPopunder scriptSrc="//pl26676210.profitableratecpm.com/0e/9e/cd/0e9ecdba3847d3f45ee011044c34ac2e.js" />
      </div>
    </SEO>
  );
};

export default Layout;
