import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Subnetmask.tech',
  description:
    'Privacy Policy for Subnetmask.tech. Covers data collection, Google AdSense, DoubleClick DART cookie usage, and user opt-out instructions.',
};

export default function PrivacyPage() {
  const lastUpdated = 'June 23, 2025';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 font-sans leading-relaxed">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-heading)] mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-10">Last updated: {lastUpdated}</p>

      <p className="mb-6 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        At <strong className="text-zinc-900 dark:text-zinc-100">Subnetmask.tech</strong>, we are committed to protecting
        your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices available
        to you as a visitor to our website. By using this site, you agree to the practices described in this policy.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-bold text-[var(--color-text-heading)] mt-10 mb-4">
        1. Core Application Data
      </h2>
      <p className="mb-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        The subnet calculator, VLSM splitter, binary visualizer, and MAC OUI lookup tools on this site operate
        <strong className="text-zinc-900 dark:text-zinc-100"> entirely client-side</strong> in your browser. We do not
        transmit, log, or store your IP addresses, subnet queries, network parameters, or any other data you enter
        into the calculator on our servers. All computation results are generated locally on your device.
      </p>
      <p className="mb-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        Calculation history is stored exclusively in your browser's <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">localStorage</code> and
        never transmitted to any external server. You can clear this data at any time using the &quot;Clear History&quot;
        button within the application, or by clearing your browser's site data.
      </p>

      {/* Section 2 */}
      <h2 className="text-xl font-bold text-[var(--color-text-heading)] mt-10 mb-4">
        2. Third-Party Advertising — Google AdSense
      </h2>
      <p className="mb-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        This website uses <strong className="text-zinc-900 dark:text-zinc-100">Google AdSense</strong> to display
        advertising. Google AdSense is a third-party advertising service operated by Google LLC. Through AdSense,
        Google and its advertising partners may use cookies, web beacons, and other tracking technologies to serve
        personalised advertisements to visitors based on their prior visits to this website and other websites
        across the Internet.
      </p>
      <p className="mb-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        Specifically, Google uses the <strong className="text-zinc-900 dark:text-zinc-100">DoubleClick DART cookie</strong> to
        serve ads to users based on their visit to subnetmask.tech and other sites on the Internet. The DART cookie
        is set by Google in the <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">doubleclick.net</code> domain.
        Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits
        to this and other websites on the Internet.
      </p>
      <p className="mb-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        Key points regarding third-party advertising on this site:
      </p>
      <ul className="list-disc pl-6 mb-6 flex flex-col gap-3 text-base text-zinc-700 dark:text-zinc-300">
        <li>
          Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to
          this website or other websites across the Internet.
        </li>
        <li>
          Google&apos;s use of the DoubleClick DART cookie enables it and its advertising partners to serve
          personalised ads to users based on their browsing history across sites in the Google Display Network.
        </li>
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">You may opt out of personalised advertising</strong> by
          visiting Google&apos;s{' '}
          <a
            href="https://www.google.com/settings/ads"
            className="text-cyan-700 dark:text-cyan-400 hover:underline font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ads Settings
          </a>. Alternatively, you may opt out of third-party vendor cookies by visiting the{' '}
          <a
            href="https://optout.networkadvertising.org/"
            className="text-cyan-700 dark:text-cyan-400 hover:underline font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Network Advertising Initiative opt-out page
          </a>.
        </li>
        <li>
          You can also prevent Google from using the DoubleClick DART cookie by visiting{' '}
          <a
            href="https://optout.aboutads.info/"
            className="text-cyan-700 dark:text-cyan-400 hover:underline font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info
          </a>{' '}
          and following the opt-out instructions.
        </li>
        <li>
          For more information on how Google processes data collected through AdSense, please review{' '}
          <a
            href="https://policies.google.com/privacy"
            className="text-cyan-700 dark:text-cyan-400 hover:underline font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&apos;s Privacy Policy
          </a>.
        </li>
      </ul>

      {/* Section 3 */}
      <h2 className="text-xl font-bold text-[var(--color-text-heading)] mt-10 mb-4">
        3. Google Analytics
      </h2>
      <p className="mb-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        This website uses <strong className="text-zinc-900 dark:text-zinc-100">Google Analytics</strong> to understand
        aggregate visitor behaviour — including page views, session duration, device types, and geographic regions.
        Google Analytics collects this information using cookies and similar tracking technologies. The data is
        anonymised and used exclusively to improve the quality and performance of this site.
      </p>
      <p className="mb-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        All Google Analytics and AdSense scripts on this site are loaded with the{' '}
        <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">lazyOnload</code> strategy,
        meaning they are deferred until the browser&apos;s main thread is completely idle. No third-party scripts
        are executed during the initial page render or before the page becomes interactive.
      </p>
      <p className="mb-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        You can opt out of Google Analytics tracking by installing the{' '}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          className="text-cyan-700 dark:text-cyan-400 hover:underline font-semibold"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Analytics Opt-out Browser Add-on
        </a>.
      </p>

      {/* Section 4 */}
      <h2 className="text-xl font-bold text-[var(--color-text-heading)] mt-10 mb-4">
        4. Cookies
      </h2>
      <p className="mb-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        Cookies are small text files placed on your device by websites you visit. This site uses the following
        categories of cookies:
      </p>
      <ul className="list-disc pl-6 mb-6 flex flex-col gap-3 text-base text-zinc-700 dark:text-zinc-300">
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">Essential cookies:</strong> A single theme preference
          value (<code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">localStorage.theme</code>)
          is stored to persist the user&apos;s dark or light mode selection. This is strictly functional and contains
          no personal data.
        </li>
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">Advertising cookies:</strong> Set by Google AdSense and
          the DoubleClick advertising network to serve and measure personalised advertisements. See Section 2 for
          detailed opt-out instructions.
        </li>
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">Analytics cookies:</strong> Set by Google Analytics to
          measure aggregate site usage. See Section 3 for opt-out options.
        </li>
      </ul>
      <p className="mb-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        You can configure your browser to refuse cookies, delete existing cookies, or alert you when cookies are
        being set. Please note that disabling certain cookies may affect the functionality of advertising features.
        Instructions for managing cookies in major browsers:
      </p>
      <ul className="list-disc pl-6 mb-6 flex flex-col gap-2 text-base text-zinc-700 dark:text-zinc-300">
        <li><a href="https://support.google.com/chrome/answer/95647" className="text-cyan-700 dark:text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-cyan-700 dark:text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-cyan-700 dark:text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
        <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-cyan-700 dark:text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>

      {/* Section 5 */}
      <h2 className="text-xl font-bold text-[var(--color-text-heading)] mt-10 mb-4">
        5. Children&apos;s Privacy
      </h2>
      <p className="mb-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        This website is not directed at children under the age of 13. We do not knowingly collect any personal
        information from children. If you believe a child under 13 has provided personal information on this site,
        please contact us and we will promptly take steps to remove that information.
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-bold text-[var(--color-text-heading)] mt-10 mb-4">
        6. Changes to This Policy
      </h2>
      <p className="mb-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements,
        or the services we offer. We encourage you to review this page periodically. The &quot;Last updated&quot; date
        at the top of this page indicates when the policy was most recently revised. Continued use of the site
        following any changes constitutes your acceptance of the updated policy.
      </p>

      {/* Section 7 */}
      <h2 className="text-xl font-bold text-[var(--color-text-heading)] mt-10 mb-4">
        7. Contact
      </h2>
      <p className="mb-4 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        If you have any questions, concerns, or requests regarding this Privacy Policy or how your data is handled,
        please contact us via the{' '}
        <a href="/contact" className="text-cyan-700 dark:text-cyan-400 hover:underline font-semibold">
          Contact page
        </a>. We will respond to all enquiries within a reasonable timeframe.
      </p>

    </div>
  );
}
