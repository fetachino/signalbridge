# Hackathon submission checklist

## Product proof

- [x] Home screen explains the problem in one sentence
- [x] Live monitor shows an alert, evidence, confidence, and recommended action
- [x] Alert history demonstrates more than one scenario
- [x] Accessibility controls are visible and interactive
- [x] Scan state is visible and testable
- [x] Browser shell has a deterministic fallback for judging
- [x] Production HTML5 ZIP can be generated for Fire TV Web App Tester
- [ ] ZIP tested on a Fire TV device with Web App Tester
- [ ] Fire TV or Vega simulator/device run captured
- [ ] Real broadcast fixture and OCR/classifier connected

## Demo recording

1. Open SignalBridge on the home screen and introduce the accessibility problem.
2. Enter Live Monitor and show the broadcast alert overlay.
3. Point out the detection trace, confidence, source verification, and recommended action.
4. Run Scan frame and show the processing state returning to readiness.
5. Open Accessibility and enable large text, captions, or voice guidance.
6. Switch to Alert History and select a different scenario.
7. Close with the Fire TV/Vega architecture and the limitation that the current shell uses deterministic fixtures.

## Submission copy reminders

- Describe the current browser build as a prototype shell, not a completed device binary.
- Explain that the detection contract is ready for OpenCV, OCR, and classifier integration.
- Include the public GitHub repository and a short demo video.
- Mention accessibility as the product's central user outcome, not only as a technical feature.
- Keep any claims about live detection, device testing, or cloud services tied to evidence from the actual demo.
