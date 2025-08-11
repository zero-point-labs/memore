/**
 * Script to set up the trips collection in Appwrite database
 * Run this script after setting up your Appwrite project
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

async function createTripsCollection() {
  try {
    console.log('=== Appwrite Configuration ===');
    console.log('Project ID:', PROJECT_ID);
    console.log('Database ID:', DATABASE_ID);
    console.log('Endpoint:', ENDPOINT);
    console.log('API Key exists:', API_KEY ? 'Yes' : 'No');
    console.log('API Key length:', API_KEY ? API_KEY.length : 0);
    console.log('===============================');
    
    console.log('Creating trips collection...');
    
    // Create the trips collection
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

    // Create attributes for the trips collection
    const attributes = [
      // Basic trip information
      { key: 'title', type: 'string', size: 500, required: true },
      { key: 'description', type: 'string', size: 2000, required: true },
      { key: 'location', type: 'string', size: 200, required: true },
      { key: 'startDate', type: 'string', size: 50, required: true },
      { key: 'endDate', type: 'string', size: 50, required: true },
      { key: 'duration', type: 'integer', required: true },
      
      // JSON fields (stored as strings)
      { key: 'itinerary', type: 'string', size: 10000, required: true },
      { key: 'gallery', type: 'string', size: 5000, required: true },
      { key: 'pricing', type: 'string', size: 2000, required: true },
      { key: 'highlights', type: 'string', size: 5000, required: true },
      { key: 'whatsIncluded', type: 'string', size: 5000, required: true },
      { key: 'whatsExcluded', type: 'string', size: 5000, required: true },
      { key: 'availability', type: 'string', size: 2000, required: true },
      
      // Category and status
      { key: 'category', type: 'string', size: 50, required: true },
      { key: 'published', type: 'boolean', required: true, default: false },
      { key: 'featured', type: 'boolean', required: true, default: false },
    ];

    // Create each attribute
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

    console.log('✅ Trips collection setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Make sure your NEXT_PUBLIC_APPWRITE_DATABASE_ID is set to:', DATABASE_ID);
    console.log('2. Test creating a trip through the admin panel');
    console.log('3. Verify the data structure is working correctly');

  } catch (error) {
    console.error('Error setting up trips collection:', error);
  }
}

// Run the setup
createTripsCollection();
