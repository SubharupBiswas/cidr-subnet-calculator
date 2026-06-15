export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-slate-700 font-sans leading-relaxed">
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-heading)] mb-6">Privacy Policy</h1>
      
      <p className="mb-4 text-[var(--color-text-main)]">
        At subnetmask.tech, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
      </p>

      <h2 className="text-xl font-bold text-[var(--color-text-heading)] mt-8 mb-4">Information Collection</h2>
      <p className="mb-4 text-[var(--color-text-main)]">
        Our core subnet calculation tool operates entirely client-side. We do not transmit or store your IP addresses, subnet queries, or network data on our servers.
      </p>

      <h2 className="text-xl font-bold text-[var(--color-text-heading)] mt-8 mb-4">Google AdSense and DoubleClick DART Cookies</h2>
      <p className="mb-4 text-[var(--color-text-main)]">
        This site uses Google AdSense as a third-party vendor to serve ads. Google uses cookies, specifically the DoubleClick DART cookie, to serve personalized placement cards based on your prior visits to our website and other sites on the internet.
      </p>
      <ul className="list-disc pl-6 mb-4 text-[var(--color-text-main)] space-y-2">
        <li>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
        <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
        <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</li>
      </ul>

      <h2 className="text-xl font-bold text-[var(--color-text-heading)] mt-8 mb-4">Changes to This Policy</h2>
      <p className="mb-4 text-[var(--color-text-main)]">
        We may update this Privacy Policy from time to time. We encourage you to review this page periodically for any changes.
      </p>
    </div>
  );
}
