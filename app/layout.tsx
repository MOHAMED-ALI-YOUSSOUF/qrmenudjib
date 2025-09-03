import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { SanityLive } from '@/sanity/lib/live';
import CustomSessionProvider from '@/components/SessionProvider';


const inter = Inter({ subsets: ['latin'] });

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
    <html lang="fr" suppressHydrationWarning>
        <body className={inter.className}>
        <CustomSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          
              <main className="flex-grow">{children}</main>
         
            <Toaster />
          </ThemeProvider>
          <SanityLive/>
   </CustomSessionProvider>
        </body>
      </html>
  );
}