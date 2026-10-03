# Fire TV and Vega port boundary

SignalBridge currently uses a browser shell to validate product behavior quickly. The device implementation should preserve the same screen and data contracts while replacing the host-specific pieces below.

## Shared product layer

- Home, Live Monitor, Alert History, and Accessibility Control Center screens
- Alert event shape and `buildDetectionTrace` contract
- Voice guidance copy, confidence language, and uncertainty states
- Remote-first focus order and large-target interaction rules

## Fire TV adapter

The Fire TV target should provide the video surface, remote focus behavior, Android lifecycle handling, and the production media source. The browser speech engine should become the platform's speech/audio path. The mock broadcast scene should become a real video player or a recorded demo fixture.

## Vega adapter

The Vega target should reuse the shared screen model while using the Vega-compatible application shell, media APIs, and input/focus primitives. Keep computer vision and OCR behind a small service boundary so the UI can run against recorded fixtures during judging.

## Detection runtime boundary

```text
Video frame or fixture
        |
Frame sampler -> text region detector -> OCR -> alert classifier
        |              |                 |
Evidence image   extracted text      severity + location
        \______________  _______________/
                       \/
                DetectionRun contract
                       |
         visual overlay + captions + speech
```

The current `src/lib/detectionPipeline.ts` is deliberately deterministic, while `src/lib/frameAnalysis.ts` provides lightweight canvas pixel metrics for the browser package. These are seams for adding OpenCV preprocessing, OCR, and classification without coupling those dependencies to TV navigation.

## Device handoff checklist

1. Install the Fire TV/Vega toolchains and confirm a simulator or device is visible.
2. Create the platform shell using the official Amazon starter that matches the chosen runtime.
3. Move the shared alert data and screen components into the platform app.
4. Replace the demo scene with a recorded broadcast fixture and a real media surface.
5. Add on-device or local-service OCR/classification behind the `DetectionRun` contract.
6. Test remote focus, captions, voice guidance, large text, and recovery from an interrupted feed.
7. Record a short judging demo and retain this browser shell as the deterministic fallback.

The browser build remains an important fallback because it gives judges a reproducible interaction surface even when a device simulator is unavailable.

## Local Fire TV package

The repository includes a no-cloud packaging path for the current HTML5 shell:

```bash
npm run package:firetv
```

This creates `artifacts/signalbridge-firetv.zip` from the production `dist/` folder. Amazon's Web App Tester can load packaged HTML5 apps from a ZIP on a Fire TV device. The package is a real distributable web-app artifact, but it is not being described as a native Android APK or a Vega `.vpkg` until those toolchains are installed and the app is ported to them.

Run `npm run check:firetv` to inspect the local machine for Node.js, Java, ADB, Gradle, Android SDK, and Vega SDK availability. This check is informational and does not install software or contact AWS.
