/**
 * Script to add multiple example trips with different dates for testing
 * This will create upcoming and previous trips to showcase the date-based functionality
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

// Helper function to get dates
const getDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// Upcoming Trip 1 - Next month
const barcelonaTrip = {
  title: "Barcelona Beach Festival",
  description: "4 days of music, beaches, and unforgettable parties in the vibrant city of Barcelona. Experience the best of Spanish culture and nightlife.",
  location: "Barcelona, Spain",
  startDate: getDate(30), // 30 days from now
  endDate: getDate(33),   // 33 days from now
  duration: 4,
  category: "beach-party",
  
  highlights: [
    "Access to private beach festival",
    "VIP nightclub tours in Gothic Quarter", 
    "Professional beach volleyball tournament",
    "Exclusive tapas and sangria experiences",
    "Rooftop parties with city views",
    "Barcelona FC stadium tour"
  ],
  
  whatsIncluded: [
    "4 nights accommodation near beach",
    "All festival and club entries",
    "Daily breakfast and one dinner",
    "Metro transport pass",
    "Professional photography session",
    "Welcome party with local DJs",
    "Beach volleyball equipment",
    "24/7 local support team"
  ],
  
  whatsExcluded: [
    "Flight tickets to Barcelona",
    "Travel insurance coverage",
    "Personal shopping expenses",
    "Additional meals not specified",
    "Optional spa treatments",
    "Tips for service staff"
  ],
  
  gallery: [
    "/gallery/castleclub.jpg",
    "/gallery/poolparty.jpg",
    "/trip images/waterports.jpg",
    "/gallery/nissibeach.jpg"
  ],
  
  itinerary: [
    {
      day: 'Day 1',
      date: 'Arrival Day',
      title: 'Welcome to Barcelona',
      theme: 'City Discovery',
      items: [
        { 
          time: '14:00', 
          activity: 'Airport Pickup & Check-in', 
          icon: '✈️',
          description: 'Smooth transfer to beachfront accommodation',
          included: ['Transfer', 'Welcome drink', 'City map']
        },
        { 
          time: '18:00', 
          activity: 'Gothic Quarter Walking Tour', 
          icon: '🏛️',
          description: 'Explore the historic heart of Barcelona',
          included: ['Guided tour', 'Tapas tasting', 'Photos']
        },
        { 
          time: '22:00', 
          activity: 'Welcome Beach Party', 
          icon: '🏖️',
          description: 'Start with beach bonfire and music',
          included: ['Beach setup', 'DJ music', 'Drinks']
        }
      ]
    },
    {
      day: 'Day 2',
      date: 'Festival Day',
      title: 'Beach Festival Experience',
      theme: 'Music & Sun',
      items: [
        { 
          time: '10:00', 
          activity: 'Beach Festival Access', 
          icon: '🎵',
          description: 'VIP entry to exclusive beach festival',
          included: ['VIP wristband', 'Stage access', 'Food vouchers']
        },
        { 
          time: '16:00', 
          activity: 'Beach Volleyball Tournament', 
          icon: '🏐',
          description: 'Competitive fun in the sun',
          included: ['Equipment', 'Prizes', 'Photos']
        },
        { 
          time: '23:00', 
          activity: 'Club Crawl in El Born', 
          icon: '🍻',
          description: 'Experience Barcelona nightlife',
          included: ['3 venues', 'VIP entry', 'Welcome shots']
        }
      ]
    }
  ],
  
  pricing: {
    standard: 450,
    premium: 650,
    vip: 850,
    currency: 'EUR',
    earlyBird: {
      price: 380,
      deadline: getDate(15)
    }
  },
  
  availability: {
    totalSpots: 40,
    spotsTaken: 12,
    spotsRemaining: 28,
    apartmentsAvailable: 12,
    apartmentCapacity: 4,
    waitingListCount: 2,
    bookingStatus: 'open'
  },
  
  published: true,
  featured: false
};

// Upcoming Trip 2 - In 2 months
const mykonosTrip = {
  title: "Mykonos VIP Experience",
  description: "5 days of luxury in Greece's most glamorous island. Private yacht parties, exclusive beach clubs, and authentic Greek experiences.",
  location: "Mykonos, Greece",
  startDate: getDate(60), // 60 days from now
  endDate: getDate(64),   // 64 days from now
  duration: 5,
  category: "luxury",
  
  highlights: [
    "Private yacht charter with crew",
    "VIP access to Paradise Beach Club",
    "Sunset dinner at iconic windmills",
    "Exclusive shopping in Mykonos Town",
    "Private villa with infinity pool",
    "Greek cooking class with chef"
  ],
  
  whatsIncluded: [
    "5 nights luxury villa accommodation",
    "Private yacht for 2 full days",
    "All VIP club and beach access",
    "Daily Greek breakfast",
    "Professional photographer for 1 day",
    "Airport transfers in luxury vehicles",
    "Cooking class with local chef",
    "Concierge service throughout stay"
  ],
  
  whatsExcluded: [
    "International flight tickets",
    "Comprehensive travel insurance",
    "Personal shopping and souvenirs",
    "Spa treatments and massages",
    "Additional alcoholic beverages",
    "Tips and gratuities for staff"
  ],
  
  gallery: [
    "/gallery/yatch.avif",
    "/trip images/lluxury-club.jpeg",
    "/gallery/poolparty.jpg",
    "/trip images/yatch.jpg"
  ],
  
  itinerary: [
    {
      day: 'Day 1',
      date: 'Arrival',
      title: 'Welcome to Paradise',
      theme: 'Luxury Arrival',
      items: [
        { 
          time: '15:00', 
          activity: 'VIP Airport Transfer', 
          icon: '🚗',
          description: 'Luxury vehicle pickup and villa tour',
          included: ['Luxury transfer', 'Villa tour', 'Welcome champagne']
        },
        { 
          time: '20:00', 
          activity: 'Sunset Dinner at Windmills', 
          icon: '🌅',
          description: 'Iconic Mykonos experience with views',
          included: ['Multi-course dinner', 'Wine pairing', 'Photos']
        }
      ]
    }
  ],
  
  pricing: {
    standard: 1200,
    premium: 1500,
    vip: 1800,
    currency: 'EUR',
    earlyBird: {
      price: 1000,
      deadline: getDate(45)
    }
  },
  
  availability: {
    totalSpots: 20,
    spotsTaken: 5,
    spotsRemaining: 15,
    apartmentsAvailable: 8,
    apartmentCapacity: 3,
    waitingListCount: 0,
    bookingStatus: 'open'
  },
  
  published: true,
  featured: false
};

// Previous Trip 1 - Last month
const ibizaPreviousTrip = {
  title: "Ibiza Summer Madness 2024",
  description: "3 days that redefined the party scene. Epic sunsets, world-class DJs, and memories that will last forever.",
  location: "Ibiza, Spain",
  startDate: getDate(-30), // 30 days ago
  endDate: getDate(-28),   // 28 days ago
  duration: 3,
  category: "beach-party",
  
  highlights: [
    "VIP access to Ushuaïa and Pacha",
    "Private sunset boat party",
    "Beach club hopping experience",
    "World-renowned DJ performances",
    "Exclusive after-party invitations",
    "Professional party photography"
  ],
  
  whatsIncluded: [
    "3 nights beachfront accommodation",
    "VIP club entries and table service",
    "Private boat charter with DJ",
    "Daily breakfast and club dinners",
    "Professional photography package",
    "VIP transport between venues",
    "Welcome party gift bag",
    "24/7 party guide assistance"
  ],
  
  whatsExcluded: [
    "Flights to Ibiza airport",
    "Travel insurance policy",
    "Personal expenses and shopping",
    "Additional drinks beyond package",
    "Optional wellness treatments",
    "Gratuities for service staff"
  ],
  
  gallery: [
    "/gallery/castleclub.jpg",
    "/gallery/poolparty.jpg",
    "/trip images/Kandi-Beach-Party-Ayia-Napa-Event.jpg",
    "/trip images/lluxury-club.jpeg"
  ],
  
  itinerary: [
    {
      day: 'Day 1',
      date: 'Party Begins',
      title: 'Welcome to Ibiza',
      theme: 'Sunset Sessions',
      items: [
        { 
          time: '16:00', 
          activity: 'Arrival & Beach Club Welcome', 
          icon: '🏖️',
          description: 'Check-in and immediate pool party',
          included: ['Beach club access', 'Welcome drinks', 'Pool games']
        },
        { 
          time: '20:00', 
          activity: 'Sunset Strip Experience', 
          icon: '🌅',
          description: 'Famous Ibiza sunset with cocktails',
          included: ['Premium location', 'Sunset cocktails', 'Photos']
        },
        { 
          time: '23:00', 
          activity: 'Ushuaïa VIP Night', 
          icon: '🎊',
          description: 'World-class DJ and production',
          included: ['VIP table', 'Bottle service', 'Fast track entry']
        }
      ]
    }
  ],
  
  pricing: {
    standard: 550,
    premium: 750,
    vip: 950,
    currency: 'EUR'
  },
  
  availability: {
    totalSpots: 45,
    spotsTaken: 45,
    spotsRemaining: 0,
    apartmentsAvailable: 0,
    apartmentCapacity: 5,
    waitingListCount: 0,
    bookingStatus: 'sold-out'
  },
  
  published: true,
  featured: false
};

// Previous Trip 2 - 3 months ago
const croatiaTrip = {
  title: "Croatia Island Hopping",
  description: "7 days exploring the stunning Dalmatian coast. Crystal clear waters, ancient cities, and Mediterranean bliss.",
  location: "Split & Islands, Croatia",
  startDate: getDate(-90), // 90 days ago
  endDate: getDate(-84),   // 84 days ago
  duration: 7,
  category: "adventure",
  
  highlights: [
    "Private yacht island hopping",
    "Diocletian's Palace exploration",
    "Blue Cave swimming experience",
    "Traditional Dalmatian cuisine",
    "Ancient city walking tours",
    "Adriatic Sea adventures"
  ],
  
  whatsIncluded: [
    "7 nights mixed accommodation",
    "Private yacht for island hopping",
    "All transportation between islands",
    "Daily breakfast and 4 dinners",
    "Guided tours of historical sites",
    "Snorkeling equipment and instruction",
    "Traditional cooking workshop",
    "Professional group photography"
  ],
  
  whatsExcluded: [
    "International flights to Split",
    "Travel insurance coverage",
    "Personal expenses and souvenirs",
    "Additional meals not included",
    "Optional adventure activities",
    "Tips for local guides"
  ],
  
  gallery: [
    "/gallery/kourion.jpg",
    "/gallery/cliffjump.jpg",
    "/trip images/waterports.jpg",
    "/gallery/nissibeach.jpg"
  ],
  
  itinerary: [
    {
      day: 'Day 1',
      date: 'Arrival in Split',
      title: 'Ancient Meets Modern',
      theme: 'Historical Discovery',
      items: [
        { 
          time: '14:00', 
          activity: 'Diocletian Palace Tour', 
          icon: '🏛️',
          description: 'Explore 1700-year-old Roman palace',
          included: ['Expert guide', 'Historical insights', 'Photo stops']
        },
        { 
          time: '19:00', 
          activity: 'Traditional Croatian Dinner', 
          icon: '🍽️',
          description: 'Authentic Dalmatian cuisine experience',
          included: ['Multi-course meal', 'Local wine', 'Cultural show']
        }
      ]
    }
  ],
  
  pricing: {
    standard: 890,
    premium: 1190,
    vip: 1490,
    currency: 'EUR'
  },
  
  availability: {
    totalSpots: 30,
    spotsTaken: 30,
    spotsRemaining: 0,
    apartmentsAvailable: 0,
    apartmentCapacity: 4,
    waitingListCount: 0,
    bookingStatus: 'sold-out'
  },
  
  published: true,
  featured: false
};

// Current/Next Trip - Cyprus (modify existing to be upcoming)
const cyprusNextTrip = {
  title: "Cyprus Adventure 2025",
  description: "3 days of non-stop action, from sunrise boat parties to sunset beach clubs. Every moment designed for maximum memories in the Mediterranean paradise.",
  location: "Ayia Napa & Limassol, Cyprus",
  startDate: getDate(15), // 15 days from now - this will be the "next" trip
  endDate: getDate(17),   // 17 days from now
  duration: 3,
  category: "mixed",
  
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
  
  whatsExcluded: [
    "Flight tickets to Cyprus",
    "Travel insurance",
    "Personal expenses and souvenirs",
    "Additional drinks not specified",
    "Optional spa treatments",
    "Tips and gratuities"
  ],
  
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
  
  itinerary: [
    {
      day: 'Day 1',
      date: 'Arrival Day',
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
      date: 'Adventure Day',
      title: 'Adventure & Culture Day',
      theme: 'Explore & Discover',
      items: [
        { 
          time: '11:00', 
          activity: 'Water Sports Adventure', 
          icon: '🏄',
          description: 'Jet skiing, parasailing, cliff jumping',
          included: ['Equipment', 'Instruction', 'Safety gear']
        },
        { 
          time: '23:00', 
          activity: 'Ayia Napa Bar Crawl', 
          icon: '🍻',
          description: 'VIP access to best bars and clubs',
          included: ['5 venues', 'VIP entry', 'Welcome drinks']
        }
      ]
    }
  ],
  
  pricing: {
    standard: 599,
    premium: 799,
    vip: 999,
    currency: 'EUR',
    earlyBird: {
      price: 499,
      deadline: getDate(7)
    }
  },
  
  availability: {
    totalSpots: 50,
    spotsTaken: 18,
    spotsRemaining: 32,
    apartmentsAvailable: 15,
    apartmentCapacity: 6,
    waitingListCount: 3,
    bookingStatus: 'open'
  },
  
  published: true
};

const trips = [
  { name: 'Cyprus Adventure 2025 (Next Trip)', data: cyprusNextTrip },
  { name: 'Barcelona Beach Festival (Upcoming)', data: barcelonaTrip },
  { name: 'Mykonos VIP Experience (Upcoming)', data: mykonosTrip },
  { name: 'Ibiza Summer Madness (Previous)', data: ibizaPreviousTrip },
  { name: 'Croatia Island Hopping (Previous)', data: croatiaTrip }
];

async function addExampleTrips() {
  try {
    console.log('🌍 Adding example trips with different dates...');
    console.log('');

    for (const trip of trips) {
      try {
        console.log(`📍 Adding: ${trip.name}`);
        console.log(`   📅 Dates: ${trip.data.startDate} to ${trip.data.endDate}`);
        console.log(`   📍 Location: ${trip.data.location}`);
        
        const document = await databases.createDocument(
          DATABASE_ID,
          'trips',
          ID.unique(),
          {
            title: trip.data.title,
            description: trip.data.description,
            location: trip.data.location,
            startDate: trip.data.startDate,
            endDate: trip.data.endDate,
            duration: trip.data.duration,
            category: trip.data.category,
            itinerary: JSON.stringify(trip.data.itinerary),
            gallery: JSON.stringify(trip.data.gallery),
            pricing: JSON.stringify(trip.data.pricing),
            highlights: JSON.stringify(trip.data.highlights),
            whatsIncluded: JSON.stringify(trip.data.whatsIncluded),
            whatsExcluded: JSON.stringify(trip.data.whatsExcluded),
            availability: JSON.stringify(trip.data.availability),
            published: trip.data.published
          }
        );

        console.log(`   ✅ Created with ID: ${document.$id}`);
        console.log('');
        
      } catch (error) {
        if (error.code === 409) {
          console.log(`   ⚠️  Similar trip might already exist, skipping...`);
        } else {
          console.log(`   ❌ Error creating ${trip.name}:`, error.message);
        }
        console.log('');
      }
    }

    console.log('🎯 Summary of created trips:');
    console.log('');
    console.log('📅 UPCOMING TRIPS (will show on browse page):');
    console.log(`   🌟 ${cyprusNextTrip.title} - ${cyprusNextTrip.startDate} (NEXT/FEATURED)`);
    console.log(`   🏖️  ${barcelonaTrip.title} - ${barcelonaTrip.startDate}`);
    console.log(`   ⭐ ${mykonosTrip.title} - ${mykonosTrip.startDate}`);
    console.log('');
    console.log('📚 PREVIOUS TRIPS (completed):');
    console.log(`   🎉 ${ibizaPreviousTrip.title} - ${ibizaPreviousTrip.startDate}`);
    console.log(`   🏛️  ${croatiaTrip.title} - ${croatiaTrip.startDate}`);
    console.log('');
    console.log('🚀 Next Steps:');
    console.log('   1. Start your dev server: npm run dev');
    console.log('   2. Visit http://localhost:3001 to see the Cyprus trip as "Next Trip"');
    console.log('   3. Check the new trip browsing functionality');
    console.log('   4. The date-based logic will automatically show the closest upcoming trip');
    console.log('');
    console.log('✨ Perfect for testing the new date-based trip selection system!');

  } catch (error) {
    console.error('❌ Error in main function:', error);
  }
}

// Run the script
addExampleTrips();
