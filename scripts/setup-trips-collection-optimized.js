/**
 * Optimized script to set up the trips collection in Appwrite database
 * This version uses smaller field sizes to work within Appwrite limits
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Client, Databases, Permission, Role } = require('node-appwrite');

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

async function deleteAndRecreateCollection() {
  try {
    console.log('Deleting existing trips collection...');
    
    // Try to delete the existing collection
    try {
      await databases.deleteCollection(DATABASE_ID, 'trips');
      console.log('✓ Deleted existing collection');
      // Wait a moment for deletion to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.log('Collection may not exist yet, continuing...');
    }

    console.log('Creating optimized trips collection...');
    
    // Create the trips collection with smaller, more efficient attributes
    const collection = await databases.createCollection(
      DATABASE_ID,
      'trips',
      'Trips',
      [
        Permission.read(Role.any()),
        Permission.write(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    console.log('Trips collection created:', collection.$id);

    // Create attributes with optimized sizes
    const attributes = [
      // Basic trip information
      { key: 'title', type: 'string', size: 200, required: true },
      { key: 'description', type: 'string', size: 1000, required: true },
      { key: 'location', type: 'string', size: 100, required: true },
      { key: 'startDate', type: 'string', size: 50, required: true },
      { key: 'endDate', type: 'string', size: 50, required: true },
      { key: 'duration', type: 'integer', required: true },
      
      // Compressed JSON fields (smaller sizes)
      { key: 'itinerary', type: 'string', size: 3000, required: false },
      { key: 'gallery', type: 'string', size: 1000, required: false },
      { key: 'pricing', type: 'string', size: 500, required: true },
      { key: 'highlights', type: 'string', size: 1000, required: false },
      { key: 'whatsIncluded', type: 'string', size: 1000, required: false },
      { key: 'whatsExcluded', type: 'string', size: 500, required: false },
      { key: 'availability', type: 'string', size: 300, required: true },
      
      // Category and status
      { key: 'category', type: 'string', size: 50, required: true },
      { key: 'published', type: 'boolean', required: true, default: false },
      { key: 'featured', type: 'boolean', required: true, default: false },
    ];

    // Create each attribute with delays to avoid rate limiting
    for (const attr of attributes) {
      try {
        console.log(`Creating attribute: ${attr.key}`);
        
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            DATABASE_ID,
            'trips',
            attr.key,
            attr.size,
            attr.required,
            attr.default || null
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            DATABASE_ID,
            'trips',
            attr.key,
            attr.required,
            null, // min
            null, // max
            attr.default || null
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            'trips',
            attr.key,
            attr.required,
            attr.default || null
          );
        }
        
        console.log(`✓ Created attribute: ${attr.key}`);
        
        // Wait between attribute creations
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`Error creating attribute ${attr.key}:`, error.message);
      }
    }

    // Create indexes for better query performance
    console.log('Creating indexes...');
    
    const indexes = [
      { key: 'published', type: 'key', attributes: ['published'] },
      { key: 'featured', type: 'key', attributes: ['featured'] },
      { key: 'category', type: 'key', attributes: ['category'] },
      { key: 'startDate', type: 'key', attributes: ['startDate'] },
      { key: 'location', type: 'key', attributes: ['location'] },
    ];

    for (const index of indexes) {
      try {
        console.log(`Creating index: ${index.key}`);
        await databases.createIndex(
          DATABASE_ID,
          'trips',
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

    console.log('✅ Optimized trips collection setup completed successfully!');
    console.log('');
    console.log('The collection has been optimized to work within Appwrite limits:');
    console.log('- Smaller field sizes for JSON data');
    console.log('- All essential attributes included');
    console.log('- Proper indexes for performance');
    console.log('');
    console.log('You can now create trips through the admin panel!');

  } catch (error) {
    console.error('Error setting up optimized trips collection:', error);
  }
}

// Run the setup
deleteAndRecreateCollection();

