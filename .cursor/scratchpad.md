# Background and Motivation

The goal is to make the app installable as a Progressive Web App (PWA), so users can add it to their homescreen and get a more native-like experience. This can improve engagement, offline access, and discoverability.

iOS users do not receive a native PWA install prompt. A custom bottom drawer/modal with instructions will help users add the app to their homescreen, improving install rates and user experience.

Currently, the list view displays posters from all cities, which can be overwhelming and less relevant for users. The goal is to provide a better UX by helping users see posters from their own city or region, making the content more personalized and useful.

# Key Challenges and Analysis
- Ensuring the app meets PWA installability criteria (manifest, HTTPS, service worker, etc.)
- Integrating with Next.js (which has some PWA plugins but also SSR caveats)
- Handling caching and offline support without breaking dynamic features
- Testing install prompts and cross-device compatibility
- Reliably detecting iOS Safari (not Chrome, not Android)
- Detecting if the app is already running in standalone mode (already installed)
- Ensuring the drawer is not annoying (dismissible, remembers user choice)
- Providing clear, branded instructions
- **City Detection:** How to determine the user's city? (Geolocation, user input, or IP-based lookup)
- **Poster Data:** Do posters have city/location metadata that can be reliably filtered?
- **Fallbacks:** What if the user's city can't be determined, or there are no posters in their city?
- **UI/UX:** How to present city selection or filtering in a way that's intuitive and non-intrusive?
- **Performance:** Efficiently filtering and displaying posters by city, especially with a large dataset.

