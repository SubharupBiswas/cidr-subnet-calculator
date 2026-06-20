# subnetmask.tech — High-Performance Subnet & VLSM Allocation Suite

A professional-grade, zero-latency IPv4 CIDR calculator and Variable Length Subnet Mask (VLSM) topology planner designed for network architects, system engineers, and developers. Built from the ground up on Next.js, this suite handles heavy bitwise operations entirely client-side for absolute privacy and instantaneous computation.

[![Next.js Build](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Core Vitals](https://img.shields.io/badge/Core_Vitals-100%2F100-emerald?style=flat-square&logo=lighthouse)](https://web.dev/vitals/)
[![Brave verified Creator](https://img.shields.io/badge/Brave-Verified_Creator-orange?style=flat-square&logo=brave)](https://creators.brave.com/)

---

## 💎 High-End UI/UX Innovations

This suite rejects the generic styles of typical subnetting tools in favor of a desktop-class interactive environment optimized for rapid iteration.

### ❄️ Glacier Steel Aesthetic
- **Light-First Foundation**: Features a custom glare-free, ice-blue workspace canvas (`oklch(97.5% 0.008 225)`) as its primary interface theme.
- **Strict Legibility Compliance**: Configured with ultra-crisp slate navy typography (`#1e293b` text / `#0f172a` headings) that guarantees compliance with the strict WCAG AA/AAA color contrast guidelines, ensuring comfortable readability under any ambient lighting conditions.

### 🎡 Desktop-Grade Wheel & Trackpad Scaling
- **Zero-Jump Interaction**: Allows the operator to scroll mouse-wheels or perform trackpad gestures directly over the four IP address octet input fields, the CIDR prefix text cell, and the mask slider.
- **Scroll Isolation**: Non-passive event listeners (`{ passive: false }`) intercept inputs, updating values synchronously while calling `e.preventDefault()` and `e.stopPropagation()` to completely eliminate layout shifting or unwanted page scrolling during adjustments.

### 🧬 Zero-Shift Binary Stream Matrix
- **Semantic Matrix Layout**: Features 32 individual button nodes mapping the raw binary stream representation of the calculated IPv4 address.
- **In-Place Bitwise Toggles**: Direct bit-flipping updates the IP address instantly. Every button is configured with absolute click event interceptors, calling `e.preventDefault()` to suppress layout reflow jumps.

### 🎚️ Native VLSM Slider & Fast Snapping
- **Responsive Rails**: Replaces fragile custom slider tracks with standard, native range elements styled with absolute precision for high-fidelity responsive behavior on mobile viewports.
- **Prefix Snap Buttons**: Quick-action controls map directly to subnet boundaries (`/1`, `/8`, `/16`, `/24`, `/30`), snapping the slider and updating calculated host blocks instantly.

---

## 📂 Repository Architecture & File Blueprint

The application conforms to the modern Next.js App Router structure with distinct page controllers and isolated client components.

```
subnetmask.tech/
├── public/                 # Static assets and sitemaps
└── src/
    ├── app/
    │   ├── layout.tsx      # Core metadata, typography injection, and layout shell
    │   ├── page.tsx        # Main IPv4/CIDR Calculator Dashboard [calculator landing page]
    │   ├── sitemap.ts      # Automated XML sitemap generator
    │   ├── vlsm/
    │   │   ├── layout.tsx  # Dedicated SEO metadata and JSON-LD structural markup
    │   │   └── page.tsx    # Variable Length Subnet Mask Planner Dashboard [runVlsm algorithm]
    │   ├── oui/
    │   │   └── page.tsx    # Offline hardware vendor MAC database lookup dashboard
    │   ├── widget/
    │   │   └── page.tsx    # Embedded calculator iframe code generator utility
    │   ├── guide/
    │   │   └── page.tsx    # Integrated subnetting guidelines and tutorial handbook
    │   ├── about/
    │   │   └── page.tsx    # Publisher about routing template page
    │   ├── contact/
    │   │   └── page.tsx    # Publisher contact routing template page
    │   └── privacy/
    │       └── page.tsx    # AdSense compliance privacy and DART cookie disclosure page
    ├── components/
    │   ├── CalculatorForm.tsx   # Handlers for IP inputs, wheel scaling, and state boundaries
    │   ├── BinaryVisualizer.tsx # 32-bit semantic matrix rendering live interactive bit streams
    │   ├── SubnetSplitter.tsx   # Sub-subnetting wizard utilizing binary division calculations
    │   ├── ClientLayoutWrapper.tsx # Manages persistent local history syncing and theme providers
    │   ├── LiveMatrix.tsx       # Calculated parameter display grids (network, broadcast, wildcards)
    │   ├── HistoryTracker.tsx   # LocalStorage history module tracking calculated parameters
    │   ├── CheatSheet.tsx       # Subnetting prefix reference table
    │   ├── FaqSection.tsx       # SEO-optimized diagnostic FAQ accordion container
    │   ├── FaqAccordion.tsx     # Single accordion animation wrapper
    │   ├── Footer.tsx           # Compliance footer navigational structures
    │   └── LegalModal.tsx       # Central disclaimer modal handler
    ├── utils/
    │   └── ipv4Utils.ts         # Fast pure bitwise mathematics (IP parse, long conversion)
    └── index.css                # Global CSS variables, custom themes, and Tailwind import
```

---

## 📈 Monetization & Publisher Compliance Configuration

The architecture is configured out-of-the-box for production monetization, utilizing standard compliance pages and crypto attention frameworks.

### 1. Google AdSense Ready
- **Centralized Compliance**: Layout frameworks incorporate automated placements mapping to Google AdSense guidelines.
- **Transparency Routing**: Mandatory cookie and data disclosure policies are fully integrated within the dynamic `/privacy` endpoint, addressing DART cookie personalization opt-out requirements.

### 2. Brave Rewards Integration
- **Verified Creator Node**: Domain verification parameters route directly through the verified Brave Creators publisher console.
- **ZebPay Wallet Linkage**: Basic Attention Token (BAT) distributions are directed to verified ZebPay nodes to ensure compliance with regional transaction standards.

---

## 🛠️ Deployment & Production Compiling Scripts

Use the following scripts to run the local developer sandbox or build for deployment:

### Local Sandbox Execution
Spins up the Next.js development server with hot-module reloading:
```bash
npm run dev
```

### Production Strict Build Pipeline
Cleans artifacts, executes strict TypeScript type checking without generating outputs, and runs the compiler to produce optimized web assets:
```bash
rm -rf .next && npx tsc --noEmit && npm run build
```

### Static Exports Overview
The build process compiles routes into static structures to ensure 100/100 Core Vitals scores and edge hosting efficiency. The sitemap is automatically generated at compile-time by `src/app/sitemap.ts`.
