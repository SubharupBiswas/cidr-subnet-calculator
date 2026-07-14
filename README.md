<div align="center">

# subnetmask.tech

### High-Performance IPv4 CIDR Subnet Engine · Binary Stream Topology Visualizer · VLSM Planner

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

---

[![Performance Mobile](https://img.shields.io/badge/Mobile_Performance-100-16a34a?style=flat-square&logo=googlechrome&logoColor=white)](https://pagespeed.web.dev/report?url=https://subnetmask.tech)
[![Performance Desktop](https://img.shields.io/badge/Desktop_Performance-100-16a34a?style=flat-square&logo=googlechrome&logoColor=white)](https://pagespeed.web.dev/report?url=https://subnetmask.tech)
[![Accessibility](https://img.shields.io/badge/Accessibility-100-16a34a?style=flat-square&logo=googlechrome&logoColor=white)](https://pagespeed.web.dev/report?url=https://subnetmask.tech)
[![Best Practices](https://img.shields.io/badge/Best_Practices-100-16a34a?style=flat-square&logo=googlechrome&logoColor=white)](https://pagespeed.web.dev/report?url=https://subnetmask.tech)
[![SEO](https://img.shields.io/badge/SEO-100-16a34a?style=flat-square&logo=googlechrome&logoColor=white)](https://pagespeed.web.dev/report?url=https://subnetmask.tech)
[![WCAG](https://img.shields.io/badge/WCAG-AA%2FAAA-7c3aed?style=flat-square)](https://www.w3.org/WAI/WCAG22/quickref/)

**[→ Live Application](https://subnetmask.tech)** &nbsp;·&nbsp; **[→ Tech Guide](https://subnetmask.tech/guide)** &nbsp;·&nbsp; **[→ Embeddable Widget](https://subnetmask.tech/widget)**

</div>

---

## Overview

**subnetmask.tech** is a zero-latency, client-side **IPv4 binary stream processing engine** built on Next.js 16 with the App Router and React Server Components. Every subnet parameter — network address, broadcast address, subnet mask, wildcard mask, usable host range, hex encoding, binary breakdown — is computed via pure bitwise arithmetic (`&`, `|`, `~`, `>>>`) in the JavaScript main thread with no server round-trips, no API dependencies, and full offline capability.

The platform is architected as a production-grade developer tool targeting **systems engineers, cloud architects, network administrators, and CCNA/CCNP certification candidates**, with an educational technical knowledge base that is statically generated and fully crawlable for SEO.

---

## Technical Highlights & Features

- **Bitwise Calculation Engine**: Zero-latency bitwise calculation of CIDR boundaries, broadcast vectors, and wildcards.
- **Next.js 16 App Router & Static Export**: Configured with `output: 'export'` for full client-side edge deployment (e.g., Cloudflare Pages).
- **Core Web Vitals Protections**: Zero Total Blocking Time (TBT) and 0 Cumulative Layout Shift (CLS) on ad frames and widgets.
- **Compliance Policy Engine**: Fully integrated merchant policies (Privacy, Terms, Shipping, and Refund) linked, indexed, and formatted for Dark Mode.
- **Embedded Sandbox Widgets**: Context-localized script isolation for external widgets to prevent third-party document tracking leaks.
- **Alpha-Transparency Navigation Rail**: A programmatic CSS mask engine applied directly to the sub-nav menu tracking elements, offering custom touch-safe navigation discoverability without rigid border dividers.
- **High-Precision Slider & Tactile Chips**: A dedicated full-width interactive layout slider row matched with responsive, high-contrast text badge presets optimized for effortless thumb and mouse accuracy across all viewports.
- **Fluid Layout Bounding**: Global migration of layout padding tokens directly to page content roots, completely eliminating compounded padding bugs and securing a strict alignment baseline.

---

## Core Feature Matrix

| Tool | Description | Route |
|---|---|---|
| **CIDR Subnet Calculator** | Real-time bitwise computation of all IPv4 subnet parameters for any `/1`–`/32` prefix. Renders network address, broadcast, mask, wildcard, usable range, hex, IP class, and 32-bit binary breakdown in under 1ms. Shareable via URL parameters. | `/` |
| **32-Bit Binary Stream Visualizer** | Interactive bit-level toggler rendering the full binary decomposition of any IPv4 address. Network and host bit regions are visually differentiated in real time as the prefix slider moves. Bitwise AND with the subnet mask vector is shown live. | `/` |
| **VLSM Enterprise Subnet Planner** | Variable Length Subnet Masking engine. Accepts a parent CIDR block and a target prefix depth, then calculates and enumerates all child subnet boundaries, usable ranges, broadcast addresses, and host pool capacities using power-of-two block arithmetic. | `/vlsm` |
| **MAC OUI Vendor Analyzer** | Parses the 24-bit Organizationally Unique Identifier from any Ethernet MAC address and resolves it to the registered manufacturer. Supports colon, dash, and dotted-quad notation. Identifies locally administered and multicast addresses. | `/oui` |
| **Embeddable Developer Widget** | A lightweight, stripped-down calculator build designed for iframe embedding in documentation platforms, internal wikis, and educational portals. Activated via `?embed=true` query parameter. | `/widget` |
| **IPv4 Technical Reference Guide** | Statically generated (SSG) educational knowledge base with two full-length technical articles: VLSM design methodology and binary routing physics (TCAM, LPM, ARP). Fully indexed by crawlers. | `/guide` |

---

## File Architecture

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout: next/font, JSON-LD schema preconnects
│   ├── page.tsx                # Home: CalculatorForm + dynamic lazy modules
│   ├── guide/page.tsx          # SSG: Technical guide articles
│   ├── vlsm/page.tsx           # Client: VLSM Subnet Planner engine
│   ├── oui/page.tsx            # Client: MAC OUI lookup interface
│   ├── widget/page.tsx         # Embed mode: stripped calculator build
│   ├── about/page.tsx          # SSG: Product statement
│   ├── contact/page.tsx        # Client: Contact form page
│   ├── privacy/page.tsx        # SSG: Compliance privacy policy (AdSense + Razorpay rules)
│   ├── terms/page.tsx          # SSG: Terms & Conditions policy
│   ├── refund/page.tsx         # SSG: Refund & Cancellation policy
│   ├── shipping/page.tsx       # SSG: Shipping & Delivery policy
│   ├── robots.ts               # Static robots configuration metadata
│   └── sitemap.ts              # Programmatic sitemap generation
├── components/
│   ├── CalculatorForm.tsx      # Primary calculator UI + prefix slider
│   ├── LiveMatrix.tsx          # Results dashboard (lazy-loaded, ssr:false)
│   ├── BinaryVisualizer.tsx    # 32-bit bit-toggle renderer (lazy-loaded, ssr:false)
│   ├── SubnetSplitter.tsx      # VLSM block table (lazy-loaded, ssr:false)
│   ├── CheatSheet.tsx          # Prefix reference sheet (lazy-loaded, ssr:false)
│   ├── HistoryTracker.tsx      # localStorage calculation history (lazy-loaded, ssr:false)
│   ├── ClientLayoutWrapper.tsx # Nav, theme toggle, route-aware header, FAQ shell
│   ├── AdSenseInitializer.tsx  # Dynamic performance-isolated ad script injector
│   ├── RazorpaySupportButtonBox.tsx # localized sandbox execution form for payments
│   ├── FaqAccordion.tsx        # Accessible accordion FAQ component
│   └── Footer.tsx              # Site-wide footer with legal links
├── utils/
│   └── ipv4Utils.ts            # Pure bitwise IPv4 calculation engine
└── index.css                   # Tailwind CSS v4 variables & custom color tokens
```

---

## Binary Math Ingestion Pipeline

```mermaid
flowchart TD
    A(["User Input: 192.168.1.75/24"]) --> B["Octet Array Parsing\n192, 168, 1, 75"]
    B --> C["Decimal to 32-bit Integer\nip = 192 shl 24 OR 168 shl 16 OR 1 shl 8 OR 75"]
    C --> D["Subnet Mask Vector Generation\nmask = 0xFFFFFFFF shl 32-n"]
    D --> E{"Bitwise Operations"}

    E --> F["Network Address\nnetwork = ip AND mask\nResult: 192.168.1.0"]
    E --> G["Wildcard Mask\nwildcard = NOT mask unsigned\nResult: 0.0.0.255"]

    F --> H["Broadcast Address\nbroadcast = network OR wildcard\nResult: 192.168.1.255"]
    F --> I["First Usable Host\nnetwork + 1\nResult: 192.168.1.1"]
    H --> J["Last Usable Host\nbroadcast - 1\nResult: 192.168.1.254"]
    D --> K["Host Capacity\n2^32-n minus 2 = 254 hosts"]

    style A fill:#0e7490,color:#fff,stroke:#0e7490
    style E fill:#7c3aed,color:#fff,stroke:#7c3aed
    style F fill:#065f46,color:#fff,stroke:#065f46
    style H fill:#92400e,color:#fff,stroke:#92400e
    style K fill:#1d4ed8,color:#fff,stroke:#1d4ed8
```

---

## Performance & Optimization Engineering

The application enforces a strict performance baseline to achieve 100/100 across all Core Web Vitals targets.

### 1. Programmatic Script Deferral (TBT Protection)
To completely prevent Total Blocking Time (TBT) degradation during initial page hydration, third-party network scripts (Google AdSense, Google Analytics, Razorpay checkout) are strictly prohibited from loading during the rendering phase.
- **AdSense & Analytics**: Script fetching is delayed until the browser registers user interaction (`scroll`, `mousemove`, `keydown`, `touchstart`).
- **Browser Idle Execution**: Once triggered, scripts are loaded programmatically via a `requestIdleCallback` wrapper with a safe `setTimeout` fallback, keeping the main thread clear for immediate calculator interaction:
  ```ts
  useEffect(() => {
    if (!loadAds) return;
    
    const injectScript = () => {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
      script.async = true;
      document.body.appendChild(script);
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => injectScript());
    } else {
      setTimeout(injectScript, 1);
    }
  }, [loadAds]);
  ```

### 2. Localized Form Script Isolation (Secure Sandboxing)
Third-party checkout scripts, like Razorpay, are programmatically injected directly into a localized `<form>` element ref on user idle periods. This encapsulates external DOM mutations, prevents global window tracking, and guarantees that script variables remain strictly bounded inside the container:
```ts
const containerRef = useRef<HTMLFormElement>(null);
useEffect(() => {
  const injectScript = () => {
    if (!containerRef.current) return;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', 'pl_XXXXXXXXXXXXXXXX');
    script.async = true;
    containerRef.current.appendChild(script);
  };
  // Defer execution to idle times...
}, []);
```

### 3. Layout Bounding (Cumulative Layout Shift Protection)
To neutralize Cumulative Layout Shift (CLS) when asynchronously injected ad blocks render, the DOM structure forces strict container footprints.
Every manual ad block element is wrapped in a dedicated styling container (`div`) with explicit minimum dimensions pre-calculated for standard ad unit ratios:
- **Leaderboard Banners**: Constrained to `min-h-[90px]`
- **Display Rectangles**: Constrained to `min-h-[250px]`

### 4. Critical-Path Code Splitting
Below-the-fold application components (`LiveMatrix`, `BinaryVisualizer`, `SubnetSplitter`, `CheatSheet`, `HistoryTracker`) are loaded dynamically using Next.js `dynamic()` imports with `ssr: false`. This removes over 240 KB of JavaScript from the critical path, keeping the home layout responsive from the first frame.

### 5. Alpha-Masked Text Stream Engine (Discovery Rail)
Instead of relying on heavy color overlay divs that mismatch background gradients or clip desktop layout borders, the swipeable mobile navigation sub-menu implements a pure CSS WebKit alpha-channel opacity blend mask. Text elements cleanly fade into transparency exactly at the screen edge boundary on compact viewports while extinguishing cleanly on wide displays:

```ts
style={{
  WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 2.5rem), transparent 100%)',
  maskImage: 'linear-gradient(to right, black calc(100% - 2.5rem), transparent 100%)'
}}
```

---

## Calculation Engine Mechanics

The subnet logic is implemented in [`src/utils/ipv4Utils.ts`](src/utils/ipv4Utils.ts) using bitwise arithmetic operators. 
All bitwise operations are forced to unsigned 32-bit representations using zero-fill right shift (`>>> 0`), preventing Javascript's signed 32-bit conversion from returning negative decimals on network prefix vectors:

```ts
// Unsigned bitmask generation
export function getMaskLong(prefix: number): number {
  return prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
}

// Bitwise AND for network address
const networkLong = ipLong & maskLong;

// Bitwise OR for broadcast address
const wildcardLong = (~maskLong) >>> 0;
const broadcastLong = (networkLong | wildcardLong) >>> 0;
```

---

## Local Development

### Installation & Setup

1. Clone the repository and install the dependencies:
   ```bash
   git clone https://github.com/developer/cidr-subnet-calculator.git
   cd cidr-subnet-calculator
   npm install
   ```

2. Spin up the development server:
   ```bash
   npm run dev
   # Server binds to http://localhost:3000
   ```

3. Audit type-safety:
   ```bash
   npm run build # runs typechecking and builds next export
   ```

### Production Build & Static Preview

To verify compilation compatibility with static server setups (`output: 'export'`):

```bash
# 1. Compile the optimized static page export to /out
npm run build

# 2. Serve the static out/ directory locally
npx serve out
```

---

## Route & Compliance Map

| Route | Execution Type | Description |
|---|---|---|
| `/` | Client-Side Calculator | Primary bitwise IPv4 CIDR calculator and binary toggler |
| `/vlsm` | Client-Side Planner | Variable Length Subnet Mask planning engine |
| `/oui` | Client-Side Lookup | Ethernet MAC OUI vendor resolution analyzer |
| `/guide` | Static Generation (SSG) | Technical routing guide: VLSM rules and TCAM physics |
| `/about` | Static Generation (SSG) | Site information, architectural details, and project roadmap |
| `/contact` | Client-Side Form | Dedicated secure feedback and business inquiries route |
| `/privacy` | Static Generation (SSG) | Privacy Policy: AdSense DART & Razorpay tracking definitions |
| `/terms` | Static Generation (SSG) | Terms of Service: Non-commercial contribution terms |
| `/refund` | Static Generation (SSG) | Refund Policy: Non-refundable voluntary support parameters |
| `/shipping` | Static Generation (SSG) | Shipping Policy: Verification of instant digital fulfillment |

---

## License

Released under the [MIT License](LICENSE). Free to use, modify, and distribute.
