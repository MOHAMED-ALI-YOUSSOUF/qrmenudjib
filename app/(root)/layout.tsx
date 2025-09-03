import '../globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';


export const metadata: Metadata = {
  title: 'QRMenu - Menu QR Code pour Restaurants',
  description: 'Plateforme SaaS permettant aux restaurants de Djibouti de gérer et afficher leur menu via QR Code',
  keywords: ['restaurant', 'menu', 'QR code', 'Djibouti', 'SaaS'],
  authors: [{ name: 'Mohamed Ali Youssouf' }],
  creator: 'mohamed-ali-youssouf.com',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://qrmenu.rohaty.com',
    title: 'QRMenu - Menu QR Code pour Restaurants',
    description: 'Plateforme SaaS permettant aux restaurants de Djibouti de gérer et afficher leur menu via QR Code',
    siteName: 'QRMenu.dj',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QRMenu - Menu QR Code pour Restaurants',
    description: 'Plateforme SaaS permettant aux restaurants de Djibouti de gérer et afficher leur menu via QR Code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
       <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          > 
             <div className="flex flex-col min-h-screen">
              <main className="flex-grow">{children}</main>
            </div>
            <Toaster />
        </ThemeProvider> 
  );
}