# Advanced Client-Side IPv4 CIDR & Subnet Calculator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.0-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4-6474f2.svg?logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06b6d4.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Static Hosting](https://img.shields.io/badge/Static_Hosting-Netlify-00ad9f.svg?logo=netlify)](https://www.netlify.com/)

An engineering-focused, highly polished **Advanced Client-Side IPv4 CIDR & Subnet Calculator** built from scratch. Operating entirely in the client browser with **0% server overhead**, the application performs low-level bitwise subnet mathematics and provides network engineers with interactive visualization tools for binary subnetting, block dividing, and long-tail network auditing.

Designed with a premium, responsive dark-mode slate/zinc interface and optimized for lightning-fast performance, this tool serves as a lightweight, zero-maintenance static web application ideal for edge hosting platforms like Netlify, Vercel, or Cloudflare Pages.

---

## 🚀 Key Features

*   **Pure Bitwise Engine**: Implements pure JavaScript/TypeScript 32-bit integer arithmetic (zero dependency) to compute masks, network bounds, wildcard layouts, broadcast addresses, and usable host scopes.
*   **Edge-Case Support**: Complete native handling of point-to-point subnets (`/31` under RFC 3021) and loopback addresses (`/32`), resolving proper usable host limits without typical network software discrepancies.
*   **32-Bit Binary Visualizer**: Displays an interactive binary octet breakdown of the IP address, subnet mask, network address, and broadcast address, color-coding network/subnet bits in **emerald** and host bits in **amber**.
*   **Subnet Matrix Splitter**: Dynamically splits any parent network block into subnets of smaller sub-mask sizes. Lists results in a copyable grid table and offers a "Load" trigger to instantly swap calculated scopes.
*   **SEO & Revenue Ready**: Structurally optimized using semantic HTML5 layouts, schema-friendly SEO FAQ accordion, and pre-allocated CSS ad slots to guarantee zero Cumulative Layout Shift (CLS) when third-party ad tags are loaded.
*   **Deep Linking & History Persistence**: Automatically synchronizes calculation parameters (`ip` and `prefix`) with URL query parameters for instant sharing. Persists historical calculations in client-side `localStorage` with a 1.5s debounced autosave.

---

## 🛠️ Architecture & Tech Stack

*   **Framework**: [React 19](https://react.dev/) (TypeScript) for robust component-based state coordination.
*   **Bundler**: [Vite 6](https://vite.dev/) for extremely fast, tree-shaken production asset packaging.
*   **Styles**: [Tailwind CSS v4.0](https://tailwindcss.com/) for fluid, utility-driven typography, glassmorphism panels, and clean animations.
*   **Icons**: [Lucide React](https://lucide.dev/) for precise developer-focused iconography.
*   **Hosting**: Statically deployed to [Netlify Edge](https://www.netlify.com/) / [Cloudflare DNS](https://www.cloudflare.com/) for rapid globally cached routing.

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/cidr-calculator.git
    cd cidr-calculator
    ```

2.  **Install project dependencies**:
    ```bash
    npm install
    ```

3.  **Run the local development server**:
    ```bash
    npm run dev
    ```

4.  **Create a production build**:
    ```bash
    npm run build
    ```

---

## 💻 Code Highlights: Pure Bitwise Subnet Math

The calculation logic bypasses external dependency overheads by representing IPv4 octets as a unified 32-bit unsigned integer and executing raw bitwise masks:

```typescript
// Converts dotted-decimal IP string to a 32-bit unsigned integer
export function ipToLong(ip: string): number {
  const parts = ip.split('.').map(p => parseInt(p, 10));
  return (parts[0] * 16777216 + parts[1] * 65536 + parts[2] * 256 + parts[3]) >>> 0;
}

// Generates a 32-bit subnet mask long from prefix length (e.g., 24 -> 0xffffff00)
export function getMaskLong(prefix: number): number {
  if (prefix === 0) return 0;
  if (prefix === 32) return 0xffffffff;
  return (~((1 << (32 - prefix)) - 1)) >>> 0; // Unsigned shift
}

// Evaluates subnet boundaries
export function calculateSubnet(ip: string, prefix: number): SubnetResult {
  const ipLong = ipToLong(ip);
  const maskLong = getMaskLong(prefix);
  const wildcardLong = ~maskLong >>> 0;
  
  // Bitwise AND gives Network Address
  const networkLong = (ipLong & maskLong) >>> 0;
  // Bitwise OR with wildcard mask gives Broadcast Address
  const broadcastLong = (networkLong | wildcardLong) >>> 0;
  
  // ... Handles RFC 3021 /31 and /32 host bounds logic
}
```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
