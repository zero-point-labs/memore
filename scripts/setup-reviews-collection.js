const { Client, Databases, ID, Permission, Role } = require('node-appwrite');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('Environment variables:');
console.log('ENDPOINT:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
console.log('PROJECT_ID:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
console.log('API_KEY:', process.env.APPWRITE_API_KEY ? 'Present' : 'Missing');

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'reviews';

async function createReviewsCollection() {
  try {
    console.log('Creating reviews collection...');
    
    // Create the collection
    const collection = await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'Reviews',
      [
        // User reference
        {
          key: 'userId',
          type: 'string',
          size: 255,
          required: true,
          array: false,
        },
        // User profile reference
        {
          key: 'userProfileId',
          type: 'string',
          size: 255,
          required: true,
          array: false,
        },
        // Review title
        {
          key: 'title',
          type: 'string',
          size: 100,
          required: true,
          array: false,
        },
        // Review content
        {
          key: 'content',
          type: 'string',
          size: 1000,
          required: true,
          array: false,
        },
        // Rating (1-5 stars)
        {
          key: 'rating',
          type: 'integer',
          size: 1,
          required: true,
          array: false,
        },
        // Optional trip reference
        {
          key: 'tripId',
          type: 'string',
          size: 255,
          required: false,
          array: false,
        },
        // Published status
        {
          key: 'published',
          type: 'boolean',
          required: true,
          array: false,
        },
        // Featured status
        {
          key: 'featured',
          type: 'boolean',
          required: true,
          array: false,
        },
      ],
      [
        // Permissions: Users can read all published reviews
        Permission.read(Role.any()),
        // Users can create reviews (only authenticated users)
        Permission.create(Role.users()),
        // Users can update their own reviews
        Permission.update(Role.users()),
        // Users can delete their own reviews
        Permission.delete(Role.users()),
      ]
    );

    console.log('✅ Reviews collection created successfully!');
    console.log('Collection ID:', collection.$id);
    
    // Create indexes for better query performance
    console.log('Creating indexes...');
    
    // Index for getting reviews by user
    await databases.createIndex(
      DATABASE_ID,
      COLLECTION_ID,
      'user-reviews',
      'key',
      ['userId'],
      ['DESC']
    );
    
    // Index for getting reviews by trip
    await databases.createIndex(
      DATABASE_ID,
      COLLECTION_ID,
      'trip-reviews',
      'key',
      ['tripId'],
      ['DESC']
    );
    
    // Index for getting published reviews
    await databases.createIndex(
      DATABASE_ID,
      COLLECTION_ID,
      'published-reviews',
      'key',
      ['published'],
      ['DESC']
    );
    
    // Index for getting featured reviews
    await databases.createIndex(
      DATABASE_ID,
      COLLECTION_ID,
      'featured-reviews',
      'key',
      ['featured'],
      ['DESC']
    );
    
    // Index for getting reviews by rating
    await databases.createIndex(
      DATABASE_ID,
      COLLECTION_ID,
      'rating-reviews',
      'key',
      ['rating'],
      ['DESC']
    );
    
    console.log('✅ All indexes created successfully!');
    
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  Reviews collection already exists');
    } else {
      console.error('❌ Error creating reviews collection:', error);
      throw error;
    }
  }
}

// Run the script
createReviewsCollection()
  .then(() => {
    console.log('🎉 Database setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
