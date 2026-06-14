import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AdSlot } from '../../components/ClientLayoutWrapper';

export const metadata: Metadata = {
  title: 'IPv4 Subnetting Tutorial & CIDR Notation Reference Guide',
  description: 'Complete IPv4 subnetting tutorial and CIDR notation reference guide for CCNA and network engineers. Covers IP classes, bitwise subnet math, /8 to /32 prefix cheat sheet, and modern IPv6 allocation standards.',
  keywords: ['IPv4 subnetting tutorial', 'learn CIDR notation', 'CCNA subnetting guide', 'network engineering reference', 'subnet mask cheat sheet', 'IPv4 networking manual'],
  alternates: {
    canonical: 'https://subnetmask.tech/guide',
  },
  openGraph: {
    title: 'IPv4 Subnetting Tutorial & CIDR Notation Reference Guide | Subnetmask.tech',
    description: 'Complete IPv4 subnetting tutorial covering IP classes, bitwise subnet math, and CIDR notation. CCNA network engineering reference guide.',
    url: 'https://subnetmask.tech/guide',
    type: 'article',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'IPv4 Subnetting Guide — Subnetmask.tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IPv4 Subnetting Tutorial & CIDR Notation Reference Guide | Subnetmask.tech',
    description: 'Complete IPv4 subnetting tutorial and CIDR notation reference for CCNA and network engineers.',
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'IPv4 Subnetting Tutorial & CIDR Notation Reference Guide',
  description: 'A complete technical knowledge base covering IP address architecture, bitwise subnet mathematics, step-by-step subnetting procedures, and modern IPv6 allocation standards. Designed for network architects, systems engineers, and DevOps practitioners.',
  url: 'https://subnetmask.tech/guide',
  publisher: {
    '@type': 'Organization',
    name: 'Subnetmask.tech',
    url: 'https://subnetmask.tech',
  },
  about: [
    { '@type': 'Thing', name: 'IPv4 Subnetting' },
    { '@type': 'Thing', name: 'CIDR Notation' },
    { '@type': 'Thing', name: 'Subnet Mask' },
    { '@type': 'Thing', name: 'CCNA Networking' },
  ],
  audience: {
    '@type': 'Audience',
    audienceType: 'Network Engineers, DevOps, Systems Administrators, CCNA Students',
  },
};

export default function GuideLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        id="guide-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AdSlot type="banner" className="mb-6" />
      {children}
    </>
  );
}
