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

async function addStringAttributes() {
  try {
    console.log('Adding string attributes for rating, published, featured...');
    
    // Add rating as string attribute
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'rating',
        1, // size
        true, // required
        false, // array
        false  // default
      );
      console.log('✅ Created attribute: rating (string)');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Attribute rating already exists');
      } else {
        console.log('❌ Error creating rating (string):', error.message);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add published as string attribute
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'published',
        5, // size for 'true'/'false'
        true, // required
        false, // array
        false  // default
      );
      console.log('✅ Created attribute: published (string)');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Attribute published already exists');
      } else {
        console.log('❌ Error creating published (string):', error.message);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add featured as string attribute
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'featured',
        5, // size for 'true'/'false'
        true, // required
        false, // array
        false  // default
      );
      console.log('✅ Created attribute: featured (string)');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Attribute featured already exists');
      } else {
        console.log('❌ Error creating featured (string):', error.message);
      }
    }
    
    console.log('✅ String attributes creation complete!');
    
  } catch (error) {
    console.error('❌ Error creating string attributes:', error);
    throw error;
  }
}

// Run the script
addStringAttributes()
  .then(() => {
    console.log('🎉 String attributes created!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Creation failed:', error);
    process.exit(1);
  });
