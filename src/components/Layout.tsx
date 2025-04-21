
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
}

const Layout = ({
  children,
  title,
  description,
  keywords,
  ogImage,
  ogType
}: LayoutProps) => {
  return (
    <SEO
      title={title}
      description={description}
      keywords={keywords}
      ogImage={ogImage}
      ogType={ogType}
    >
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </SEO>
  );
};

export default Layout;
