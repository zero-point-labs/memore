# Event Booking Implementation Plan

## 📋 Overview

This document outlines the complete implementation plan for adding event booking functionality to the Memora platform. The system will allow users to book events without payment processing, with pricing displayed for paid events and free entry options available.

## 🎯 Goals

- Enable users to book events through a streamlined booking process
- Display event pricing clearly (free or paid)
- Provide admin tools to manage event bookings
- Track event capacity and booking status
- Integrate with existing user authentication and profile system

## 📊 Current State Analysis

### ✅ Already Implemented
- Complete event data structure with pricing, capacity, and booking status
- Event listing page (`/events`) with filtering capabilities
- Individual event detail pages (`/event/[id]`) with ticket selection UI
- Admin event management (create, edit, delete events)
- Admin dashboard with event statistics
- User authentication system
- User profile management
- Trip booking system (can be used as reference)

### ❌ Missing Components
- Event booking collection/database structure
- Event booking form component
- Event booking API endpoints
- Admin view of event bookings
- User's event booking history
- Event booking confirmation system

## 🏗️ Implementation Phases

### Phase 1: Database & Data Structure
**Estimated Time: 1-2 days**

#### 1.1 Create Event Bookings Collection
- **File**: `scripts/setup-event-bookings-collection.js`
- **Collection Name**: `event_bookings`
- **Attributes**:
  ```javascript
  [
    { key: 'eventId', type: 'string', size: 255, required: true },
    { key: 'userId', type: 'string', size: 255, required: true },
    { key: 'userProfileId', type: 'string', size: 255, required: true },
    { key: 'ticketType', type: 'enum', elements: ['general', 'vip'], required: true },
    { key: 'quantity', type: 'integer', required: true },
    { key: 'totalPrice', type: 'double', required: true },
    { key: 'currency', type: 'string', size: 10, required: true },
    { key: 'bookingStatus', type: 'enum', elements: ['confirmed', 'cancelled'], required: true },
    { key: 'specialRequests', type: 'string', size: 1000, required: false },
    { key: 'bookingReference', type: 'string', size: 50, required: true }
  ]
  ```

#### 1.2 Update Type Definitions
- **File**: `src/types/event.ts`
- **Add**: `EventBooking` interface and related types
- **Add**: `EventBookingStatus` enum
- **Add**: `CreateEventBookingData` interface

#### 1.3 Create Event Booking Service
- **File**: `src/services/eventBookingService.ts`
- **Methods**:
  - `createBooking(data: CreateEventBookingData)`
  - `getBookingsByEvent(eventId: string)`
  - `getBookingsByUser(userId: string)`
  - `updateBookingStatus(id: string, status: EventBookingStatus)`
  - `cancelBooking(id: string)`

### Phase 2: Booking Form Component
**Estimated Time: 2-3 days**

#### 2.1 Create Event Booking Form
- **File**: `src/components/EventBookingForm.tsx`
- **Features**:
  - Personal information fields (pre-filled from user profile)
  - Ticket type selection (General/VIP)
  - Quantity selector
  - Special requests textarea
  - Price display (free or paid)
  - Form validation
  - Loading states

#### 2.2 Create Event Booking Modal
- **File**: `src/components/EventBookingModal.tsx`
- **Features**:
  - Modal wrapper for booking form
  - Event details summary
  - Booking confirmation
  - Success/error states

#### 2.3 Update Event Detail Page
- **File**: `src/app/event/[id]/page.tsx`
- **Changes**:
  - Replace placeholder booking button with actual booking modal
  - Add booking form integration
  - Update capacity display based on bookings
  - Show pricing information clearly

### Phase 3: API Endpoints
**Estimated Time: 1-2 days**

#### 3.1 Create Event Booking API
- **File**: `src/app/api/events/[id]/book/route.ts`
- **Methods**:
  - `POST` - Create new event booking
  - Validation of event availability
  - Capacity checking
  - Booking reference generation

#### 3.2 Create Event Bookings Management API
- **File**: `src/app/api/events/[id]/bookings/route.ts`
- **Methods**:
  - `GET` - Get all bookings for an event (admin only)
  - `PUT` - Update booking status (admin only)

#### 3.3 Create User Event Bookings API
- **File**: `src/app/api/user/event-bookings/route.ts`
- **Methods**:
  - `GET` - Get user's event bookings
  - `PUT` - Update user's booking
  - `DELETE` - Cancel user's booking

### Phase 4: Admin Management
**Estimated Time: 2-3 days**

#### 4.1 Create Admin Event Bookings Page
- **File**: `src/app/admin/events/[id]/bookings/page.tsx`
- **Features**:
  - List all bookings for specific event
  - Filter by booking status
  - Search by user name/email
  - Export booking data (CSV/PDF)
  - Bulk actions (confirm/cancel)

#### 4.2 Update Admin Events Page
- **File**: `src/app/admin/events/page.tsx`
- **Changes**:
  - Add "View Bookings" button for each event
  - Show booking count in event cards
  - Add booking statistics

