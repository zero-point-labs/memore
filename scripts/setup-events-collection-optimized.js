/**
 * OPTIMIZED Script to set up the events collection in Appwrite database
 * Uses consolidated JSON fields to work within Appwrite's attribute limits
 * 
 * Usage: node scripts/setup-events-collection-optimized.js
 */

require('dotenv').config({ path: '.env.local' });

const { Client, Databases, Permission, Role, ID } = require('node-appwrite');

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const API_KEY = process.env.APPWRITE_API_KEY;
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

async function deleteExistingCollection() {
  try {
    console.log('Deleting existing events collection...');
    await databases.deleteCollection(DATABASE_ID, 'events');
    console.log('✓ Deleted existing collection');
    // Wait for deletion to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    console.log('No existing collection to delete or error:', error.message);
  }
}

async function createEventsCollection() {
  try {
    console.log('=== Appwrite Configuration ===');
    console.log('Project ID:', PROJECT_ID);
    console.log('Database ID:', DATABASE_ID);
    console.log('Endpoint:', ENDPOINT);
    console.log('===============================');
    
    // Delete existing collection first
    await deleteExistingCollection();
    
    console.log('Creating optimized events collection...');
    
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

    // OPTIMIZED: Consolidated attributes to stay under Appwrite limits
    const attributes = [
      // Basic fields (searchable/filterable)
      { key: 'title', type: 'string', size: 500, required: true },
      { key: 'slug', type: 'string', size: 500, required: true },
      { key: 'description', type: 'string', size: 2000, required: true },
      { key: 'eventType', type: 'string', size: 100, required: true },
      { key: 'city', type: 'string', size: 100, required: true },
      { key: 'eventDate', type: 'string', size: 50, required: true },
      { key: 'bookingStatus', type: 'string', size: 50, required: true },
      { key: 'published', type: 'boolean', required: true },
      { key: 'featured', type: 'boolean', required: true },
      
      // Consolidated JSON fields (to reduce attribute count)
      { key: 'eventDetails', type: 'string', size: 50000, required: true }, // longDescription, startTime, endTime, duration, ageRestriction, dresscode, paymentType, cancellationPolicy, organizer
      { key: 'venueInfo', type: 'string', size: 5000, required: true }, // venue, venueAddress, location
      { key: 'media', type: 'string', size: 10000, required: true }, // featuredImage, gallery, videoUrl
      { key: 'pricing', type: 'string', size: 5000, required: true }, // general, vip, earlyBird
      { key: 'capacity', type: 'string', size: 2000, required: true }, // general, vip, taken, remaining
      { key: 'eventContent', type: 'string', size: 20000, required: true }, // includes, requirements, highlights, lineup, category
      { key: 'stats', type: 'string', size: 1000, required: false }, // views, bookingCount
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
            null,
            null,
            attr.default || null
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            'events',
            attr.key,
            attr.required,
            attr.default !== undefined ? attr.default : null
          );
        }
        
        console.log(`✓ Created attribute: ${attr.key}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error creating attribute ${attr.key}:`, error.message);
      }
    }

    // Create indexes
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
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error creating index ${index.key}:`, error.message);
      }
    }

    console.log('✅ Optimized Events collection setup completed successfully!');
    console.log('');
    console.log('Collection uses consolidated JSON fields:');
    console.log('- eventDetails: time, duration, age, dresscode, policies');
    console.log('- venueInfo: venue, address, coordinates');
    console.log('- media: featured image, gallery, video');
    console.log('- pricing: general, VIP, early bird');
    console.log('- capacity: general/VIP counts and availability');
    console.log('- eventContent: includes, requirements, highlights, lineup, categories');

  } catch (error) {
    console.error('Error setting up events collection:', error);
  }
}

createEventsCollection();

