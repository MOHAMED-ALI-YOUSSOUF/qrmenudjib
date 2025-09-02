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



const previewItems = [
  {
    title: "Dashboard",
    imageLight: "/images/dashboard-light.png",
    imageDark: "/images/dashboard-dark.png",
  },
  {
    title: "Plats",
    imageLight: "/images/plats-light.png",
    imageDark: "/images/plats-dark.png",
  },
  {
    title: "QR Code",
    imageLight: "/images/qrcode-light.png",
    imageDark: "/images/qrcode-dark.png",
  },
  {
    title: "Paramètres",
    imageLight: "/images/settings-light.png",
    imageDark: "/images/settings-dark.png",
  },
];




const QRMenuLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Features />
      <DashboardPreview items={previewItems}/>

      <HowItWorks />
      <Testimonials />
      {/* <Pricing /> */}
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default QRMenuLanding;