#### 4.3 Update Admin Dashboard
- **File**: `src/app/admin/dashboard/page.tsx`
- **Changes**:
  - Add event booking statistics
  - Show recent event bookings
  - Compare event vs trip bookings

### Phase 5: User Experience
**Estimated Time: 1-2 days**

#### 5.1 Update User Bookings Page
- **File**: `src/app/account/bookings/page.tsx`
- **Changes**:
  - Show both trip and event bookings
  - Add event booking details view
  - Allow cancellation if within policy
  - Separate tabs for trips and events

#### 5.2 Create Event Booking Success Page
- **File**: `src/app/event/[id]/booking-success/page.tsx`
- **Features**:
  - Booking confirmation details
  - QR code for event entry (optional)
  - Event details reminder
  - Share booking confirmation

#### 5.3 Email Notifications
- **Files**: 
  - `src/app/api/events/[id]/book/route.ts` (add email sending)
  - Email templates for event booking confirmation
- **Features**:
  - Booking confirmation email
  - Event reminder email (24h before)
  - Cancellation confirmation email

## 🔧 Technical Implementation Details

### Database Schema
```typescript
interface EventBooking {
  id?: string;
  eventId: string;           // Links to event
  userId: string;           // Links to Appwrite user
  userProfileId: string;    // Links to user profile
  ticketType: 'general' | 'vip';
  quantity: number;
  totalPrice: number;       // 0 for free events
  currency: string;         // 'EUR'
  bookingStatus: 'confirmed' | 'cancelled';
  specialRequests?: string;
  bookingReference: string; // Unique booking reference
  createdAt?: string;
  updatedAt?: string;
}
```

### Key Components Structure
```
src/
├── components/
│   ├── EventBookingForm.tsx
│   ├── EventBookingModal.tsx
│   └── EventBookingCard.tsx
├── services/
│   └── eventBookingService.ts
├── types/
│   └── event.ts (updated)
└── app/
    ├── api/
    │   ├── events/[id]/book/route.ts
    │   ├── events/[id]/bookings/route.ts
    │   └── user/event-bookings/route.ts
    ├── admin/
    │   └── events/[id]/bookings/page.tsx
    ├── account/
    │   └── bookings/page.tsx (updated)
    └── event/[id]/
        ├── page.tsx (updated)
        └── booking-success/page.tsx
```

### API Endpoints
1. `POST /api/events/[id]/book` - Create event booking
2. `GET /api/events/[id]/bookings` - Get event bookings (admin)
3. `GET /api/user/event-bookings` - Get user's event bookings
4. `PUT /api/user/event-bookings/[id]` - Update user's booking
5. `DELETE /api/user/event-bookings/[id]` - Cancel user's booking

## 🎨 User Flow

### Customer Booking Flow
1. **Browse Events**: User visits `/events` page
2. **Select Event**: Clicks on event → goes to `/event/[id]`
3. **Choose Tickets**: Selects ticket type (General/VIP) and quantity
4. **Book Event**: Clicks "Book Now" → opens booking modal
5. **Fill Form**: Completes booking form (personal info, special requests)
6. **Confirm**: Reviews booking details and confirms
7. **Success**: Redirected to booking success page
8. **Confirmation**: Receives email confirmation

### Admin Management Flow
1. **View Events**: Admin goes to `/admin/events`
2. **Select Event**: Clicks "View Bookings" for specific event
3. **Manage Bookings**: Views all bookings, can confirm/cancel
4. **Export Data**: Can export booking lists for external use
5. **Analytics**: Views booking statistics in dashboard

## 📊 Success Metrics

### User Experience
- Booking completion rate > 80%
- Form completion time < 3 minutes
- User satisfaction with booking process

### Admin Efficiency
- Time to view/manage bookings < 30 seconds
- Export functionality working correctly
- Real-time capacity updates

### System Performance
- Booking creation < 2 seconds
- Page load times < 3 seconds
- Zero data loss during booking process

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Database collection created and tested
- [ ] All API endpoints tested
- [ ] Frontend components tested
- [ ] Admin functionality verified
- [ ] Email notifications working
- [ ] Mobile responsiveness checked

### Post-deployment
- [ ] Monitor booking creation success rate
- [ ] Check email delivery rates
- [ ] Verify admin dashboard functionality
- [ ] Test user booking flow end-to-end
- [ ] Monitor system performance

## 🔄 Future Enhancements

### Phase 6: Advanced Features (Future)
- QR code generation for event entry
- Waitlist functionality for sold-out events
- Group booking discounts
- Event check-in system
- Integration with external ticketing systems
- Advanced analytics and reporting

## 📝 Notes

- All pricing will be displayed clearly (free events will show "Free Entry")
- Event capacity will be automatically updated when bookings are made
- Booking status will be managed through admin panel
- User can cancel bookings within specified time limits
- All bookings are stored with proper audit trail

---

**Total Estimated Development Time: 6-10 days**
**Priority: High**
**Dependencies: Existing event system, user authentication, admin panel**
