// app/page.tsx or the main file
"use client";

import { FinalCTA } from '@/components/landingPage/cta';
import { DashboardPreview } from '@/components/landingPage/dashboardPreview';
import { Features } from '@/components/landingPage/features';
import { Footer } from '@/components/landingPage/footer';
import { Hero } from '@/components/landingPage/hero';
import { HowItWorks } from '@/components/landingPage/howitworks';
import { Nav } from '@/components/landingPage/nav';
import { Testimonials } from '@/components/landingPage/testimonials';
import React from 'react';


const QRMenuLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Features />
      <DashboardPreview />
      <HowItWorks />
      <Testimonials />
      {/* <Pricing /> */}
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default QRMenuLanding;