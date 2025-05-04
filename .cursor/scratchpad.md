# Background and Motivation

The goal is to make the app installable as a Progressive Web App (PWA), so users can add it to their homescreen and get a more native-like experience. This can improve engagement, offline access, and discoverability.

iOS users do not receive a native PWA install prompt. A custom bottom drawer/modal with instructions will help users add the app to their homescreen, improving install rates and user experience.

# Key Challenges and Analysis
- Ensuring the app meets PWA installability criteria (manifest, HTTPS, service worker, etc.)
- Integrating with Next.js (which has some PWA plugins but also SSR caveats)
- Handling caching and offline support without breaking dynamic features
- Testing install prompts and cross-device compatibility
- Reliably detecting iOS Safari (not Chrome, not Android)
- Detecting if the app is already running in standalone mode (already installed)
- Ensuring the drawer is not annoying (dismissible, remembers user choice)
- Providing clear, branded instructions

# High-level Task Breakdown

- [ ] **Add a Web App Manifest**
  - Success: `/manifest.json` is served, includes name, icons, theme color, etc., and is referenced in `<head>`.
- [ ] **Add a Service Worker**
  - Success: Service worker is registered, basic offline support is enabled (e.g., app shell loads offline).
- [ ] **Update `<head>` for PWA meta tags**
  - Success: Manifest, theme color, and mobile web app meta tags are present.
- [ ] **Test Installability**
  - Success: App passes Lighthouse PWA audit and shows "Add to Homescreen" prompt on supported devices.
- [ ] **(Optional) Add Custom Install Prompt**
  - Success: User sees a custom install prompt (if desired) instead of only browser default.
- [ ] **(Optional) Tune Caching Strategies**
  - Success: Dynamic content is not stale, static assets are cached efficiently.
- [ ] Detect iOS Safari and non-standalone mode  <!-- NEXT ACTION -->
  - Success: Drawer only shows for iOS Safari users who have not installed the app.
- [ ] Implement a bottom drawer/modal with instructions
  - Success: Drawer appears with clear steps and icons, similar to the provided screenshot.
- [ ] Add dismiss functionality and remember user choice
  - Success: User can close the drawer, and it won't reappear for a set period (e.g., 7 days).
- [ ] Test on real iOS devices
  - Success: Drawer appears only when appropriate, is dismissible, and does not interfere with app use.

# Project Status Board

- [x] Add debug log for formData.display_until before submission in PosterCreationModal.js
- [x] Add defensive code to ensure date is always in YYYY-MM-DD format before sending to backend
- [ ] User to test on mobile and report if error persists
- [x] Move Link field to Optional Details section in PosterCreationModal
- [x] Reorder Optional Details fields to: Title, Location Name, Link, Description
- [x] Preserve paragraph and line breaks in PosterView description rendering
- [x] Add extra spacing between paragraphs in PosterView description
- [x] Optimize image compression settings for best quality within Vercel Hobby limits
- [ ] Add manifest.json and reference in <head>
- [ ] Add service worker registration
- [ ] Add PWA meta tags
- [ ] Test installability (Lighthouse, device)
- [ ] (Optional) Custom install prompt
- [ ] (Optional) Tune caching
- [x] Implement Add to Home Screen drawer using vaul Drawer, styled per screenshot, with instructions and icons
- [x] Integrate drawer into main page with temporary trigger button for testing
- [x] Remove temporary trigger button and automate drawer for iOS Safari users (not in standalone, not recently dismissed)
- [ ] Await user confirmation of correct behavior on device

# Executor's Feedback or Assistance Requests

- Added a console.log to output the value of formData.display_until before form submission. This will help verify what value is being sent from mobile browsers.
- Added defensive code to always convert the date to YYYY-MM-DD format before sending to the backend, regardless of input quirks.
- Please test the poster submission flow on your mobile device again. If the error persists, let me know what is logged in the console for 'Submitting display_until'.
- The Link field has been moved to the Optional Details section in the PosterCreationModal as requested. The order of fields is now: Title, Location Name, Link, Description. Please review and confirm if this matches your expectations.
- PosterView now preserves paragraph and line breaks in the description, so pasted formatted text should display as intended. Extra spacing is now added between paragraphs. Please review and confirm if this resolves the formatting and spacing issue.
- Image compression settings have been optimized for best quality within Vercel Hobby limits (maxSizeMB: 1.5, maxWidthOrHeight: 1920, initialQuality: 0.92). Please review the new image quality and let me know if further adjustments are needed.
- The Add to Home Screen drawer now appears automatically for iOS Safari users who are not in standalone mode and have not dismissed it in the last 7 days. The temporary button has been removed. Please test on your device and confirm if the behavior matches your expectations.

# Current Status / Progress Tracking

- Starting basic PWA implementation. Next step: add manifest.json and reference it in <head>.

# Lessons
- Mobile browsers may format date inputs differently, so always normalize date values before backend submission.
- To preserve formatting for user-pasted text, split description by double newlines for paragraphs and single newlines for line breaks.
- Use margin-bottom on paragraph elements to visually separate paragraphs in rendered text.
- For best image quality within Vercel Hobby limits, use maxSizeMB: 1.5, maxWidthOrHeight: 1920, and initialQuality: 0.92 for browser-image-compression.
- Use the simplest PWA plugin for Next.js unless custom service worker logic is needed.
- Test on both iOS and Android for install prompt differences.
