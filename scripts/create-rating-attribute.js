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

async function createRatingAttribute() {
  try {
    console.log('Creating rating attribute...');
    
    // Try different parameter combinations for rating
    const attempts = [
      // Attempt 1: All parameters
      () => databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'rating', 1, 5, true, false, false),
      // Attempt 2: Without default
      () => databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'rating', 1, 5, true, false),
      // Attempt 3: Without array
      () => databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'rating', 1, 5, true),
      // Attempt 4: Minimal parameters
      () => databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'rating', 1, 5),
      // Attempt 5: Not required
      () => databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'rating', 1, 5, false, false),
      // Attempt 6: Not required, minimal
      () => databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'rating', 1, 5, false),
    ];
    
    for (let i = 0; i < attempts.length; i++) {
      try {
        await attempts[i]();
        console.log(`✅ Created attribute: rating (attempt ${i + 1})`);
        break;
      } catch (error) {
        if (error.code === 409) {
          console.log('⚠️  Attribute rating already exists');
          break;
        } else {
          console.log(`❌ Error creating rating (attempt ${i + 1}):`, error.message);
          if (i === attempts.length - 1) {
            console.log('❌ All attempts failed for rating attribute');
          }
        }
      }
    }
    
    console.log('✅ Rating attribute creation complete!');
    
  } catch (error) {
    console.error('❌ Error creating rating attribute:', error);
    throw error;
  }
}

// Run the script
createRatingAttribute()
  .then(() => {
    console.log('🎉 Rating attribute created!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Creation failed:', error);
    process.exit(1);
  });
