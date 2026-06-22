import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '../index.css';
import { ClientLayoutWrapper } from '../components/ClientLayoutWrapper';
import Script from 'next/script';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://subnetmask.tech'),
  title: {
    template: '%s | Subnetmask.tech',
    default: 'Advanced IPv4 CIDR Calculator & Subnet Splitter | Subnetmask.tech',
  },
  description: 'Free online IPv4 subnet calculator and CIDR tool. Instantly compute network addresses, broadcast addresses, subnet masks, wildcard masks, usable host ranges, and binary breakdowns. Trusted by network architects and CCNA engineers.',
  keywords: ['CIDR calculator', 'IPv4 subnet calculator', 'online network calculator', 'subnet mask tool', 'subnetting online'],
  alternates: {
    canonical: 'https://subnetmask.tech',
  },
  openGraph: {
    title: 'Advanced IPv4 CIDR Calculator & Subnet Splitter | Subnetmask.tech',
    description: 'Free online IPv4 subnet calculator and CIDR tool. Compute network addresses, subnet masks, wildcard masks, and usable host ranges instantly.',
    url: 'https://subnetmask.tech',
    siteName: 'Subnetmask.tech',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Subnetmask.tech — Advanced IPv4 CIDR Calculator and Subnet Engineering Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced IPv4 CIDR Calculator & Subnet Splitter | Subnetmask.tech',
    description: 'Free online IPv4 subnet calculator and CIDR tool. Compute network addresses, subnet masks, and usable host ranges instantly.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          id="theme-initializer"
          suppressHydrationWarning={true}
          dangerouslySetInnerHTML={{
            __html: `try { if (localStorage.theme === 'dark') { document.documentElement.classList.add('dark') } else { document.documentElement.classList.remove('dark') } } catch (_) {}`
          }}
        />
      </head>
      <body className="antialiased subpixel-antialiased">
        <div className="min-h-screen">
        <Script
          id="site-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://subnetmask.tech/#website',
                  url: 'https://subnetmask.tech',
                  name: 'Subnetmask.tech',
                  description: 'Free online IPv4 CIDR subnet calculator, VLSM planner, MAC OUI lookup, and subnetting reference guide.',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: { '@type': 'EntryPoint', urlTemplate: 'https://subnetmask.tech/?ip={search_term_string}&prefix=24' },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'SoftwareApplication',
                  name: 'IPv4 CIDR Subnet Calculator',
                  url: 'https://subnetmask.tech',
                  description: 'Free online IPv4 subnet calculator. Compute network addresses, broadcast addresses, subnet masks, wildcard masks, usable host ranges, and binary representations instantly.',
                  applicationCategory: 'DeveloperApplication',
                  operatingSystem: 'All',
                  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                  featureList: [
                    'Real-time CIDR subnet calculation',
                    'Interactive 32-bit binary visualizer',
                    'Subnet splitter with prefix selection',
                    'Calculation history tracker',
                    'Hex IP conversion',
                    'IP class and address type detection',
                  ],
                },
              ],
            }),
          }}
        />
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
        <script 
          async
          id="adsense-init"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-production-id" 
          crossOrigin="anonymous" 
        ></script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-E1DP7MY3VW" strategy="lazyOnload" />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E1DP7MY3VW');
          `}
        </Script>
        </div>

      </body>
    </html>
  );
}
