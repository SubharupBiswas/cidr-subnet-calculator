import type { Metadata } from 'next';
import '../index.css';
import { ClientLayoutWrapper } from '../components/ClientLayoutWrapper';

export const metadata: Metadata = {
  title: 'Advanced IPv4 CIDR Calculator & Subnet Splitter | Subnetmask.tech',
  description: 'An enterprise-grade client-side IPv4 CIDR calculator and subnetwork engine. Features interactive 32-bit bit-toggling matrices, live visual splits, wildcard mask resolution, hex conversions, and responsive light/dark design sheets.',
  openGraph: {
    title: 'Advanced IPv4 CIDR Calculator & Subnet Splitter | Subnetmask.tech',
    description: 'An enterprise-grade client-side IPv4 CIDR calculator and subnetwork engine. Features interactive 32-bit bit-toggling matrices, live visual splits, wildcard mask resolution, hex conversions, and responsive light/dark design sheets.',
    url: 'https://subnetmask.tech',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('cidr_calc_theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
