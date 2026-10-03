# SignalBridge

SignalBridge is an accessibility-first Fire TV prototype that turns important on-screen alerts into clear spoken and visual guidance for viewers who may miss or misunderstand them.

## Current prototype

This first slice is a polished interactive demo shell for the Fire TV experience. It includes:

- A live-feed style alert monitor
- Three realistic emergency and community alert scenarios
- Transparent detection trace with confidence indicators
- Read-aloud guidance using the browser speech engine
- Large-text accessibility mode
- Alert history and source verification states

The next implementation milestone is replacing the curated detection trace with real frame processing, OCR, and alert classification in the Fire TV runtime.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. The app is designed for a 16:9 TV viewport and can be tested in a browser before moving into the Fire TV simulator.

## Submission direction

Primary track: Fire TV. The project will be packaged as a demo-ready Fire TV/Vega application and accompanied by a short video, architecture diagram, evaluation examples, and limitations.
