import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AdSlot } from '../../components/ClientLayoutWrapper';

export const metadata: Metadata = {
  title: 'Embeddable Subnet Calculator Widget — Free iframe Builder',
  description: 'Generate a free embeddable IPv4 subnet calculator widget for your documentation portal, developer hub, or internal dashboard. Zero-latency, client-side, fully responsive iframe snippet builder.',
  keywords: ['embeddable subnet calculator', 'free network iframe widget', 'subnet calculator widget', 'CIDR calculator embed', 'network tool iframe'],
  alternates: {
    canonical: 'https://subnetmask.tech/widget',
  },
  openGraph: {
    title: 'Embeddable Subnet Calculator Widget — Free iframe Builder | Subnetmask.tech',
    description: 'Generate a free embeddable IPv4 subnet calculator iframe for your docs site or developer hub. Zero-latency, client-side, fully responsive.',
    url: 'https://subnetmask.tech/widget',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Embeddable Subnet Calculator Widget — Subnetmask.tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Embeddable Subnet Calculator Widget — Free iframe Builder | Subnetmask.tech',
    description: 'Generate a free embeddable IPv4 subnet calculator iframe for docs sites and developer dashboards.',
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Embeddable Subnet Calculator Widget',
  url: 'https://subnetmask.tech/widget',
  description: 'Free embeddable IPv4 subnet calculator widget. Generate a ready-to-paste iframe snippet for documentation portals, developer hubs, and internal dashboards.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'One-click iframe embed code generation',
    'Live interactive sandbox preview',
    'Fully responsive, client-side rendering',
    'Zero external API dependencies',
  ],
};

export default function WidgetLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        id="widget-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AdSlot type="banner" className="mb-6" />
      {children}
    </>
  );
}
