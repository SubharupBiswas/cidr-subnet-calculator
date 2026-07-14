# subnetmask.tech

### High-Performance IPv4 CIDR Subnet Engine · Binary Stream Topology Visualizer · VLSM Planner

An ultra-fast, zero-dependency, privacy-first subnet engineering suite built for systems architects, DevOps teams, and network administrators. Every subnet parameter is computed locally via pure bitwise arithmetic with no server round-trips or tracking hooks.

---

## Technical Overview

**subnetmask.tech** is a high-performance **IPv4 binary stream processing engine** developed using Next.js 16, TypeScript, and Tailwind CSS. The entire application runs fully client-side (statically exported via `output: 'export'`), allowing edge deployment and full offline capabilities.

By utilizing pure bitwise operators (`&`, `|`, `~`, `>>>`), calculations (such as network boundaries, broadcast addresses, wildcard masks, usable host ranges, and binary representations) are performed under 1ms in the client thread.

---

## Core Architectural Features

*   **Mobile-First Multi-Viewport Responsiveness:** Optimized flex and grid layouts designed for seamless utility access across mobile, tablet, laptop, and 4K desktop screens.
*   **Tactile High-Contrast Prefix Chips:** Interactive quick preset selectors upgraded to premium interactive chips with strict text contrast constraints for both light and dark variations.
*   **Full-Width High-Precision Sliders:** The interactive CIDR prefix slider occupies its own dedicated, full-width track layout across all form factors to optimize dragging limits.
*   **CSS Alpha-Transparency Navigation Masking:** Utilizes a pure CSS alpha-mask configuration on the horizontally scrollable main navigation rail to blend links into transparency near mobile borders, eliminating raw color overlays and maintaining continuous border line decorations on desktop.
*   **Optimized Typography Boundaries:** Flexible text wrapping and downscaled font sizes specifically optimized for small screens to prevent aggressive title wrapping and overflow.

---

## Core Web Vitals & Monetization Stability

*   **Cumulative Layout Shift (CLS) Protection:** Neutralizes visual shifting on dynamic ad integrations. Every ad slot is wrapped in a dedicated layout container with strict minimum layout height boundaries matching standard viewport ratios (leaderboard and display rectangles).
*   **Total Blocking Time (TBT) Optimization:** Quarantines heavy third-party assets (such as Google AdSense, Google Analytics, and payment scripts). External libraries are dynamically initialized inside `requestIdleCallback` loops only after active user interaction is detected.
*   **Critical-Path Code Splitting:** Heavy sub-utilities (Live Matrix, Binary Visualizer, Subnet Splitter, History Tracker, and Cheat Sheet) are code-split and loaded dynamically with no SSR initialization cost, bringing critical bundles down to a minimum.
*   **Localized Payment Integration:** The support checkout script is dynamically injected directly into a localized sandbox form container to prevent global DOM leakage and third-party tracking.

---

## Tech Stack

*   **Framework:** Next.js 16 (App Router with Client-Side Static Export target)
*   **Language:** TypeScript (Strict compliance)
*   **Styling:** Tailwind CSS (Fluid design utility system)
*   **Icons:** Lucide Icons (Sleek vector assets)

---

## File Architecture

```
src/
├── app/                        # Next.js App Router (Static SSG & Client Routes)
│   ├── layout.tsx              # Root Layout: next/font, JSON-LD schema preconnects
│   ├── page.tsx                # Home: Calculator UI + dynamic lazy modules
│   ├── guide/page.tsx          # SSG: Technical Guide articles
│   ├── vlsm/page.tsx           # Client: VLSM Subnet Planner engine
│   ├── oui/page.tsx            # Client: MAC OUI lookup interface
│   ├── widget/page.tsx         # Embed mode: stripped calculator build
│   ├── about/page.tsx          # SSG: Product statement
│   ├── contact/page.tsx        # Client: Contact page
│   ├── privacy/page.tsx        # SSG: Privacy Policy (AdSense & Razorpay compliance)
│   ├── terms/page.tsx          # SSG: Terms & Conditions policy
│   ├── refund/page.tsx         # SSG: Refund & Cancellation policy
│   └── shipping/page.tsx       # SSG: Shipping & Delivery policy
├── components/
│   ├── CalculatorForm.tsx      # Primary calculator UI & prefix slider
│   ├── LiveMatrix.tsx          # Results dashboard (lazy-loaded, ssr:false)
│   ├── BinaryVisualizer.tsx    # 32-bit bit-toggle renderer (lazy-loaded, ssr:false)
│   ├── SubnetSplitter.tsx      # VLSM block table (lazy-loaded, ssr:false)
│   ├── CheatSheet.tsx          # Prefix reference sheet (lazy-loaded, ssr:false)
│   ├── HistoryTracker.tsx      # localStorage calculation history (lazy-loaded, ssr:false)
│   ├── ClientLayoutWrapper.tsx # Nav layout, theme toggles, and shared container hooks
│   ├── AdSenseInitializer.tsx  # Dynamic performance-isolated ad script injector
│   └── RazorpaySupportButtonBox.tsx # Localized sandbox form container wrapper
└── utils/
    └── ipv4Utils.ts            # Pure bitwise IPv4 calculation utility logic
```

---

## Local Development

### Installation & Setup

1.  Clone the repository and navigate to the project root:
    ```bash
    git clone https://github.com/developer/subnetmask.git
    cd subnetmask
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    # Server binds to http://localhost:3000
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
| `/about` | Static Generation (SSG) | Site information, architectural details, and support info |
| `/contact` | Client-Side Form | Dedicated secure feedback and contact channel |
| `/privacy` | Static Generation (SSG) | Privacy Policy: AdSense DART & Razorpay tracking definitions |
| `/terms` | Static Generation (SSG) | Terms of Service: Non-commercial contribution terms |
| `/refund` | Static Generation (SSG) | Refund Policy: Non-refundable voluntary support parameters |
| `/shipping` | Static Generation (SSG) | Shipping Policy: Verification of instant digital fulfillment |

---

## License

Released under the [MIT License](LICENSE). Free to use, modify, and distribute.
