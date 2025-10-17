const { Client, Databases, Permission, Role } = require('node-appwrite');

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
    
    // Create the collection with basic permissions
    const collection = await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'Reviews',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    console.log('✅ Reviews collection created successfully!');
    console.log('Collection ID:', collection.$id);
    
    // Wait a bit for collection to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create attributes one by one
    console.log('Creating attributes...');
    
    const attributes = [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'userProfileId', type: 'string', size: 255, required: true },
      { key: 'title', type: 'string', size: 100, required: true },
      { key: 'content', type: 'string', size: 1000, required: true },
      { key: 'rating', type: 'integer', min: 1, max: 5, required: true },
      { key: 'tripId', type: 'string', size: 255, required: false },
      { key: 'published', type: 'boolean', required: true },
      { key: 'featured', type: 'boolean', required: true },
    ];
    
    for (const attr of attributes) {
      try {
        await databases.createStringAttribute(
          DATABASE_ID,
          COLLECTION_ID,
          attr.key,
          attr.size,
          attr.required,
          attr.default,
          attr.array
        );
        console.log(`✅ Created attribute: ${attr.key}`);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠️  Attribute ${attr.key} already exists`);
        } else {
          console.error(`❌ Error creating attribute ${attr.key}:`, error.message);
        }
      }
    }
    
    console.log('✅ All attributes created successfully!');
    
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
