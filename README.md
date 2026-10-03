# SignalBridge

SignalBridge is an accessibility-first Fire TV prototype that turns important on-screen alerts into clear spoken and visual guidance for viewers who may miss or misunderstand them.

## Current prototype

This first slice is a polished TV experience shell for the Fire TV track. It includes:

- TV-style home screen with hero messaging and feature rails
- Primary navigation for Home, Live Monitor, and Alert History
- Remote-friendly, focusable actions and large 16:9 layout
- A live-feed style alert monitor
- Three realistic emergency and community alert scenarios
- Transparent detection trace with confidence indicators
- Read-aloud guidance using the browser speech engine
- Large-text accessibility mode
- Alert history and source verification states

The next implementation milestone is replacing the curated detection trace with real frame processing, OCR, and alert classification in the Fire TV runtime. The Amazon reference apps show the production direction we are targeting: shared TV components, platform-specific Fire TV/Vega builds, proper focus management, real media playback, and catalog-backed content.

## Reference architecture

The Amazon multi-TV samples use a shared UI layer with separate app targets for Fire OS, Vega OS, and web. Their video and sports samples add a real catalog, focus navigation, and media playback. SignalBridge is intentionally starting with a browser-verifiable experience so the product interaction can be tested before the local machine has the Android or Vega SDK installed. We will migrate the shared screens into the Fire TV target once the SDK toolchain is available.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. The app is designed for a 16:9 TV viewport and can be tested in a browser before moving into the Fire TV simulator.

## Submission direction

Primary track: Fire TV. The project will be packaged as a demo-ready Fire TV/Vega application and accompanied by a short video, architecture diagram, evaluation examples, and limitations.
