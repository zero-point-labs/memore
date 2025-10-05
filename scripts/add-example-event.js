/**
 * Script to add an example event to test the events system
 * Run this after creating the events collection
 * 
 * Usage: node scripts/add-example-event.js
 */

require('dotenv').config({ path: '.env.local' });

const { Client, Databases, ID } = require('node-appwrite');

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const API_KEY = process.env.APPWRITE_API_KEY;
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

const exampleEvent = {
  // Identification
  title: 'Summer Beach Party - Castle Club',
  slug: 'summer-beach-party-castle-club',
  
  // Basic Info
  description: 'Join us for the hottest beach party of the summer at Castle Club Ayia Napa! VIP access, resident DJs, and unlimited vibes.',
  longDescription: `Get ready for an unforgettable night at Cyprus's most iconic beach club! 

**What to Expect:**
- World-class DJs spinning until sunrise
- VIP beach access and exclusive areas
- Complimentary welcome drinks
- Professional photography
- Shuttle service from major universities

This is THE event of the summer - don't miss out!`,
  eventType: 'beach-party',
  category: JSON.stringify(['nightlife', 'beach', 'vip', 'summer']),
  
  // Date & Time
  eventDate: new Date('2025-07-15T22:00:00').toISOString(),
  startTime: '22:00',
  endTime: '04:00',
  duration: 6,
  
  // Location
  venue: 'Castle Club Ayia Napa',
  venueAddress: 'Nissi Avenue, Ayia Napa 5330, Cyprus',
  city: 'ayia-napa',
  location: JSON.stringify({ lat: 34.9823, lng: 33.9974 }),
  
  // Media (using placeholder - replace with actual file IDs after upload)
  featuredImage: 'placeholder-castle-club-featured',
  gallery: JSON.stringify([
    'placeholder-gallery-1',
    'placeholder-gallery-2', 
    'placeholder-gallery-3',
    'placeholder-gallery-4'
  ]),
  videoUrl: '',
  
  // Pricing
  pricing: JSON.stringify({
    general: {
      price: 45,
      currency: 'EUR',
      available: true
    },
    vip: {
      price: 75,
      currency: 'EUR',
      available: true,
      benefits: [
        'Skip the line',
        'Free welcome drink',
        'VIP area access',
        'Reserved seating',
        'Photo ops with DJs'
      ]
    },
    earlyBird: {
      price: 35,
      deadline: new Date('2025-07-01T23:59:59').toISOString(),
      available: true
    }
  }),
  
  // Capacity
  capacity: JSON.stringify({
    general: 100,
    vip: 30,
    generalTaken: 15,
    vipTaken: 5,
    generalRemaining: 85,
    vipRemaining: 25
  }),
  
  // What's Included
  includes: JSON.stringify([
    'Entry to Castle Club',
    'Welcome drink',
    'Access to beach area',
    'Professional photos',
    'Shuttle from Limassol & Larnaca'
  ]),
  
  // Requirements & Restrictions
  ageRestriction: 18,
  dresscode: 'Smart casual - No flip flops or sportswear',
  requirements: JSON.stringify([
    'Valid ID (passport or national ID)',
    'Age 18+'
  ]),
  
  // Highlights
  highlights: JSON.stringify([
    'Resident DJ lineup with international guests',
    'Beachfront venue with stunning sunset views',
    'VIP lounges and bottle service available',
    'Professional photography included',
    'Safe shuttle service from main cities'
  ]),
  lineup: JSON.stringify([
    'DJ Alex Martinez',
    'DJ Sarah Chen',
    'Special Guest TBA'
  ]),
  
  // Booking Settings
  bookingStatus: 'open',
  paymentType: 'full-upfront',
  cancellationPolicy: 'No refunds. Tickets are transferable up to 24 hours before the event.',
  
  // Admin
  published: true,
  featured: true,
  organizer: 'Memora Events Team',
  
  // Metadata
  views: 0,
  bookingCount: 20
};

async function addExampleEvent() {
  try {
    console.log('Adding example event to Appwrite...');
    
    const event = await databases.createDocument(
      DATABASE_ID,
      'events',
      ID.unique(),
      exampleEvent
    );
    
    console.log('✅ Example event created successfully!');
    console.log('Event ID:', event.$id);
    console.log('Event Title:', exampleEvent.title);
    console.log('Event Slug:', exampleEvent.slug);
    console.log('');
    console.log('Next steps:');
    console.log('1. Upload actual images to Appwrite Storage');
    console.log('2. Update the featuredImage and gallery fields with real file IDs');
    console.log('3. Test fetching the event through the API');
    console.log('4. Create more events for different types');
    
  } catch (error) {
    console.error('Error adding example event:', error);
    console.error('Full error:', error);
  }
}

addExampleEvent();

