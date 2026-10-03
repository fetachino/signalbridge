[![Build](https://github.com/fetachino/signalbridge/actions/workflows/ci.yml/badge.svg)](https://github.com/fetachino/signalbridge/actions/workflows/ci.yml)
[![Fire TV](https://img.shields.io/badge/target-Fire%20TV%20%7C%20Vega-111827)](https://developer.amazon.com/docs/vega/0.0/overview.html)
[![TypeScript](https://img.shields.io/badge/TypeScript-React-3178C6)](https://www.typescriptlang.org/)
[![Accessibility](https://img.shields.io/badge/focus-accessibility-6EE7E0)](https://www.w3.org/WAI/)

# SignalBridge

SignalBridge is an accessibility-first Fire TV experience that turns fast, visual broadcast alerts into clear spoken and visual guidance for viewers who may miss or misunderstand them.

> A living-room safety layer for the moments when the message matters most.

SignalBridge is being developed for the Amazon Developer Hackathon Fire TV track. The project combines TV-native interaction design, transparent computer-vision evidence, and accessibility features such as large text, source verification, and read-aloud guidance.

## Why it matters

Emergency and public-service information is often presented as small text, short-lived graphics, or dense captions. That can create a dangerous gap for people with low vision, older adults, people with cognitive disabilities, and anyone who needs information explained clearly. SignalBridge is designed to close that gap without hiding uncertainty from the viewer.

## Current prototype

This first slice is a polished, browser-verifiable TV experience shell. It includes:

- TV-style home screen with hero messaging and feature rails
- Primary navigation for Home, Live Monitor, and Alert History
- Remote-friendly, focusable actions and large 16:9 layout
- Arrow-key remote navigation between alert scenarios
- A live-feed style alert monitor
- Three realistic emergency and community alert scenarios
- Transparent detection trace with confidence indicators
- Read-aloud guidance using the browser speech engine
- Large-text accessibility mode
- Persistent accessibility preferences across sessions
- Optional automatic read-aloud for critical alerts
- Replaceable detection-pipeline contract with a live scan state
- Local frame-preprocessing telemetry for edge density, contrast, and processing time
- Lazy OpenCV.js Canny edge detection with a canvas fallback for unsupported WebViews
- Lazy Tesseract.js OCR with confidence reporting and an offline fixture fallback
- Alert history and source verification states

The prototype is intentionally honest about its current state. The frame scan now runs real lazy-loaded OpenCV.js Canny edge detection and Tesseract.js OCR against the demo frame when language data is available, with a deterministic fallback for offline WebViews. Alert scenarios and classification outputs remain curated fixtures until a live broadcast source and production classifier are connected.

The next implementation milestone is replacing the curated detection trace with real frame processing, OCR, and alert classification in the Fire TV runtime. The Amazon reference apps show the production direction we are targeting: shared TV components, platform-specific Fire TV/Vega builds, proper focus management, real media playback, and catalog-backed content.

## Product direction

The target architecture follows the patterns in Amazon's multi-TV reference applications:

```text
Fire TV / Vega app
        |
Shared TV screens and focus model
        |
Alert ingestion -> frame processing -> OCR/classification
        |                         |
Evidence + confidence       spoken guidance + visual overlay
```

The current web shell lets us validate the product interaction first. The next implementation phase will move the shared screens into a real Fire TV/Vega target with remote focus management, media playback, and testable alert fixtures.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. The app is designed for a 16:9 TV viewport and can be tested in a browser before moving into the Fire TV simulator.

## Quality and verification

```bash
npm run build
npm test
npm run package:firetv
npm run check:firetv
```

The build and detection-pipeline tests run in GitHub Actions on every push and pull request. `npm run package:firetv` creates a ZIP for Fire TV Web App Tester evaluation. The local prototype has been verified through the home screen, live monitor, alert history, accessibility controls, preference persistence, alert switching, scan interaction, and read-aloud interaction.

## Submission direction

Primary track: Fire TV. The project will be packaged as a demo-ready Fire TV/Vega application and accompanied by a short video, architecture diagram, evaluation examples, and limitations.

## About the builder

SignalBridge is built by [Ahmed Balde](https://github.com/fetachino), a software engineering builder focused on GIS and spatial data, QA automation, data analytics, AI engineering, and accessible product prototypes. The project reflects that mix by treating accessibility, evidence, and reproducible testing as first-class engineering concerns.

## Repository guide

- [Architecture notes](docs/architecture.md)
- [Fire TV and Vega port boundary](docs/fire-tv-port.md)
- [Hackathon submission checklist](docs/submission-checklist.md)
- [Roadmap](docs/ROADMAP.md)
- [Contribution guide](CONTRIBUTING.md)

## License

The source is available for hackathon review and portfolio demonstration. Licensing will be finalized when the Fire TV runtime and third-party dependencies are integrated.
