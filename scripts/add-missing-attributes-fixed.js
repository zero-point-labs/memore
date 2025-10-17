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

async function addMissingAttributes() {
  try {
    console.log('Adding missing attributes to reviews collection...');
    
    // Add rating attribute (integer)
    try {
      await databases.createIntegerAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'rating',
        1, 5, // min, max
        true, // required
        false, // array
        false  // default
      );
      console.log('✅ Created attribute: rating');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Attribute rating already exists');
      } else {
        console.error('❌ Error creating attribute rating:', error.message);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Add published attribute (boolean)
    try {
      await databases.createBooleanAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'published',
        true, // required
        false, // array
        true   // default
      );
      console.log('✅ Created attribute: published');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Attribute published already exists');
      } else {
        console.error('❌ Error creating attribute published:', error.message);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Add featured attribute (boolean)
    try {
      await databases.createBooleanAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'featured',
        true, // required
        false, // array
        false  // default
      );
      console.log('✅ Created attribute: featured');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Attribute featured already exists');
      } else {
        console.error('❌ Error creating attribute featured:', error.message);
      }
    }
    
    console.log('✅ All missing attributes added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding attributes:', error);
    throw error;
  }
}

// Run the script
addMissingAttributes()
  .then(() => {
    console.log('🎉 Attributes setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
