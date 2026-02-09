import type { Metadata } from 'next';
  import { GeistMono } from 'geist/font/mono';
  import './globals.css';
  import { VisualEditsManager } from '@/components/VisualEditsClient';
  import ErrorReporter from '@/components/ErrorReporter';
  import Script from 'next/script';

  export const metadata: Metadata = {
  title: 'Built by Pastel',
  description: '',
  };

  export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
  <html lang="en">
  <body className={`${GeistMono.variable} ${GeistMono.className} antialiased`}>
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