# High-level Task Breakdown (Updated for 'Posters Around You' Model)

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
- [ ] Analyze current poster data for city/location fields and consistency
- [ ] Decide on city detection method (geolocation, user input, etc.)
- [ ] Design UI for city selection/filtering (auto-detect, dropdown, search, etc.)
- [ ] Implement city filter logic in the list view
- [ ] Add fallback/empty state for when no posters are available in the user's city
- [ ] Test UX on desktop and mobile
- [ ] Gather feedback and iterate
- [ ] Analyze poster data for coordinates/location fields and consistency
- [ ] Integrate geolocation logic (reuse weather feature logic)
- [ ] Filter posters by radius (e.g., 10–25km) around user's location
- [ ] Show only posters within this radius in the list view
- [ ] Add a header/banner: 'Posters Around You' with detected city/region and a 'Browse other locations' link
- [ ] If no posters are found nearby, show a friendly empty state and offer to browse other locations (manual city/region selection)
- [ ] Implement manual city/region selection as a fallback/override

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
- [x] Add margin to search results (PlaceSuggestions) on mobile to match the search input field (8px left/right)
- [x] Clear map search results after user selects a result and map flies to location (MapView UX improvement)
- [x] Map view toasts (Sonner) now appear top middle; poster view toasts remain bottom middle (UX improvement)
- [x] List view search results box now matches search input width on mobile (does not affect map view)
- [x] Category buttons in list view are now horizontally scrollable on mobile with edge blur (UI/UX improvement)
- [x] Category scroll blur overlays now only appear on mobile and only when needed (not on desktop, not when at scroll edge)
- [x] Fixed category scroll cropping by adding horizontal padding and adjusting blur overlay width; removed blue focus border from drawer (UI polish)
- [x] Removed rounded corners from thumbnails in the list view (UI tweak)
- [x] Removed border radius from images inside thumbnails in the list view (fully square images)
- [x] Changed thumbnail border to black/dark to match poster markers on map view
- [x] Highlighted category button is now black with white text (instead of orange)
- [x] Fixed category scroll blur overlays so they stay at the edge of the container and do not move with the badges
- [x] Added loading state to MapView to prevent markers from rendering until posters are loaded; loading indicator shown (fixes marker flash/disappear issue)
- [x] Loading indicator background now matches MapView background color (#e0e0e0) for visual consistency
- [x] Loading indicator overlay now has no background (fully transparent)
- [x] Made Drawer.Overlay background darker (rgba(0,0,0,0.48)) for all overlays and drawers
- [x] Remove the three emoji icons at the bottom of the About page (AboutInfoPage.js)
- [ ] Test UX on desktop and mobile
- [x] Updated About and List/Upcoming drawers to use height: '96vh' for better compatibility on both Safari and PWA.

# Executor's Feedback or Assistance Requests

- Added a console.log to output the value of formData.display_until before form submission. This will help verify what value is being sent from mobile browsers.
- Added defensive code to always convert the date to YYYY-MM-DD format before sending to the backend, regardless of input quirks.
- Please test the poster submission flow on your mobile device again. If the error persists, let me know what is logged in the console for 'Submitting display_until'.
- The Link field has been moved to the Optional Details section in the PosterCreationModal as requested. The order of fields is now: Title, Location Name, Link, Description. Please review and confirm if this matches your expectations.
- PosterView now preserves paragraph and line breaks in the description, so pasted formatted text should display as intended. Extra spacing is now added between paragraphs. Please review and confirm if this resolves the formatting and spacing issue.
- Image compression settings have been optimized for best quality within Vercel Hobby limits (maxSizeMB: 1.5, maxWidthOrHeight: 1920, initialQuality: 0.92). Please review the new image quality and let me know if further adjustments are needed.
- The Add to Home Screen drawer now appears automatically for iOS Safari users who are not in standalone mode and have not dismissed it in the last 7 days. The temporary button has been removed. Please test on your device and confirm if the behavior matches your expectations.
- Margin for search results on mobile now matches the search input field (8px left/right) as requested. Please review visually on a mobile device or emulator to confirm the change meets your expectations before marking complete.
- Map search results are now cleared after a user selects a result and the map flies to the location. This provides a cleaner and more intuitive user experience. Please review on your device and confirm if the behavior matches your expectations.
- Map view toasts (Sonner) now appear top middle for all map search and place selection actions, as requested. Poster view toasts are unchanged and remain bottom middle. Please review on your device to confirm the new toast positions meet your expectations.
- The search results box in the list view now matches the search input width on mobile, while the map view search results box remains unchanged. Please review visually to confirm the fix meets your expectations.
- The category buttons in the list view are now horizontally scrollable on mobile, with a blur effect on the left and right edges for visual polish. Please review on your device to confirm the new behavior and appearance meet your expectations.
- The left/right blur overlays for the category scroll now only appear on mobile and only when there is overflow in that direction. This resolves the visual issue on desktop and improves mobile UX. Please review on your device to confirm the fix meets your expectations.
- Category scroll now has horizontal padding so the first and last buttons are not cropped by the blur overlays. Blur overlay width was also slightly reduced. A global style was added to remove the blue focus border from the drawer and its children. Please review on your device to confirm both issues are resolved.
- Thumbnails in the list view no longer have rounded corners. Please review visually to confirm the change meets your expectations.
- The border radius has been removed from the images inside the thumbnails in the list view, so they are now fully square. Please review visually to confirm the change meets your expectations.
- The thumbnail border is now black/dark (#222) to match the poster markers on the map view. Please review visually to confirm the change meets your expectations.
- The highlighted (selected) category button is now black with white text, instead of orange. Please review visually to confirm the change meets your expectations.
- The blur overlays for the category scroll are now fixed at the left/right edge of the container and do not move with the badges when scrolling. Please review on your device to confirm the fix meets your expectations.
- A loading state was added to MapView so markers are not rendered until posters are loaded, and a loading indicator is shown. This should address the issue of markers flashing and disappearing on initial load. Please review the behavior and let me know if the issue is resolved or if further investigation is needed.
- The loading indicator overlay now uses the same background color as the MapView (#e0e0e0) for a seamless and consistent appearance. Please review visually to confirm the change meets your expectations.
- The loading indicator overlay now has no background, making it fully transparent. Please review visually to confirm the change meets your expectations.
- The Drawer.Overlay background is now darker (rgba(0,0,0,0.48)) for all overlays and drawers, making the modal effect more pronounced. Please review visually to confirm the change meets your expectations.
- The three emoji icons (📱💬📍) at the bottom of the About page have been removed as requested. User has confirmed the change is complete. No further action needed for this task.

# Current Status / Progress Tracking

- Starting basic PWA implementation. Next step: add manifest.json and reference it in <head>.

# Lessons
- Mobile browsers may format date inputs differently, so always normalize date values before backend submission.
- To preserve formatting for user-pasted text, split description by double newlines for paragraphs and single newlines for line breaks.
- Use margin-bottom on paragraph elements to visually separate paragraphs in rendered text.
- For best image quality within Vercel Hobby limits, use maxSizeMB: 1.5, maxWidthOrHeight: 1920, and initialQuality: 0.92 for browser-image-compression.
- Use the simplest PWA plugin for Next.js unless custom service worker logic is needed.
- Test on both iOS and Android for install prompt differences.
- When aligning UI elements on mobile, match margin and padding values between related components (e.g., search input and dropdown) for a consistent look. User review is important for final confirmation.

## Success Criteria (Updated)
- By default, users see only posters within a set radius of their current location
- Users can browse other locations if desired or if no local posters are found
- The experience is seamless, non-intrusive, and works even if geolocation is denied
