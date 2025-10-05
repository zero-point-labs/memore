/**
 * Script to set up the events collection in Appwrite database
 * Run this script after setting up your Appwrite project
 * 
 * Usage: node scripts/setup-events-collection.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases, Permission, Role } = require('node-appwrite');

// Configuration - Update these with your Appwrite details
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'your-project-id';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const API_KEY = process.env.APPWRITE_API_KEY || 'your-api-key';
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

async function createEventsCollection() {
  try {
    console.log('=== Appwrite Configuration ===');
    console.log('Project ID:', PROJECT_ID);
    console.log('Database ID:', DATABASE_ID);
    console.log('Endpoint:', ENDPOINT);
    console.log('API Key exists:', API_KEY ? 'Yes' : 'No');
    console.log('API Key length:', API_KEY ? API_KEY.length : 0);
    console.log('===============================');
    
    console.log('Creating events collection...');
    
    // Create the events collection
    const collection = await databases.createCollection(
      DATABASE_ID,
      'events',
      'Events',
      [
        Permission.read(Role.any()),
        Permission.write(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    console.log('Events collection created:', collection.$id);

    // Create attributes for the events collection
    const attributes = [
      // Basic event information
      { key: 'title', type: 'string', size: 500, required: true },
      { key: 'slug', type: 'string', size: 500, required: true },
      { key: 'description', type: 'string', size: 2000, required: true },
      { key: 'longDescription', type: 'string', size: 10000, required: false },
      
      // Event type and category
      { key: 'eventType', type: 'string', size: 100, required: true },
      { key: 'category', type: 'string', size: 2000, required: true }, // JSON array stored as string
      
      // Date and time
      { key: 'eventDate', type: 'string', size: 50, required: true }, // ISO datetime string
      { key: 'startTime', type: 'string', size: 20, required: true },
      { key: 'endTime', type: 'string', size: 20, required: true },
      { key: 'duration', type: 'integer', required: true }, // in hours
      
      // Location
      { key: 'venue', type: 'string', size: 300, required: true },
      { key: 'venueAddress', type: 'string', size: 500, required: false },
      { key: 'city', type: 'string', size: 100, required: true },
      { key: 'location', type: 'string', size: 500, required: false }, // JSON {lat, lng}
      
      // Media
      { key: 'featuredImage', type: 'string', size: 200, required: true }, // Appwrite file ID
      { key: 'gallery', type: 'string', size: 5000, required: true }, // JSON array of file IDs
      { key: 'videoUrl', type: 'string', size: 500, required: false },
      
      // Pricing (JSON stored as string)
      { key: 'pricing', type: 'string', size: 3000, required: true },
      
      // Capacity (JSON stored as string)
      { key: 'capacity', type: 'string', size: 1000, required: true },
      
      // What's included
      { key: 'includes', type: 'string', size: 5000, required: true }, // JSON array
      
      // Requirements & Restrictions
      { key: 'ageRestriction', type: 'integer', required: true, default: 18 },
      { key: 'dresscode', type: 'string', size: 500, required: false },
      { key: 'requirements', type: 'string', size: 2000, required: false }, // JSON array
      
      // Highlights
      { key: 'highlights', type: 'string', size: 5000, required: true }, // JSON array
      { key: 'lineup', type: 'string', size: 5000, required: false }, // JSON array of DJ/artist names
      
      // Booking settings
      { key: 'bookingStatus', type: 'string', size: 50, required: true },
      { key: 'paymentType', type: 'string', size: 50, required: true },
      { key: 'cancellationPolicy', type: 'string', size: 2000, required: false },
      
      // Admin
      { key: 'published', type: 'boolean', required: true, default: false },
      { key: 'featured', type: 'boolean', required: true, default: false },
      { key: 'organizer', type: 'string', size: 200, required: false },
      
      // Metadata
      { key: 'views', type: 'integer', required: false, default: 0 },
      { key: 'bookingCount', type: 'integer', required: false, default: 0 },
    ];

    // Create each attribute
    for (const attr of attributes) {
      try {
        console.log(`Creating attribute: ${attr.key}`);
        
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            'events',
            attr.key,
            attr.size,
            attr.required,
            attr.default || null
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            DATABASE_ID,
            'events',
            attr.key,
            attr.required,
            null, // min
            null, // max
            attr.default || null
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            'events',
            attr.key,
            attr.required,
            attr.default || null
          );
        }
        
        console.log(`✓ Created attribute: ${attr.key}`);
        
        // Wait a bit between attribute creations to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error creating attribute ${attr.key}:`, error.message);
      }
    }

    // Create indexes for better query performance
    console.log('Creating indexes...');
    
    const indexes = [
      { key: 'published', type: 'key', attributes: ['published'] },
      { key: 'featured', type: 'key', attributes: ['featured'] },
      { key: 'eventType', type: 'key', attributes: ['eventType'] },
      { key: 'city', type: 'key', attributes: ['city'] },
      { key: 'eventDate', type: 'key', attributes: ['eventDate'] },
      { key: 'bookingStatus', type: 'key', attributes: ['bookingStatus'] },
      { key: 'slug', type: 'key', attributes: ['slug'] },
    ];

    for (const index of indexes) {
      try {
        console.log(`Creating index: ${index.key}`);
        await databases.createIndex(
          DATABASE_ID,
          'events',
          index.key,
          index.type,
          index.attributes
        );
        console.log(`✓ Created index: ${index.key}`);
        
        // Wait between index creations
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error creating index ${index.key}:`, error.message);
      }
    }

    console.log('✅ Events collection setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Events collection is ready for use');
    console.log('2. Create event types: club-night, beach-party, boat-party, festival, bar-crawl');
    console.log('3. Test creating an event through the admin panel');
    console.log('4. Verify the data structure is working correctly');

  } catch (error) {
    console.error('Error setting up events collection:', error);
    console.error('Full error:', error);
  }
}

// Run the setup
createEventsCollection();

