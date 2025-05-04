# Project Status Board

- [x] Add debug log for formData.display_until before submission in PosterCreationModal.js
- [x] Add defensive code to ensure date is always in YYYY-MM-DD format before sending to backend
- [ ] User to test on mobile and report if error persists

# Executor's Feedback or Assistance Requests

- Added a console.log to output the value of formData.display_until before form submission. This will help verify what value is being sent from mobile browsers.
- Added defensive code to always convert the date to YYYY-MM-DD format before sending to the backend, regardless of input quirks.
- Please test the poster submission flow on your mobile device again. If the error persists, let me know what is logged in the console for 'Submitting display_until'.

# Current Status / Progress Tracking

- Awaiting user test and feedback on mobile poster submission.

# Lessons
- Mobile browsers may format date inputs differently, so always normalize date values before backend submission.
