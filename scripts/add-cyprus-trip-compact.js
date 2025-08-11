/**
 * Script to add the existing Cyprus Adventure trip to the database (compact version)
 * This preserves the current trip content while making it database-driven
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases, ID } = require('node-appwrite');

// Configuration
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

// Cyprus Adventure Trip Data (Compact Version)
const cyprusTrip = {
  title: "Cyprus Adventure 2024",
  description: "3 days of non-stop action, from sunrise boat parties to sunset beach clubs. Every moment designed for maximum memories in the Mediterranean paradise.",
  location: "Ayia Napa & Limassol, Cyprus",
  startDate: "2024-05-24",
  endDate: "2024-05-26",
  duration: 3,
  category: "mixed",
  
  // Trip highlights
  highlights: [
    "VIP treatment at every venue",
    "Private yacht party with DJ",
    "Skip-the-line club access",
    "Luxury beachfront accommodation",
    "Professional photography session",
    "Traditional Cypriot experiences",
    "Water sports and cliff jumping",
    "Exclusive beach club access"
  ],
  
  // What's included
  whatsIncluded: [
    "3 nights luxury beachfront accommodation",
    "All transportation and transfers",
    "VIP club and beach club access",
    "Private yacht charter with DJ",
    "All meals and selected drinks",
    "Professional photography session",
    "Water sports equipment and instruction",
    "24/7 support and emergency assistance",
    "Welcome gift bag and Cyprus guide",
    "Group activities and games"
  ],
  
  // What's excluded
  whatsExcluded: [
    "Flight tickets to Cyprus",
    "Travel insurance",
    "Personal expenses and souvenirs",
    "Additional drinks not specified",
    "Optional spa treatments",
    "Tips and gratuities"
  ],
  
  // Sample gallery images (using existing public images)
  gallery: [
    "/gallery/castleclub.jpg",
    "/gallery/cliffjump.jpg", 
    "/gallery/kourion.jpg",
    "/gallery/nissibeach.jpg",
    "/gallery/poolparty.jpg",
    "/gallery/yatch.avif",
    "/trip images/Kandi-Beach-Party-Ayia-Napa-Event.jpg",
    "/trip images/lluxury-club.jpeg",
    "/trip images/waterports.jpg",
    "/trip images/yatch.jpg"
  ],
  
  // Compact itinerary (optimized for size)
  itinerary: [
    {
      day: 'Day 1',
      date: 'Friday, May 24th',
      title: 'Arrival & Welcome Party',
      theme: 'Welcome to Paradise',
      items: [
        { 
          time: '12:00', 
          activity: 'Airport VIP Pickup & Transfer', 
          icon: '✈️',
          description: 'Private transport with welcome drinks',
          included: ['VIP lounge access', 'Welcome drink', 'Cyprus guide']
        },
        { 
          time: '14:00', 
          activity: 'Check-in at Beachfront Resort', 
          icon: '🏨',
          description: 'Luxury accommodation with sea views',
          included: ['Ocean view room', 'Welcome gift', 'Resort tour']
        },
        { 
          time: '16:00', 
          activity: 'Group Meet & Greet Pool Party', 
          icon: '🏊',
          description: 'Ice-breaking activities and celebrations',
          included: ['Pool games', 'Cocktails', 'Photos']
        },
        { 
          time: '18:00', 
          activity: 'Sunset Beach BBQ', 
          icon: '🌅',
          description: 'Traditional Cypriot BBQ with live music',
          included: ['BBQ feast', 'Live music', 'Beach games']
        },
        { 
          time: '22:00', 
          activity: 'VIP Club Night at Castle Club', 
          icon: '🎊',
          description: 'Skip-the-line access and VIP booth',
          included: ['VIP table', 'Bottle service', 'No queue']
        }
      ]
    },
    {
      day: 'Day 2',
      date: 'Saturday, May 25th',
      title: 'Adventure & Culture Day',
      theme: 'Explore & Discover',
      items: [
        { 
          time: '09:00', 
          activity: 'Recovery Breakfast & Spa Time', 
          icon: '☕',
          description: 'Breakfast and optional spa treatments',
          included: ['Full breakfast', 'Spa access', 'Pool time']
        },
        { 
          time: '11:00', 
          activity: 'Water Sports Adventure', 
          icon: '🏄',
          description: 'Jet skiing, parasailing, cliff jumping',
          included: ['Equipment', 'Instruction', 'Safety gear']
        },
        { 
          time: '15:00', 
          activity: 'Ancient Kourion & Wine Tasting', 
          icon: '🏛️',
          description: 'Historical tour and wine experience',
          included: ['Guided tour', 'Wine tasting', 'History']
        },
        { 
          time: '19:00', 
          activity: 'Traditional Village Dinner', 
          icon: '🍽️',
          description: 'Authentic Cypriot cuisine experience',
          included: ['Multi-course dinner', 'Cultural show', 'Music']
        },
        { 
          time: '23:00', 
          activity: 'Ayia Napa Bar Crawl', 
          icon: '🍻',
          description: 'VIP access to best bars and clubs',
          included: ['5 venues', 'VIP entry', 'Welcome drinks']
        }
      ]
    },
    {
      day: 'Day 3',
      date: 'Sunday, May 26th',
      title: 'Yacht Party & Farewell',
      theme: 'Grand Finale',
      items: [
        { 
          time: '10:00', 
          activity: 'Luxury Yacht Charter', 
          icon: '🚤',
          description: 'Private yacht with DJ and drinks',
          included: ['Luxury yacht', 'DJ & sound', 'Open bar']
        },
        { 
          time: '14:00', 
          activity: 'Beach Club Hopping', 
          icon: '🏖️',
          description: 'VIP access to exclusive beach clubs',
          included: ['3 beach clubs', 'Pool access', 'VIP loungers']
        },
        { 
          time: '17:00', 
          activity: 'Golden Hour Photography', 
          icon: '📸',
          description: 'Professional photo session',
          included: ['Pro photographer', 'Multiple locations', 'Gallery']
        },
        { 
          time: '20:00', 
          activity: 'Farewell Gala Dinner', 
          icon: '🏆',
          description: 'Elegant dinner with awards ceremony',
          included: ['Gala dinner', 'Awards', 'Memory book']
        },
        { 
          time: '23:00', 
          activity: 'Final Party at Rooftop Club', 
          icon: '🌃',
          description: 'Last night celebration with city views',
          included: ['Rooftop access', 'Premium drinks', 'Photos']
        }
      ]
    }
  ],
  
  // Pricing structure
  pricing: {
    standard: 599,
    premium: 799,
    vip: 999,
    currency: 'EUR',
    earlyBird: {
      price: 499,
      deadline: '2024-04-15'
    }
  },
  
  // Availability management
  availability: {
    totalSpots: 50,
    spotsTaken: 38,
    spotsRemaining: 12,
    apartmentsAvailable: 8,
    apartmentCapacity: 6,
    waitingListCount: 5,
    bookingStatus: 'limited'
  },
  
  // Make it published and featured so it shows on homepage
  published: true,
  featured: true
};

async function addCyprusTrip() {
  try {
    console.log('🇨🇾 Adding Cyprus Adventure 2024 trip to database...');
    console.log('');

    // Check sizes before creating
    const itinerarySize = JSON.stringify(cyprusTrip.itinerary).length;
    const gallerySize = JSON.stringify(cyprusTrip.gallery).length;
    const highlightsSize = JSON.stringify(cyprusTrip.highlights).length;
    
    console.log('📏 Data sizes:');
    console.log(`   Itinerary: ${itinerarySize} chars (limit: 3000)`);
    console.log(`   Gallery: ${gallerySize} chars (limit: 1000)`);
    console.log(`   Highlights: ${highlightsSize} chars (limit: 1000)`);
    console.log('');

    if (itinerarySize > 3000 || gallerySize > 1000 || highlightsSize > 1000) {
      console.log('❌ Data too large for database limits. Please optimize further.');
      return;
    }

    // Create the trip document
    const document = await databases.createDocument(
      DATABASE_ID,
      'trips',
      ID.unique(),
      {
        title: cyprusTrip.title,
        description: cyprusTrip.description,
        location: cyprusTrip.location,
        startDate: cyprusTrip.startDate,
        endDate: cyprusTrip.endDate,
        duration: cyprusTrip.duration,
        category: cyprusTrip.category,
        itinerary: JSON.stringify(cyprusTrip.itinerary),
        gallery: JSON.stringify(cyprusTrip.gallery),
        pricing: JSON.stringify(cyprusTrip.pricing),
        highlights: JSON.stringify(cyprusTrip.highlights),
        whatsIncluded: JSON.stringify(cyprusTrip.whatsIncluded),
        whatsExcluded: JSON.stringify(cyprusTrip.whatsExcluded),
        availability: JSON.stringify(cyprusTrip.availability),
        published: cyprusTrip.published,
        featured: cyprusTrip.featured
      }
    );

    console.log('✅ Cyprus Adventure trip created successfully!');
    console.log('');
    console.log('📊 Trip Details:');
    console.log(`   ID: ${document.$id}`);
    console.log(`   Title: ${cyprusTrip.title}`);
    console.log(`   Location: ${cyprusTrip.location}`);
    console.log(`   Duration: ${cyprusTrip.duration} days`);
    console.log(`   Category: ${cyprusTrip.category}`);
    console.log(`   Published: ${cyprusTrip.published ? '✅ Yes' : '❌ No'}`);
    console.log(`   Featured: ${cyprusTrip.featured ? '⭐ Yes' : '❌ No'}`);
    console.log('');
    console.log('🎯 Availability:');
    console.log(`   Total spots: ${cyprusTrip.availability.totalSpots}`);
    console.log(`   Spots taken: ${cyprusTrip.availability.spotsTaken}`);
    console.log(`   Spots remaining: ${cyprusTrip.availability.spotsRemaining}`);
    console.log(`   Status: ${cyprusTrip.availability.bookingStatus}`);
    console.log('');
    console.log('💰 Pricing:');
    console.log(`   Standard: €${cyprusTrip.pricing.standard}`);
    console.log(`   Premium: €${cyprusTrip.pricing.premium}`);
    console.log(`   VIP: €${cyprusTrip.pricing.vip}`);
    console.log(`   Early Bird: €${cyprusTrip.pricing.earlyBird.price} (until ${cyprusTrip.pricing.earlyBird.deadline})`);
    console.log('');
    console.log('🏆 Features:');
    console.log(`   Highlights: ${cyprusTrip.highlights.length} items`);
    console.log(`   Included: ${cyprusTrip.whatsIncluded.length} items`);
    console.log(`   Gallery: ${cyprusTrip.gallery.length} images`);
    console.log(`   Itinerary: ${cyprusTrip.itinerary.length} days with detailed schedule`);
    console.log('');
    console.log('🌟 Your homepage Next Trip section will now display this data!');
    console.log('🎊 Visit http://localhost:3001 to see it in action!');

  } catch (error) {
    console.error('❌ Error adding Cyprus trip:', error);
    
    if (error.code === 409) {
      console.log('');
      console.log('ℹ️  It looks like a trip might already exist. You can:');
      console.log('   1. Delete existing trips from the admin panel');
      console.log('   2. Or modify this script to update instead of create');
    }
  }
}

// Run the script
addCyprusTrip();

