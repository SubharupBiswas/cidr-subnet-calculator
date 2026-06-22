# 🌐 IPv4 CIDR Calculator & Subnet Splitting Engine

A blazing-fast, zero-latency IPv4 subnet calculator and CIDR engineering utility built to perform sub-millisecond network boundary math directly in the browser. Trusted by network architects, CCNA engineers, and DevOps professionals.

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deployed_on-Cloudflare_Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://subnetmask.tech)
[![Next.js Version](https://img.shields.io/badge/Next.js-16.2.9-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript Version](https://img.shields.io/badge/TypeScript-5.5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS Version](https://img.shields.io/badge/Tailwind_CSS-4.0.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Live Deployment:** [https://subnetmask.tech](https://subnetmask.tech)

---

## 🏗️ Architectural Paradigm: Zero-Server-Dependency

Unlike traditional IP subnet calculators that bounce requests to a backend PHP or Node.js server to perform IP math, this engine operates on a strict **Zero-Server-Dependency Design Pattern**. 

By leveraging Next.js's static export capabilities (`output: 'export'` configured in `next.config.ts`), the entire React tree compiles down into a highly optimized Static HTML/JS payload. 

### Core Data Flow & Edge Architecture
```text
[ User Browser ]
       │  (Requests subnetmask.tech)
       ▼
[ Cloudflare Global Edge Network ] ──▶ (Serves Static `/out` HTML/JS)
       │
       ▼  (Client-Side Execution)
[ V8 JS Engine ]
  ├── 1. Intercepts Input `{ passive: false }`
  ├── 2. Parses IP String to 32-bit Int (`>>> 0` Bitwise Coercion)
  ├── 3. Computes CIDR Mask & Wildcard
  └── 4. Renders React 19 State (Zero Latency)
```

**Why this matters:**
- **Zero Compute Latency:** Subnet operations are performed using native JavaScript execution threads on the client’s machine.
- **Edge Native:** Deploying a pure static export to Cloudflare Pages completely removes the "double-hop" proxy-to-origin TLS handshake, meaning the site is served directly from the edge cache nearest to the user.

---

## 🧠 Advanced Engineering Solutions

Building an interactive network calculator in JS presents unique challenges. Here is how we overcame the architectural bottlenecks:

### 1. Unsigned Bitwise Math Coercion (`>>> 0`)
JavaScript natively represents all numbers as double-precision 64-bit floats, but bitwise operations implicitly convert operands into **signed** 32-bit integers. Since IPv4 addresses are precisely 32 bits long, calculating addresses with a high-order bit (e.g., `192.168.1.1`) causes V8 to treat the number as a negative integer, completely breaking standard broadcast and wildcard calculations. 
**The Solution:** We utilized the Zero-Fill Right Shift operator (`>>> 0`) throughout the `ipv4Utils.ts` and `SubnetSplitter.tsx` engines (e.g., `const networkLong = (ipLong & maskLong) >>> 0;`). This forces the V8 engine to treat the resulting bitmask as an **unsigned 32-bit integer**, guaranteeing 100% mathematical accuracy across all IP classes.

### 2. Event Hijacking for Scroll Intuition
Network engineers frequently use scroll wheels to quickly traverse prefix classes (e.g., sliding from a `/24` to a `/26`). However, binding a standard `onWheel` event in React triggers passive listener violations and causes page jitter. 
**The Solution:** We bypassed React's synthetic event wrapper entirely. By utilizing `useRef` to capture DOM nodes (in `CalculatorForm.tsx` and `vlsm/page.tsx`), we aggressively hijacked the scroll loop using `el.addEventListener('wheel', onWheel, { passive: false });`. This allows us to intercept the scroll delta, update the CIDR mask state, and fire `e.preventDefault()`—providing buttery-smooth number scrubbing without any viewport scroll leakage.

### 3. Migrating for Maximum Mobile Performance
The application originally suffered from proxy routing overhead on legacy Vercel infrastructure. By transitioning to a pure static export hosted on Cloudflare Pages, we eliminated Server-Side Rendering (SSR) pipeline delays. Coupled with Next.js dynamic imports (`next/dynamic` with `ssr: false`) for our heavier modules like the `BinaryVisualizer` and `HistoryTracker`, we obliterated the Render-Blocking payload tax on mobile devices.

---

## ⚡ Audited Production Core Web Vitals

Our ruthless dedication to eliminating layout shifts and compressing critical rendering paths has yielded perfect scores across production Core Web Vitals audits:

| Metric | Score | Note |
| :--- | :---: | :--- |
| **Desktop Performance** | **99/100** | LCP < 0.8s. |
| **Mobile Performance** | **96+/100** | Render-blocking eliminated via dynamic chunking. |
| **Accessibility (a11y)** | **96+/100** | AA+ contrast floors and WAI-ARIA compliant tagging. |
| **SEO** | **100/100** | Strict semantic HTML and optimized meta structures. |

---

## 📂 File & Folder Architecture

This codebase demonstrates clean separation of concerns, modular utility functions, and Next.js App Router patterns optimized for Cloudflare deployment:

```text
src/
├── app/
│   ├── layout.tsx         # Global layout shell, custom fonts (next/font/google), and theme providers
│   ├── page.tsx           # Home view: IPv4 Subnet Calculator Dashboard
│   ├── sitemap.ts         # Programmatic Google sitemap crawler router (compiles statically)
│   ├── vlsm/
│   │   └── page.tsx       # Variable Length Subnet Mask Planning Dashboard
│   ├── oui/
│   │   └── page.tsx       # Offline MAC Address vendor database lookup page
│   ├── widget/
│   │   └── page.tsx       # Embeddable calculator sandbox/iframe builder
│   ├── about/             # About page routing
│   ├── contact/           # Contact routing and information
│   ├── guide/             # Integrated reference handbook and subnet tutorial
│   └── privacy/           # Legal and AdSense Cookie privacy compliance page
├── components/
│   ├── CalculatorForm.tsx  # Dynamic inputs, keyboard navigation, and wheel handlers
│   ├── BinaryVisualizer.tsx# Semantic 32-bit bitmask toggle grid (Dynamic import)
│   ├── LiveMatrix.tsx      # Calculated network parameters and Usable Host views
│   ├── SubnetSplitter.tsx  # Wizard for splitting networks into sub-subnets (Dynamic import)
│   ├── HistoryTracker.tsx  # LocalStorage syncing module for calculation logs
│   └── CheatSheet.tsx      # Interactive Subnet CheatSheet references
└── utils/
    └── ipv4Utils.ts        # Highly optimized binary math operations (Zero-fill right-shift)
```

---

## 🛠️ Local Development Pipeline

To run the static compiler locally and interact with the development server, utilize the following CLI pipeline:

**1. Install Dependencies**
```bash
npm install
```

**2. Type Verification Pipeline**
Ensure zero strict-mode type faults before attempting a build:
```bash
npx tsc --noEmit
```

**3. Run the Development Server**
```bash
npm run dev
# Server boots at http://localhost:3000
```

**4. Compile the Static Edge Export**
Triggers the Next.js production compiler and generates the optimized static `/out` payload perfectly tailored for Cloudflare Pages:
```bash
npm run build
```

---
*Developed with a commitment to sub-millisecond precision.*
