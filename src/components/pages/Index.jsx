
import React from 'react';
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import FeaturesSection from '../../components/FeaturesSection';
import StatsSection from '../../components/StatsSection';
import HowItWorksSection from '../../components/HowItWorksSection';
import TestimonialsSection from '../../components/TestimonialsSection';
import CTASection from '../../components/CTASection';
import FooterSection from '../../components/FooterSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-swiftaza-dark text-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
