# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-21

### Added
- **Input Validation Hardening:** Added strict image URL schema validation on the `PATCH /api/prompts/[id]` route handler using Zod schema verification.
- **Provider Support:** Added `images.unsplash.com` and `unsplash.com` to the allowed image URL domain list in `src/lib/validation.ts`.
- **Aesthetic Enhancements:** Added ambient background spotlight radial glows and a premium "Deployed Core Integrations" badges row to the logged-out landing page in `src/app/page.tsx`.
- **Unit Testing:** Added Vitest unit test cases for Unsplash asset domain checks in `src/lib/__tests__/validation.test.ts`.

### Changed
- **Bootloader Removal:** Removed the simulated booting countdown overlay, associated useEffect loops, and console logging states to allow instant page mounting and interactive capability.
- **Clerk Sign-In Mode:** Changed the Clerk sign-in mode from `modal` to `redirect` on the landing page, sending unauthenticated users directly to our custom-designed `/sign-in` route.
- **Secure Webhooks:** Corrected Clerk webhook signature verification in `src/app/api/webhooks/clerk/route.ts` to utilize the raw request body string (`req.text()`) rather than re-serializing a parsed JSON object.

### Removed
- **Curated Photo Editing Previews:** Removed the static preview `image_url` fields for all 100 prompts under the `Photo Editing` category in `src/data/prompts.json`.

### Fixed
- **Bypassed waste HTTP calls:** Optimized the client-side `fetchPrompts` hook in `src/app/page.tsx` to immediately load static fallback prompts if `isSignedIn` is false, preventing unnecessary `401 Unauthorized` requests.
- **Middleware Stability:** Wrapped the Upstash Redis client import-time initialization in `src/middleware.ts` within checking gates and `try-catch` handlers to fail-open gracefully when credentials are not configured.
