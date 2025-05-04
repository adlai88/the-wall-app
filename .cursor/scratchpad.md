# Project Status Board

- [x] Add debug log for formData.display_until before submission in PosterCreationModal.js
- [x] Add defensive code to ensure date is always in YYYY-MM-DD format before sending to backend
- [ ] User to test on mobile and report if error persists
- [x] Move Link field to Optional Details section in PosterCreationModal
- [x] Reorder Optional Details fields to: Title, Location Name, Link, Description
- [x] Preserve paragraph and line breaks in PosterView description rendering
- [x] Add extra spacing between paragraphs in PosterView description

# Executor's Feedback or Assistance Requests

- Added a console.log to output the value of formData.display_until before form submission. This will help verify what value is being sent from mobile browsers.
- Added defensive code to always convert the date to YYYY-MM-DD format before sending to the backend, regardless of input quirks.
- Please test the poster submission flow on your mobile device again. If the error persists, let me know what is logged in the console for 'Submitting display_until'.
- The Link field has been moved to the Optional Details section in the PosterCreationModal as requested. The order of fields is now: Title, Location Name, Link, Description. Please review and confirm if this matches your expectations.
- PosterView now preserves paragraph and line breaks in the description, so pasted formatted text should display as intended. Extra spacing is now added between paragraphs. Please review and confirm if this resolves the formatting and spacing issue.

# Current Status / Progress Tracking

- Awaiting user test and feedback on mobile poster submission.
- Awaiting user review of Link field placement and field order in modal.
- Awaiting user review of description formatting and paragraph spacing in PosterView.

# Lessons
- Mobile browsers may format date inputs differently, so always normalize date values before backend submission.
- To preserve formatting for user-pasted text, split description by double newlines for paragraphs and single newlines for line breaks.
- Use margin-bottom on paragraph elements to visually separate paragraphs in rendered text.
