<div align="center">
  
  <a href="https://subnetmask.tech">
    <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,nodejs,git,github,netlify&theme=light" alt="Tech Stack Logos" />
  </a>

  <br/>
  <br/>

  <h1>SubnetMask.tech 🌐</h1>
  
  <p><b>A high-performance, zero-latency IPv4 CIDR calculator and network design utility.</b></p>

  <p>
    <a href="https://subnetmask.tech"><img src="https://img.shields.io/badge/Live_Demo-subnetmask.tech-06B6D4?style=for-the-badge" alt="Live Demo" /></a>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  </p>
  
  <br/>
</div>

## 🚀 Key Engineering Achievements
* **Zero-Latency Client-Side Processing:** Engineered entirely on the client utilizing React state mechanics, ensuring subnet calculations and bitwise operations execute instantly without server round-trips.
* **Bulletproof Responsive Architecture:** Implemented rigid flex-shrink constraints and dynamic grid track truncation to guarantee that complex IP strings and input octets never overlap or break mid-string, even on extremely narrow 320px mobile viewports.
* **Embeddable Widget Engine:** Designed an isolated, self-contained iframe architecture (`/widget`) with strict DOM boundary limits, allowing third-party documentation platforms to embed the calculator without layout implosions.
* **High-Fidelity UI/UX:** Built a custom event-interception engine using non-passive wheel listeners (`{ passive: false }`) to allow rapid input scrolling without hijacking the main browser window's vertical scroll state.

## 💻 Local Development
Clone the repository and boot the engine locally:

```bash
git clone https://github.com/yourusername/subnetmask-tech.git
cd subnetmask-tech
npm install
npm run dev
```

## 🛡️ Architecture & Compliance
This repository maintains strict deployment hygiene. All production builds run through rigorous TypeScript compiler checks (`npx tsc --noEmit`). The application is fully compliant with Google AdSense transparency requirements and Brave Creator network token verification protocols.
