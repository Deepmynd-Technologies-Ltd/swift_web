
import React from 'react';
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import FAQSection from '../../components/FAQSection';
import AppDownloadSection from '../../components/AppDownloadSection';
import TestimonialsSection from '../../components/TestimonialsSection';
import FooterSection from '../../components/FooterSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <HeroSection />
        <TestimonialsSection />
        <FAQSection />
        <AppDownloadSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
