import type { Metadata } from 'next';
  import { Inter, Instrument_Serif } from 'next/font/google';
  import './globals.css';
  import VisualEditsManager from '../visual-edits/VisualEditsManager';
  import ErrorReporter from '@/components/ErrorReporter';
  import Script from 'next/script';

  const interSans = Inter({
  variable: '--font-inter-sans',
  subsets: ['latin'],
  });

  const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  });

  export const metadata: Metadata = {
  title: 'Built by Pastel',
  description: '',
  };

  export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
  <html lang="en">
  <body className={`${interSans.variable} ${instrumentSerif.variable} antialiased`}>
  <ErrorReporter />
  <Script
  src="https://lgnyaweewkitdrnkextq.supabase.co/storage/v1/object/public/Public/route-messenger.js"
  strategy="afterInteractive"
  data-target-origin="*"
  data-message-type="ROUTE_CHANGE"
  data-include-search-params="true"
  data-only-in-iframe="true"
  data-debug="true"
          />
  {children}
  <VisualEditsManager />
  </body>
  </html>
  );
  }
