---
name: CIDR Calculator
description: Advanced IPv4 CIDR Calculator & Subnet Splitter
colors:
  primary: "#22d3ee"
  accent-emerald: "#34d399"
  accent-amber: "#f59e0b"
  neutral-bg: "#f4f4f5"
  neutral-bg-dark: "#09090b"
  neutral-surface: "rgba(255, 255, 255, 0.75)"
  neutral-surface-dark: "rgba(24, 24, 27, 0.72)"
  neutral-border: "#e4e4e7"
  neutral-border-dark: "#27272a"
  text-main: "#09090b"
  text-main-dark: "#fafafa"
  text-muted: "#71717a"
  text-muted-dark: "#a1a1aa"
typography:
  display:
    fontFamily: "'Geist', system-ui, -apple-system, sans-serif"
  body:
    fontFamily: "'Geist', system-ui, -apple-system, sans-serif"
  label:
    fontFamily: "'Geist Mono', 'JetBrains Mono', monospace"
rounded:
  card: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  bento-card:
    rounded: "{rounded.card}"
    backgroundColor: "{colors.neutral-surface-dark}"
---

# Design System: CIDR Calculator

## 1. Overview

**Creative North Star: "The Night Terminal"**

This system is built around a dark, glowing, developer-native atmosphere. It prioritizes clarity over decoration, treating the math and data as the hero. Layouts employ asymmetric precision rather than predictable, monotonous blocks. The aesthetic explicitly rejects generic "AI Slop" SaaS templates, the "card-nested-in-card" architecture, and heavy white backing sheets dropping onto flat gray canvas spaces.

**Key Characteristics:**
- Developer-native and technical.
- Tactile and responsive micro-interactions.
- Asymmetric layout grids.
- Impeccable contrast and crisp fundamentals.

## 2. Colors

A technical palette anchored by vibrant cyan against deep zinc canvases.

### Primary
- **Electric Cyan** (#22d3ee): The core accent. Used for active states, slider thumbs, and glowing text.

### Secondary
- **Emerald** (#34d399): Used for positive indicators and secondary gradients.
- **Amber** (#f59e0b): Used for warnings or highlights.

### Neutral
- **Zinc Background** (#09090b dark / #f4f4f5 light): The main app canvas, textured with a subtle mesh background.
- **Zinc Surface** (rgba(24, 24, 27, 0.72) dark): The semi-transparent bento card backdrop.
- **Zinc Border** (#27272a dark): Used for subtle structure.
- **Zinc Text Main** (#fafafa dark): Primary data and headings.
- **Zinc Text Muted** (#a1a1aa dark): Secondary metadata.

**The One Voice Rule.** The primary accent (Electric Cyan) is used deliberately for interaction points and active states. It should not overwhelm the data.

## 3. Typography

**Display Font:** Geist (with system-ui fallback)
**Body Font:** Geist (with system-ui fallback)
**Label/Mono Font:** Geist Mono (with JetBrains Mono, monospace fallback)

**Character:** Technical, pristine, and highly legible. The sans-serif is crisp and modern, while the mono font lends a developer-native authority to IP addresses and binary strings.

### Hierarchy
- **Display**: Used for main page headers.
- **Headline**: Used for bento card titles.
- **Body**: Used for explanatory text and primary data blocks.
- **Label**: Used for IP addresses, binary strings, and technical readouts.

## 4. Elevation

The system uses a "Subtle Lift" philosophy. Surfaces use soft ambient shadows to provide gentle separation from the background mesh.

### Shadow Vocabulary
- **Card Rest** (`0 8px 32px -8px rgba(0, 0, 0, 0.5)` in dark mode): Soft ambient grounding.
- **Card Hover** (`0 0 0 1px rgba(34, 211, 238, 0.08), 0 8px 32px -8px rgba(0, 0, 0, 0.5), 0 0 60px -20px rgba(34, 211, 238, 0.06)`): A glowing, elevated state that responds to interaction.

## 5. Components

### Bento Cards
- **Shape:** 12px radius.
- **Background:** Semi-transparent zinc surfaces.
- **Hover / Focus:** Scale up slightly (1.005) with an enhanced glowing shadow.

### Custom Slider
- **Style:** Cyan track with a zinc unselected region.
- **Thumb:** Cyan circle with a glowing box-shadow.
- **Hover:** The thumb scales up to 1.2 and intensifies its glow.

### Active Tab Indicator
- **Style:** A 2px high underline using a linear gradient from Electric Cyan to Emerald.

## 6. Do's and Don'ts

### Do:
- **Do** use content-driven, intentional layout grids rather than predictable blocks.
- **Do** apply the Electric Cyan glow selectively to draw attention to active input or critical results.

### Don't:
- **Don't** use generic "AI Slop" SaaS templates.
- **Don't** use a "card-nested-in-card" architecture.
- **Don't** use redundant decorative icon tiles next to every heading.
- **Don't** use giant, heavy white backing sheets dropping onto flat gray canvas spaces.
- **Don't** use identical grid blocks that ignore content structure.
