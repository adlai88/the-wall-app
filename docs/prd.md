# Product Requirements Document

## The Wall - Shanghai Event Discovery App

Version: 1.0
Date: April 18, 2025
Author: [Your Name]

Key words: Poster Design, Categories

## 1. Overview

### 1.1 Product Vision
The Wall is a map-based event discovery application for Shanghai that allows users to find events happening around the city without the need for registration or social interactions. Users can view event posters pinned to locations on a map and upload their own events, which are moderated before being published.

### 1.2 Target Audience
- Expatriates and locals in Shanghai
- Event organizers and venue owners
- Tourists and visitors to the city
- People looking for social activities in Shanghai

### 1.3 Business Objectives
- Create a simplified, frictionless way to discover events in Shanghai
- Provide a platform for event organizers to promote their events
- Build a useful tool that serves the Shanghai community
- Establish a foundation for potential monetization models in the future

## 2. User Experience

### 2.1 User Personas

Casual Explorer - Li Wei
- Shanghai resident, 28 years old
- Wants to discover interesting events for the weekend
- Prefers visual browsing to reading through lists
- Values location-based decision making

Event Organizer - Maria
- Operates a small gallery space, 35 years old
- Needs simple ways to promote exhibitions
- Limited marketing budget
- Values reaching local audience

New Arrival - James
- Expatriate who recently moved to Shanghai, 31 years old
- Seeking to explore city culture and meet people
- Unfamiliar with local social media platforms
- Prefers English-language interfaces

### 2.2 User Journey Maps

Discovering Events
1. User opens app and sees current location on map
2. Map displays event posters pinned to locations
3. User navigates map to explore different areas
4. User taps on event poster to view details
5. User can see event dates, times, and full posters

Posting Events
1. User taps "Add Event" button
2. User uploads event poster image
3. User pins event to specific location on map
4. User sets event date/time frame
5. User submits for approval
6. Admin reviews and approves event
7. Event appears on the map for all users

## 3. Feature Requirements

### 3.1 MVP Features

#### 3.1.1 Map Interface
- Interactive map of Shanghai as the primary interface
- Event posters displayed as pins on the map
- Ability to zoom and pan the map
- Current location detection and centering
- Clustering for areas with multiple events

#### 3.1.2 Event Display
- Tapping a pin reveals a preview of the event poster
- Full event details view showing the complete poster
- Event date and time information
- Location details and directions
- Visual indication of time proximity (poster degradation effect)

#### 3.1.3 Event Submission
- Simple "Add Event" flow
- Poster image upload capability
- Location selection on map
- Date and time selection
- Optional brief description field
- Submission confirmation

#### 3.1.4 Moderation System
- Admin interface for reviewing submitted events
- Approve/reject functionality
- Notification system for new submissions
- Ability to edit submissions before approval
- Basic content filtering

#### 3.1.5 Time-Based Features
- Events automatically expire after end date/time
- Visual degradation of event posters as end time approaches
- Sorting/visibility options based on time (upcoming, happening now)

### 3.2 Future Features (Post-MVP)

#### 3.2.1 Weather Integration
- Current and forecasted weather displayed on map
- Weather-based event recommendations

#### 3.2.2 Advanced Filtering
- Filter by event type/category
- Filter by date range
- Filter by area/district

#### 3.2.3 Event Reminders
- Option to set reminders for events of interest
- Calendar export functionality

#### 3.2.4 Analytics Dashboard
- View of popular areas and times for events
- Metrics on poster views and engagement
- Data visualization for event organizers

## 4. Technical Requirements

### 4.1 Platforms
- Progressive Web App (PWA) with mobile-first design
- Optimized for iOS and Android devices
- Basic desktop support

