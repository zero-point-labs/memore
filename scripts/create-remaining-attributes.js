const { Client, Databases } = require('node-appwrite');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'reviews';

async function createRemainingAttributes() {
  try {
    console.log('Creating remaining attributes...');
    
    // Try rating as integer with minimal parameters
    try {
      await databases.createIntegerAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'rating',
        1, 5, // min, max
        true, // required
        false  // array
      );
      console.log('✅ Created attribute: rating');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Attribute rating already exists');
      } else {
        console.log('❌ Error creating rating:', error.message);
        
        // Try as not required
        try {
          await databases.createIntegerAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'rating',
            1, 5, // min, max
            false, // required
            false  // array
          );
          console.log('✅ Created attribute: rating (not required)');
        } catch (error2) {
          console.log('❌ Error creating rating (not required):', error2.message);
        }
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Try published as boolean with minimal parameters
    try {
      await databases.createBooleanAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'published',
        true, // required
        false  // array
      );
      console.log('✅ Created attribute: published');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Attribute published already exists');
      } else {
        console.log('❌ Error creating published:', error.message);
        
        // Try as not required
        try {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'published',
            false, // required
            false  // array
          );
          console.log('✅ Created attribute: published (not required)');
        } catch (error2) {
          console.log('❌ Error creating published (not required):', error2.message);
        }
      }
    }
    
    console.log('✅ Remaining attributes creation complete!');
    
  } catch (error) {
    console.error('❌ Error creating remaining attributes:', error);
    throw error;
  }
}

// Run the script
createRemainingAttributes()
  .then(() => {
    console.log('🎉 All attributes created!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Creation failed:', error);
    process.exit(1);
  });
