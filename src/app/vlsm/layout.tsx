import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'VLSM Calculator — Variable Length Subnet Mask Planner',
  description: 'Free VLSM calculator and variable length subnet mask planner. Input department host requirements, auto-allocate optimally-sized subnets, and visualize address space efficiency. Ideal for CCNA and network node architects.',
  keywords: ['VLSM calculator', 'variable length subnet mask', 'network node architect', 'subnet planner', 'CIDR subnet allocator'],
  alternates: {
    canonical: 'https://subnetmask.tech/vlsm',
  },
  openGraph: {
    title: 'VLSM Calculator — Variable Length Subnet Mask Planner | Subnetmask.tech',
    description: 'Free VLSM calculator and variable length subnet mask planner. Auto-allocate optimally-sized subnets from a parent CIDR block.',
    url: 'https://subnetmask.tech/vlsm',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'VLSM Subnet Planner — Subnetmask.tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VLSM Calculator — Variable Length Subnet Mask Planner | Subnetmask.tech',
    description: 'Auto-allocate optimally-sized subnets from a parent CIDR block using variable length subnet masking.',
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'VLSM Subnet Planner',
  url: 'https://subnetmask.tech/vlsm',
  description: 'Free variable length subnet mask (VLSM) planner. Input department host requirements and auto-allocate optimally-sized subnets from any parent CIDR block.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Largest-first VLSM allocation algorithm',
    'Visual subnet topology tree',
    'Slack / unallocated fragment detection',
    'Export-ready network table',
  ],
};

export default function VlsmLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script
        id="vlsm-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
