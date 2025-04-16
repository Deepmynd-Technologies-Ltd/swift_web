
import React from 'react';
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import FAQSection from '../../components/FAQSection';
import AppDownloadSection from '../../components/AppDownloadSection';
import TestimonialsSection from '../../components/TestimonialsSection';
import FooterSection from '../../components/FooterSection';
import AboutHeroSection from '../../components/AboutHeroSection';
import ContactUs from '../../components/ContactUs'

const Index = () => {
  const path = window.location.pathname;
  let section;
  if (path === '/products') {
    section = (
      <>
        <HeroSection />
        <TestimonialsSection />
      </>
    );
  } else if (path === '/about-us') {
    section = (
      <>
        <AboutHeroSection />
        <TestimonialsSection />
      </>
      );
  } else if (path === '/contact-us') {
    section = <ContactUs  />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        {section}
        <FAQSection />
        <AppDownloadSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
