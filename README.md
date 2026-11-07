# Event Nexus — Next-Gen Event Discovery & Digital Pass Platform

A modern, responsive event management web application engineered with an **"Obsidian & Aurora"** glassmorphic design system and **Privacy-Shielded Gate Pass architecture**.

## ✨ Key Innovations & Features
- **3D Cursor-Tracking Spotlight Cards:** Dynamic radial border illumination (`--mouse-x`, `--mouse-y`) with live capacity progress bars.
- **Command-Bar Discovery (`/` Shortcut):** Instant search across event titles, speakers, venues, and tags, paired with category pills and multi-criteria sorting.
- **Privacy-By-Design Digital Gate Pass:** Collects and validates participant Name, Email, Phone Number, and Selected Event for organizer records, while stripping raw PII (email/phone) from the visual boarding pass and QR payload to prevent shoulder-surfing and unauthorized QR harvesting.
- **All Bonus Challenges Implemented:**
  - 🌗 **Persistent Dark/Light Mode** synced with `localStorage`.
  - ⏱️ **Per-Second Live Countdown Timers** (`DD : HH : MM : SS`) on every card and the flagship spotlight.
  - 🎟️ **LocalStorage Digital Pass Wallet & Wishlist** with downloadable `.txt` gate passes (`ENX-XXXXXX`).

## 🛠️ Tech Stack
- **HTML5** (Semantic layout & custom SVG geometric node logo)
- **CSS3 & Tailwind CSS** (Aurora mesh animations, perforated ticket cutouts, cross-browser mask composites)
- **Vanilla JavaScript (ES6+)** (State management, regex form validation, LocalStorage persistence, QR integration)