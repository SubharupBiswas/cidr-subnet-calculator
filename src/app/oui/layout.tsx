import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'MAC Address OUI Lookup — Offline Vendor Identifier',
  description: 'Free MAC address OUI lookup and vendor identifier tool. Instantly resolve any MAC address to its manufacturer using an offline hardcoded OUI dictionary. No API calls — works completely offline.',
  keywords: ['MAC address lookup', 'OUI vendor search', 'MAC manufacturer check offline', 'OUI lookup tool', 'MAC address decoder'],
  alternates: {
    canonical: 'https://subnetmask.tech/oui',
  },
  openGraph: {
    title: 'MAC Address OUI Lookup — Offline Vendor Identifier | Subnetmask.tech',
    description: 'Instantly resolve any MAC address to its manufacturer using an offline hardcoded OUI dictionary. No API calls required.',
    url: 'https://subnetmask.tech/oui',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'MAC OUI Vendor Lookup — Subnetmask.tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAC Address OUI Lookup — Offline Vendor Identifier | Subnetmask.tech',
    description: 'Instantly resolve any MAC address to its manufacturer with zero API calls.',
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MAC Address OUI Vendor Lookup',
  url: 'https://subnetmask.tech/oui',
  description: 'Free offline MAC address OUI lookup tool. Identify hardware manufacturers from any MAC address in any delimiter format — completely offline, no API calls required.',
  applicationCategory: 'NetworkingTool',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Offline OUI vendor dictionary',
    'Supports colon, dash, dot, and raw MAC formats',
    'Multicast and locally-administered bit detection',
    'Instant real-time lookup with zero latency',
  ],
};

export default function OuiLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script
        id="oui-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
