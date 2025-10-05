/**
 * Script to add 5 sample events with real images
 * 2 past events and 3 upcoming events (3 featured)
 * 
 * Usage: node scripts/add-sample-events.js
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

const sampleEvents = [
  // PAST EVENT 1
  {
    title: 'Summer Sunset Beach Party - Nissi Beach',
    slug: 'summer-sunset-beach-party-nissi-beach',
    description: 'Epic beach party with international DJs, beachfront dancing, and unforgettable sunset vibes at Nissi Beach.',
    eventType: 'beach-party',
    eventDate: new Date('2025-08-15T19:00:00').toISOString(),
    city: 'ayia-napa',
    bookingStatus: 'sold-out',
    published: true,
    featured: false,
    eventDetails: JSON.stringify({
      startTime: '19:00',
      endTime: '02:00',
      duration: 7,
      ageRestriction: 18,
      dresscode: 'Beach casual - swimwear welcome',
      paymentType: 'full-upfront',
      cancellationPolicy: 'No refunds. Tickets are transferable.',
      organizer: 'Memora Events Team',
    }),
    venueInfo: JSON.stringify({
      venue: 'Nissi Beach',
      venueAddress: 'Nissi Avenue, Ayia Napa 5330, Cyprus',
    }),
    pricing: JSON.stringify({
      general: { price: 35, currency: 'EUR', available: true },
      vip: { price: 60, currency: 'EUR', available: true, benefits: ['VIP beach lounger', 'Free cocktail', 'Priority entry', 'Reserved seating'] },
    }),
    capacity: JSON.stringify({
      general: 150,
      vip: 40,
      generalTaken: 150,
      vipTaken: 40,
      generalRemaining: 0,
      vipRemaining: 0,
    }),
    eventContent: JSON.stringify({
      includes: ['Beach access', 'Welcome drink', 'Professional DJ set', 'Sunset views', 'Security'],
      highlights: ['World-renowned DJs', 'Beachfront dancefloor', 'Spectacular sunset timing', 'Beach bar with cocktails', 'Fire show at midnight'],
      lineup: ['DJ Sunset Mike', 'DJ Beach Beats', 'Local talent showcase'],
      category: ['beach', 'nightlife', 'summer'],
      featuredImage: '/gallery/nissibeach.jpg',
      gallery: ['/gallery/nissibeach.jpg', '/blogs/beach-bars.jpg', '/blogs/ayianapa-gem.jpeg'],
    }),
  },

  // PAST EVENT 2
  {
    title: 'Castle Club VIP Night - August Edition',
    slug: 'castle-club-vip-night-august',
    description: 'The ultimate club night at Cyprus\'s most iconic venue. VIP access, top DJs, and unlimited energy until sunrise.',
    eventType: 'club-night',
    eventDate: new Date('2025-08-20T23:00:00').toISOString(),
    city: 'ayia-napa',
    bookingStatus: 'sold-out',
    published: true,
    featured: false,
    eventDetails: JSON.stringify({
      startTime: '23:00',
      endTime: '06:00',
      duration: 7,
      ageRestriction: 18,
      dresscode: 'Smart casual - No flip flops or sportswear',
      paymentType: 'full-upfront',
      cancellationPolicy: 'No refunds. Tickets transferable up to 24 hours before event.',
      organizer: 'Memora Events Team',
    }),
    venueInfo: JSON.stringify({
      venue: 'Castle Club Ayia Napa',
      venueAddress: 'Nissi Avenue, Ayia Napa 5330, Cyprus',
    }),
    pricing: JSON.stringify({
      general: { price: 45, currency: 'EUR', available: true },
      vip: { price: 75, currency: 'EUR', available: true, benefits: ['Skip the line', 'VIP lounge access', '2 free drinks', 'Reserved table', 'Bottle service available'] },
    }),
    capacity: JSON.stringify({
      general: 200,
      vip: 50,
      generalTaken: 200,
      vipTaken: 50,
      generalRemaining: 0,
      vipRemaining: 0,
    }),
    eventContent: JSON.stringify({
      includes: ['Club entry', 'Welcome shot', 'Access to all areas', 'Professional photography', 'Coat check'],
      highlights: ['International DJ lineup', 'State-of-the-art sound system', 'LED visual show', 'Multiple bars and lounges', 'Rooftop terrace access'],
      lineup: ['DJ Alex Martinez', 'DJ Sarah Chen', 'Special Guest: MC Hype'],
      category: ['nightlife', 'club', 'party'],
      featuredImage: '/gallery/castleclub.jpg',
      gallery: ['/gallery/castleclub.jpg', '/gallery/poolparty.jpg', '/blogs/limasol-dark.jpg'],
    }),
  },

  // UPCOMING FEATURED EVENT 1
  {
    title: 'Pool Party Extravaganza - October Special',
    slug: 'pool-party-extravaganza-october',
    description: 'Dive into the ultimate pool party experience! Day-to-night celebration with top DJs, poolside fun, and VIP cabanas.',
    eventType: 'beach-party',
    eventDate: new Date('2025-10-20T14:00:00').toISOString(),
    city: 'limassol',
    bookingStatus: 'open',
    published: true,
    featured: true,
    eventDetails: JSON.stringify({
      startTime: '14:00',
      endTime: '22:00',
      duration: 8,
      ageRestriction: 18,
      dresscode: 'Swimwear + cover-up for inside areas',
      paymentType: 'full-upfront',
      cancellationPolicy: 'No refunds. Tickets transferable up to 48 hours before event.',
      organizer: 'Memora Events Team',
    }),
    venueInfo: JSON.stringify({
      venue: 'Luxury Beach Resort Pool',
      venueAddress: 'Amathus Avenue, Limassol 4532, Cyprus',
    }),
    pricing: JSON.stringify({
      general: { price: 50, currency: 'EUR', available: true },
      vip: { price: 95, currency: 'EUR', available: true, benefits: ['Private cabana', 'Bottle service', 'Pool floats', 'Dedicated server', 'Premium lounge access'] },
      earlyBird: { price: 40, deadline: new Date('2025-10-10T23:59:59').toISOString(), available: true },
    }),
    capacity: JSON.stringify({
      general: 120,
      vip: 25,
      generalTaken: 35,
      vipTaken: 8,
      generalRemaining: 85,
      vipRemaining: 17,
    }),
    eventContent: JSON.stringify({
      includes: ['Pool access', 'Welcome cocktail', 'DJ entertainment', 'Pool inflatables', 'Towel service', 'Changing facilities'],
      highlights: ['All-day pool party atmosphere', 'Sunset DJ set', 'VIP cabanas with bottle service', 'Poolside bar & grill', 'Professional party photographer'],
      lineup: ['DJ Poolside', 'DJ Summer Vibes', 'Live saxophone performance'],
      category: ['pool', 'party', 'daytime'],
      featuredImage: '/gallery/poolparty.jpg',
      gallery: ['/gallery/poolparty.jpg', '/gallery/yatch.avif', '/blogs/student-adventure.jpg'],
    }),
  },

  // UPCOMING FEATURED EVENT 2
  {
    title: 'Yacht Party - Sunset Cruise & DJ Set',
    slug: 'yacht-party-sunset-cruise',
    description: 'Sail into the sunset on a luxury yacht with champagne, DJ beats, and breathtaking Mediterranean views.',
    eventType: 'boat-party',
    eventDate: new Date('2025-11-05T17:00:00').toISOString(),
    city: 'limassol',
    bookingStatus: 'limited',
    published: true,
    featured: true,
    eventDetails: JSON.stringify({
      startTime: '17:00',
      endTime: '21:00',
      duration: 4,
      ageRestriction: 21,
      dresscode: 'Smart casual / Yacht chic',
      paymentType: 'deposit-30-70',
      cancellationPolicy: 'Cancellations 7+ days before: 50% refund. Less than 7 days: no refund.',
      organizer: 'Memora Events Team',
    }),
    venueInfo: JSON.stringify({
      venue: 'Limassol Marina - Luxury Yacht',
      venueAddress: 'Limassol Marina, Limassol 3601, Cyprus',
    }),
    pricing: JSON.stringify({
      general: { price: 85, currency: 'EUR', available: true },
      vip: { price: 150, currency: 'EUR', available: true, benefits: ['Upper deck access', 'Premium champagne', 'Gourmet canapés', 'Private photo session', 'Gift bag'] },
    }),
    capacity: JSON.stringify({
      general: 40,
      vip: 15,
      generalTaken: 32,
      vipTaken: 12,
      generalRemaining: 8,
      vipRemaining: 3,
    }),
    eventContent: JSON.stringify({
      includes: ['4-hour yacht cruise', 'Welcome champagne', 'DJ entertainment', 'Canapés & snacks', 'Swimming stops', 'Professional photos'],
      highlights: ['Luxury yacht with multiple decks', 'Sunset timing for perfect views', 'Swimming in crystal clear waters', 'Open bar with premium drinks', 'Intimate exclusive atmosphere'],
      lineup: ['DJ Yacht Beats', 'Saxophonist live performance'],
      category: ['yacht', 'luxury', 'sunset'],
      featuredImage: '/gallery/yatch.avif',
      gallery: ['/gallery/yatch.avif', '/gallery/nissibeach.jpg', '/trip images/yatch.jpg'],
    }),
  },

  // UPCOMING FEATURED EVENT 3
  {
    title: 'Cliff Jump Adventure & Beach BBQ',
    slug: 'cliff-jump-adventure-beach-bbq',
    description: 'Adrenaline-pumping cliff jumping session followed by a relaxed beach BBQ party with drinks and live music.',
    eventType: 'beach-party',
    eventDate: new Date('2025-11-15T11:00:00').toISOString(),
    city: 'protaras',
    bookingStatus: 'open',
    published: true,
    featured: true,
    eventDetails: JSON.stringify({
      startTime: '11:00',
      endTime: '18:00',
      duration: 7,
      ageRestriction: 18,
      dresscode: 'Swimwear + casual clothes',
      paymentType: 'full-upfront',
      cancellationPolicy: 'Cancellations 3+ days before: full refund. Less than 3 days: no refund.',
      organizer: 'Memora Events Team',
    }),
    venueInfo: JSON.stringify({
      venue: 'Cape Greco Cliffs & Private Beach',
      venueAddress: 'Cape Greco, Protaras, Cyprus',
    }),
    pricing: JSON.stringify({
      general: { price: 40, currency: 'EUR', available: true },
      earlyBird: { price: 32, deadline: new Date('2025-11-01T23:59:59').toISOString(), available: true },
    }),
    capacity: JSON.stringify({
      general: 60,
      vip: 0,
      generalTaken: 18,
      vipTaken: 0,
      generalRemaining: 42,
      vipRemaining: 0,
    }),
    eventContent: JSON.stringify({
      includes: ['Transport to cliff site', 'Safety equipment & instruction', 'Beach BBQ lunch', 'Drinks (beer, wine, soft drinks)', 'Professional photos', 'Return transport'],
      highlights: ['Safe cliff jumping with instructors', 'Stunning Cape Greco location', 'Delicious BBQ feast', 'Chill beach vibes', 'Perfect for adventure lovers'],
      category: ['adventure', 'beach', 'daytime'],
      featuredImage: '/gallery/cliffjump.jpg',
      gallery: ['/gallery/cliffjump.jpg', '/gallery/nissibeach.jpg', '/blogs/student-adventure.jpg'],
    }),
  },

  // UPCOMING EVENT 4
  {
    title: 'Limassol Bar Crawl - Friday Night Edition',
    slug: 'limassol-bar-crawl-friday',
    description: 'Hit the best bars in Limassol with free shots, drink deals, and VIP entry to the hottest clubs. Meet new friends!',
    eventType: 'bar-crawl',
    eventDate: new Date('2025-11-22T21:00:00').toISOString(),
    city: 'limassol',
    bookingStatus: 'open',
    published: true,
    featured: false,
    eventDetails: JSON.stringify({
      startTime: '21:00',
      endTime: '03:00',
      duration: 6,
      ageRestriction: 18,
      dresscode: 'Smart casual',
      paymentType: 'full-upfront',
      cancellationPolicy: 'No refunds. Tickets transferable.',
      organizer: 'Memora Events Team',
    }),
    venueInfo: JSON.stringify({
      venue: '5 Top Bars in Limassol + Club Entry',
      venueAddress: 'Starts at Saripolou Square, Limassol',
    }),
    pricing: JSON.stringify({
      general: { price: 30, currency: 'EUR', available: true },
    }),
    capacity: JSON.stringify({
      general: 80,
      vip: 0,
      generalTaken: 22,
      vipTaken: 0,
      generalRemaining: 58,
      vipRemaining: 0,
    }),
    eventContent: JSON.stringify({
      includes: ['Tour guide', '5 bar stops', 'Free shot at each bar', 'Drink discounts', 'Club entry (skip line)', 'Photographer'],
      highlights: ['Visit 5 best bars in Limassol', 'Free shot at every stop', 'VIP club entry at the end', 'Make friends from around the world', 'Expert local guides'],
      category: ['nightlife', 'bars', 'social'],
      featuredImage: '/blogs/limasol-dark.jpg',
      gallery: ['/blogs/limasol-dark.jpg', '/gallery/castleclub.jpg', '/blogs/beach-bars.jpg'],
    }),
  },

  // UPCOMING EVENT 5
  {
    title: 'Ancient Kourion Festival Night',
    slug: 'ancient-kourion-festival-night',
    description: 'Unique cultural experience combining ancient history with modern beats at the stunning Kourion amphitheater.',
    eventType: 'festival',
    eventDate: new Date('2025-12-01T19:30:00').toISOString(),
    city: 'limassol',
    bookingStatus: 'open',
    published: true,
    featured: false,
    eventDetails: JSON.stringify({
      startTime: '19:30',
      endTime: '23:30',
      duration: 4,
      ageRestriction: 16,
      dresscode: 'Comfortable casual',
      paymentType: 'split-50-50',
      cancellationPolicy: 'Cancellations 7+ days before: full refund. Less than 7 days: 50% refund.',
      organizer: 'Memora Events Team',
    }),
    venueInfo: JSON.stringify({
      venue: 'Kourion Ancient Amphitheater',
      venueAddress: 'Kourion Archaeological Site, Episkopi, Cyprus',
    }),
    pricing: JSON.stringify({
      general: { price: 35, currency: 'EUR', available: true },
      vip: { price: 55, currency: 'EUR', available: true, benefits: ['Front row seating', 'Welcome wine', 'Guided tour before event', 'Event program booklet'] },
    }),
    capacity: JSON.stringify({
      general: 90,
      vip: 30,
      generalTaken: 12,
      vipTaken: 5,
      generalRemaining: 78,
      vipRemaining: 25,
    }),
    eventContent: JSON.stringify({
      includes: ['Amphitheater entry', 'Live performance', 'Cultural presentation', 'Light refreshments', 'Guided tour option'],
      highlights: ['Historic amphitheater venue', 'Fusion of ancient and modern', 'Stunning Mediterranean views', 'Cultural performances', 'Unique Instagram-worthy location'],
      lineup: ['Traditional Cypriot musicians', 'Modern electronic fusion', 'Cultural dance performance'],
      category: ['culture', 'festival', 'history'],
      featuredImage: '/gallery/kourion.jpg',
      gallery: ['/gallery/kourion.jpg', '/blogs/student-adventure.jpg'],
    }),
  },
];

async function addSampleEvents() {
  try {
    console.log('Adding 5 sample events to Appwrite...\n');
    
    for (let i = 0; i < sampleEvents.length; i++) {
      const eventData = sampleEvents[i];
      
      try {
        const event = await databases.createDocument(
          DATABASE_ID,
          'events',
          ID.unique(),
          eventData
        );
        
        const isPast = new Date(eventData.eventDate) < new Date();
        const status = isPast ? '❌ PAST' : eventData.featured ? '⭐ FEATURED' : '✅ UPCOMING';
        
        console.log(`${i + 1}. ${status} - ${eventData.title}`);
        console.log(`   Event ID: ${event.$id}`);
        console.log(`   Date: ${new Date(eventData.eventDate).toLocaleDateString()}`);
        console.log(`   City: ${eventData.city}`);
        console.log(`   Type: ${eventData.eventType}`);
        console.log(`   Status: ${eventData.bookingStatus}`);
        console.log('');
      } catch (error) {
        console.error(`Error creating event "${eventData.title}":`, error.message);
      }
    }
    
    console.log('✅ Sample events added successfully!');
    console.log('');
    console.log('Summary:');
    console.log('- 2 past events (sold out)');
    console.log('- 3 upcoming events (3 featured)');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit /events to see all events');
    console.log('2. Visit homepage to see featured events');
    console.log('3. Go to /admin/events to manage them');
    
  } catch (error) {
    console.error('Error adding sample events:', error);
  }
}

addSampleEvents();

