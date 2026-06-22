<div align="center">

# 🌐 IPv4 CIDR Calculator & Subnet Splitting Engine

### A zero-latency, high-performance network subnetting calculator built with Next.js 16, React, TypeScript, and Tailwind CSS. Engineered to execute sub-millisecond network space calculations directly on the V8 runtime.

<br />

[![Next.js 16](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](#)
[![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript%205-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Tailwind CSS v4.0](https://img.shields.io/badge/Tailwind%20CSS%20v4.0-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](#)
[![Netlify Edge](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](#)

<br />

### [👉 Live Application Deployment](https://subnetmask.tech)

</div>

---

## 🏗️ Architectural Paradigm & System Blueprint

This application implements a **Zero-Server-Dependency Design Pattern**. Traditional subnet calculators offload IP calculation boundaries to remote backend server API routes. However, raw Variable Length Subnet Masking (VLSM) and bit-level manipulations scale infinitely better within the client browser's native engine. By eliminating server roundtrips, the application guarantees sub-millisecond computations (<0.1ms processing overhead) and functions completely offline.

### Data Flow Lifecycle

The diagram below details the end-to-end data flow sequence, mapping inputs to DOM reconciliation blocks:

```
┌────────────────────────────────────────────────────────┐
│  Raw User Input Event (Direct Numeric Keypad inputs /   │
│  Scroll Wheel / Click Presets / Interactive Bit Toggle) │
└───────────────────────────┬────────────────────────────┘
                            │ Non-passive Event Hijack
                            ▼
┌────────────────────────────────────────────────────────┐
│             React Component State Capture              │
│       (Local State Array: octets=['192','168','1','1'])│
└───────────────────────────┬────────────────────────────┘
                            │ React Render Trigger
                            ▼
┌────────────────────────────────────────────────────────┐
│         IP Long Unsigned Converter (Uint32)            │
│  - Parses decimals, strips trailing non-numbers        │
│  - Bitwise coercion: (o1*16777216 + ...) >>> 0         │
└───────────────────────────┬────────────────────────────┘
                            │ Numerical Long Input
                            ▼
┌────────────────────────────────────────────────────────┐
│           V8 Bitwise Evaluation Logic Engine           │
│  - Compute Mask: (~((1 << (32 - prefix)) - 1)) >>> 0   │
│  - Compute Network: (ipLong & maskLong) >>> 0          │
│  - Compute Broadcast: (networkLong | ~maskLong) >>> 0  │
└───────────────────────────┬────────────────────────────┘
                            │ Calculated Results Map
                            ▼
┌────────────────────────────────────────────────────────┐
│           Atomic React UI Reconciliation               │
│  - Binary Stream toggle buttons render                 │
│  - LiveMatrix displays classes (WCAG AA Contrast check)│
│  - Subnet Splitter lists allocated subnetwork trees    │
└────────────────────────────────────────────────────────┘
```

### File & Folder Architecture

Below is the directory mapping showing key modules and route layouts in the `src/` folder:

```
src/
├── app/                        # Next.js App Router Page Matrix
│   ├── about/                  # Static information module
│   ├── contact/                # Contact and developer feedback route
│   ├── guide/                  # Subnetting and networking learning modules
│   ├── oui/                    # MAC Address Vendor OUI Lookup engine
│   ├── privacy/                # Privacy documentation and standard policies
│   ├── vlsm/                   # Variable Length Subnet Mask (VLSM) divider
│   ├── widget/                 # Embedded widget canvas designed for iframe placement
│   ├── layout.tsx              # Root HTML wrapper with GA4 & custom JSON-LD schemas
│   ├── page.tsx                # Landing calculation dashboard entrypoint
│   └── sitemap.ts              # Dynamic SEO XML indexing file
├── components/                 # Atomic Reusable Component Tree
│   ├── BinaryVisualizer.tsx    # Interactive 32-bit toggle matrix stream
│   ├── CalculatorForm.tsx      # Multi-octet IP input wrapper with scrolling triggers
│   ├── CheatSheet.tsx          # Inline reference table for subnet metrics
│   ├── ClientLayoutWrapper.tsx # Client-side theme provider and container controls
│   ├── FaqAccordion.tsx        # SEO-optimised Accordion element
│   ├── LiveMatrix.tsx          # Real-time subnet results layout
│   └── SubnetSplitter.tsx      # Subnet division planning calculations
├── utils/                      # Core Calculation Utilities
│   └── ipv4Utils.ts            # Bitwise calculations, validation, & IP translations
└── index.css                   # Global styles & design system definitions
```

---

## ⚡ Production Bottlenecks & Advanced Engineering Solutions

### 1. V8 Engine Bitwise Limitations

#### The Challenge
JavaScript represents numbers internally as 64-bit floating-point doubles (IEEE 754 standard). However, bitwise operators (such as `&`, `|`, `~`, `<<`) always cast their operands to 32-bit *signed* integers. The highest bit (bit 31) functions as the sign bit. 

When processing Class A or Class B IP spaces above `127.255.255.255`, the sign bit is set to `1`. This causes the calculation to result in a negative decimal number, yielding arithmetic anomalies during conversions back to dot-decimal notation.

#### The Solution
To resolve this, we utilized the logical right-shift operator (`>>> 0`). In JavaScript, the zero-fill right-shift operator converts the signed 32-bit representation back into a pure 32-bit unsigned integer (`Uint32`) inside V8.

```typescript
export function ipToLong(ip: string): number {
  const parts = ip.split('.').map(p => parseInt(p, 10));
  if (parts.length !== 4 || parts.some(isNaN)) return 0;
  return (parts[0] * 16777216 + parts[1] * 65536 + parts[2] * 256 + parts[3]) >>> 0;
}

export function getMaskLong(prefix: number): number {
  if (prefix === 0) return 0;
  if (prefix === 32) return 0xffffffff;
  return (~((1 << (32 - prefix)) - 1)) >>> 0;
}
```

### 2. Defensive Mobile Layout Hardening

#### The Challenge
Displaying wide tabular structures, 32-digit binary strings, and usable host range intervals on small mobile viewports (down to 320px) often leads to horizontal layout breaking, text clipping, or button truncation.

#### The Solution
We implemented a strict defensive layout policy:
* **`min-w-0` & `flex-shrink-0` bounds:** Used on flex layouts to override the browser's default minimum width computations.
* **Custom Horizontal Swipe Containers:** Outfitted with `overflow-x-auto scrollbar-none` classes, allowing users to scroll binary streams and subnet ranges within their respective cards without forcing parent container overflows.
* **Flex Wrappers:** Transformed static multi-column configurations into dynamic flex containers that wrap onto new lines on compact screens.

### 3. Non-Passive Input Wheel Event Capturing

#### The Challenge
We wanted to allow network engineers to hover over the IP octet and CIDR fields to change values via scroll wheel actions. However, React’s virtual event system registers wheel listeners as `passive: true` by default. This makes it impossible to call `e.preventDefault()`, causing erratic vertical scrolling on the parent window.

#### The Solution
We bypassed the virtual React handler layers by using native DOM references (`useRef`). During component mounting, we register event listeners directly to the DOM nodes with `{ passive: false }` explicitly configured:

```typescript
useEffect(() => {
  const handlers: (() => void)[] = [];

  octetRefs.forEach((ref, index) => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const { octets: currentOctets } = stateRef.current;
      const current = parseInt(currentOctets[index] || '0', 10);
      const delta = e.deltaY < 0 ? 1 : -1;
      const next = Math.min(255, Math.max(0, current + delta));
      const newOctets = [...currentOctets];
      newOctets[index] = String(next);
      setOctets(newOctets);
      setIp(newOctets.join('.'));
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    handlers.push(() => el.removeEventListener('wheel', onWheel));
  });

  return () => handlers.forEach(cleanup => cleanup());
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

### 4. Theme Contrast & Web Accessibility (WCAG AA)

#### The Challenge
Using generic CSS filters like `filter: invert(1)` to transition to dark mode causes subpixel font blurring and color contrast violations.

#### The Solution
We configured a dark mode system based on semantic CSS color tokens. We mapped text elements and badge borders to high-contrast colors (e.g. `text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10`) to ensure a minimum 4.5:1 text-to-background contrast ratio under Lighthouse accessibility sweeps:

```typescript
const octetColors = [
  'text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-500/30 focus:border-pink-500',
  'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30 focus:border-violet-500',
  'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 focus:border-blue-500',
  'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30 focus:border-teal-500',
];
```

### 5. Machine-Readable Agentic Mapping

#### The Challenge
Modern AI agents and developer-focused crawlers need to discover the specific tool routes of this application without parsing heavy HTML pages.

#### The Solution
We provisioned a `public/llms.txt` config file. By structuring this index with fully-qualified absolute hyperlinks, automated web crawlers can immediately parse the core routes of our calculator sandbox.

---

## 📊 Audited Production Core Web Vitals Matrix

All metrics have been validated using Chrome DevTools Lighthouse sweeps and PageSpeed Insights under active 4G mobile throttling profiles:

| Audit Parameter | Verification Score | Defensive Optimization Strategy |
| :--- | :--- | :--- |
| **Performance** | **96+ / 100** | Zero-latency bitwise calculation engine with no API database network fetches. |
| **Accessibility** | **96+ / 100** | Standard semantic HTML layout with complete WAI-ARIA label configurations. |
| **SEO** | **100 / 100** | Configured JSON-LD schema layouts and structural metadata indexing rules. |
| **Cumulative Layout Shift** | **0.00 (CLS)** | Pre-allocated native layout bounding wrappers and local Next.js font hosting. |

---

## 🛠️ Deterministic Development & Local Compilation Pipelines

### Local Setup
Ensure you have Node.js v18+ installed on your system.

```bash
# 1. Install precise workspace dependencies
npm install

# 2. Run absolute type validation (Strict verification)
npx tsc --noEmit

# 3. Create the optimized production bundle
npm run build

# 4. Boot the Next.js local development server
npm run dev
```

---

## 🧹 Repository Hygiene & Clutter Elimination

To keep the codebase clean and lightweight, we maintain a multi-layered `.gitignore` tree. This ensures local cache files, build directories, and tooling tracking assets are excluded from version control:

```
# Next.js compilation directories
.next/
out/
build/
dist/

# Dependencies
node_modules/

# Cache directories
.eslintcache
.stylelintcache
node_modules/.cache/

# System specific files
.DS_Store
Thumbs.db
```
