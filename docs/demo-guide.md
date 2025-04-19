# The Wall App - Demo Guide

This guide will walk you through the key features of The Wall app prototype.

## 1. Starting the Application

To run the application locally:

```bash
cd the-wall-app
npm install
npm start
```

This will start both the frontend and backend servers. The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 2. Map View (Main Interface)

The main interface shows a map of Shanghai with event pins using OpenStreetMap with Leaflet. You can:

- Pan and zoom the map using mouse/touch controls
- Click the "+" and "-" buttons to zoom in and out
- Click the location button (📍) to center the map on your current location
- Tap on event pins to see event previews
- Click on event previews to view full event details

## 3. Event Detail View

When you click on an event preview, you'll be taken to the event detail view where you can see:

- Full event poster
- Event title, date, and time
- Location details
- Event description
- Time proximity indicator (e.g., "Happening in 2 days")
- Action buttons for directions and sharing

## 4. Event Submission Flow

To add a new event:

1. Click the "+" button on the map view
2. Follow the 3-step submission process:
   - Step 1: Upload event poster and enter event title/category
   - Step 2: Enter venue name, address, and pin location on map
   - Step 3: Set event date/time and add optional description
3. Submit the event for approval
4. You'll see a confirmation screen once submitted

## 5. Admin Moderation Interface

To access the admin interface:

1. Navigate to /admin in the URL
2. View pending events that need approval
3. Approve or reject events using the action buttons
4. Switch between tabs to view approved and rejected events

## 6. About Page

The About page provides information about the app, how it works, and contact details. Access it by clicking "About" in the bottom navigation.

## 7. Testing Scenarios

Here are some scenarios to test the app's functionality:

### Scenario 1: Discovering Events
1. Open the app to the map view
2. Pan and zoom around Shanghai
3. Click on different event pins
4. View event details

### Scenario 2: Submitting a New Event
1. Click the "+" button
2. Upload a poster image
3. Fill in event details
4. Submit the event
5. Check the admin interface to see the pending event

### Scenario 3: Moderating Events
1. Go to the admin interface
2. Review pending events
3. Approve or reject events
4. Verify that approved events appear on the map

## 8. Notes for Production Deployment

For a production deployment in China, you would need to:
- Use OpenStreetMap with Leaflet (already implemented) or consider Baidu Maps/AutoNavi for local compliance
- Host on Alibaba Cloud
- Obtain an ICP license
- Ensure compliance with local content regulations

This prototype demonstrates the core functionality and user experience as specified in the PRD.