### 4.2 Tech Stack
- Frontend: React or Vue.js
- Backend: Node.js/Express
- Database: PostgreSQL with Supabase
- Maps:
  - Intl: [https://felt.com/blog/javascript-sdk-for-map-apps](https://felt.com/blog/javascript-sdk-for-map-apps)
  - Local: Baidu Maps API, AutoNavi/Gaode Maps
- Image Storage: Supabase Storage
- Hosting: Alibaba Cloud (China-optimized)

### 4.3 Integration Requirements
- Baidu Maps or equivalent China-friendly mapping solution
- Weather API integration (future feature)
- Image optimization and processing service

### 4.4 Performance Requirements
- Map loading time < 3 seconds on 4G connections
- Image optimization for faster loading
- Efficient caching mechanisms
- Responsive across device sizes

### 4.5 China-Specific Requirements
- ICP license for hosting
- Compliance with local content regulations
- China-based servers for optimal performance
- Chinese language support

## 5. User Interface Requirements

### 5.1 Key Screens
- Map View (primary interface)
- Event Detail View
- Event Submission Flow
- About/Info Page
- Admin Moderation Interface

## 6. Data Requirements

### 6.1 Data Entities
- Events (location, dates, times, poster image, approval status)
- Locations (geographic coordinates, address information)
- Images (posters, optimized versions, thumbnails)
- Admin users (for moderation purposes)

### 6.2 Data Storage
- PostgreSQL database through Supabase
- Image storage with appropriate CDN for China

### 6.3 Data Security
- Basic encryption of admin credentials
- Secure admin access controls
- Content backup procedures

## 7. Success Metrics

### 7.1 User Engagement Metrics
- Number of daily active users
- Time spent in app
- Map navigation patterns
- Event detail views

### 7.2 Content Metrics
- Number of event submissions
- Approval rate of submissions
- Geographic distribution of events
- Temporal patterns of events

### 7.3 Performance Metrics
- App load time
- Map rendering performance
- Image loading speed
- Error rates

## 8. Launch Plan

### 8.1 Development Phases

1. Alpha (2 weeks)
- Core map functionality
- Basic event display
- Initial admin tools

2. Beta (4 weeks)
- Complete submission flow
- Moderation system
- Time-based features
- Performance optimization

3. MVP Launch (2 weeks)
- Final testing
- Deployment to production
- Soft launch to limited audience

### 8.2 Testing Strategy
- Internal alpha testing
- Limited beta with selected event organizers
- Usability testing with target user groups
- Performance testing on various devices and connections

### 8.3 Release Criteria
- Core features complete and functional
- Critical bugs resolved
- Performance requirements met
- Moderation system tested and operational
- China compliance requirements satisfied

## 9. Maintenance Plan

### 9.1 Monitoring
- Real-time performance monitoring
- Error tracking and alerting
- Usage analytics dashboard
- Content moderation queue monitoring

### 9.2 Updates
- Bi-weekly bug fix releases
- Monthly feature updates post-MVP
- Quarterly major releases for significant features

## 10. Open Questions & Risks

### 10.1 Open Questions
- Monetization approach (if any) for future sustainability
- Language strategy (English-only, bilingual, or Chinese-only)
- Potential partnerships with event venues or organizers
- Strategies for initial content seeding

### 10.2 Identified Risks
- China's regulatory environment for web applications
- Competition from existing platforms
- Content moderation scaling challenges
- User acquisition in a competitive market
- Map API reliability in China

## 10. Development Approach

### Phase 1: International Development Environment
- Maps: Use Mapbox or Felt SDK for development
- Hosting: Vercel, Netlify, or any platform you're familiar with
- Database: Continue with Supabase as planned
- Storage: Supabase Storage or AWS S3

### Phase 2: Limited Testing with Shanghai Users
- Deploy to international cloud providers that work adequately in China
- Get feedback from a small group of users in Shanghai
- Identify specific pain points related to China access

### Phase 3: China Adaptation (After Validation)
- Migrate mapping to AutoNavi/Gaode
- Transfer hosting to Alibaba Cloud
- Obtain necessary ICP licenses
- Optimize for Chinese internet infrastructure