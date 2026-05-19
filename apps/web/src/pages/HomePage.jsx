import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PortalBudayaKeerom from '@/components/PortalBudayaKeerom.jsx';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Portal Budaya Keerom - Jelajahi Bahasa Suku</title>
        <meta 
          name="description" 
          content="Eksplorasi kekayaan bahasa dan tradisi lisan dari berbagai suku asli di wilayah Kabupaten Keerom, Papua." 
        />
      </Helmet>
      
      <div className="flex-1 flex flex-col w-full bg-background">
        <Header />
        <main className="flex-1 flex flex-col w-full">
          <PortalBudayaKeerom />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;