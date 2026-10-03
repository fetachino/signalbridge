# SignalBridge architecture notes

## Current web-verifiable slice

The current prototype is a React and TypeScript TV shell. It uses deterministic fixtures so the interaction can be tested without AWS, a camera, or a live broadcast feed.

```text
React UI
  ├─ Home: hero and alert rails
  ├─ Live monitor: broadcast surface and guidance card
  ├─ Alert history: household signal log
  └─ Accessibility controls: large text and read-aloud guidance
```

## Target Fire TV architecture

The target implementation will use the Amazon multi-TV patterns with shared screen components and platform-specific Fire TV/Vega adapters.

```text
Media source
  -> frame sampling
  -> image preprocessing
  -> OCR and alert classification
  -> evidence record { text, location, severity, confidence, timestamp }
  -> user-facing guidance
```

SignalBridge should keep evidence and confidence visible. The system must distinguish detected facts from generated guidance and provide a clear fallback when confidence is too low.

## Engineering constraints

- The demo must work with the Fire TV or Vega simulator.
- Remote navigation must be usable without a touch screen.
- Core alert handling should remain useful when network services are unavailable.
- Any cloud or AI enhancement must be optional and cost-controlled.
- Test fixtures must include normal alerts, ambiguous frames, missing text, and conflicting signals.
