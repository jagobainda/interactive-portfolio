# 🚀 Interactive Minimal Portfolio – jagoba.dev

Feel free to fork, explore, and adapt. For any questions or contributions, open an issue or submit a pull request.

This repository contains the source code for my personal portfolio website: a fully client-side, frameworkless, and ultra-minimal developer-centric CV. Every choice in the stack is intentional, focusing on performance, clarity, and direct control without unnecessary abstractions.

## 📦 Key Highlights

-   🚀 Ultra-fast loading – No framework overhead
-   📦 Tiny bundle size – Optimized for best performance
-   🎯 Full control – No unnecessary abstractions
-   💡 Easy maintenance – Direct, readable code
-   🔧 Simple debugging – No extra layers or virtual DOM

## 🧠 Design Philosophy

Crafted to engage both developers and recruiters, the site offers:

-   🚀 Instant loading – immediate access to your skills
-   📋 Recruiter-friendly layout – clear presentation of credentials
-   📱 Scroll-free experience on all devices
-   🔍 Minimal, transparent code for easy review
-   🎯 Focus on essential content and interaction

## 🧰 Stack Rationale

The project is built with a strict minimalist philosophy in mind. Each component is chosen to maximize transparency, performance, and developer control:

-   **TypeScript**: Strong typing with zero runtime overhead, boosting confidence and maintainability.
-   **No frameworks**: Avoids React/Vue/Svelte to eliminate unnecessary abstraction layers and performance costs.
-   **Vanilla HTML/CSS/JS**: Offers full control over rendering and performance.
-   **Modular structure**: Each part is logically split (`/src`, `/public/data`, etc.) for clarity and separation of concerns.
-   **Data-driven UI**: Modal contents and language strings are handled via plain JSON files – simple, scalable, and easy to localize.

This approach ensures that the site remains fast, lightweight, and easily auditable by any developer or recruiter reviewing the source.

## 🗂️ Project Structure

```
.
├── public/             # Static assets (HTML, CSS, JSON, images)
│   ├── data/           # Modal content (localized)
│   ├── dist/           # Compiled JS output (main.js)
│   ├── imgs/favicon/   # Icons & manifest
│   ├── language-strings/  # UI language strings
│   └── style/          # Main stylesheet
│
├── src/                # Source TypeScript files
│   └── main.ts         # App entry point
│
├── .vscode/            # Editor settings
├── node_modules/       # Development dependencies
├── LICENSE             # MIT License
├── package.json        # Project metadata and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## 📬 Deployment & CI/CD

-   Hosted on an OVH VPS with Apache
-   Cloudflare DNS-only for fast resolution
-   Let’s Encrypt SSL with automated certbot renewal
-   Daily git pull + service reload for updates
