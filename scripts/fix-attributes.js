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

async function fixAttributes() {
  try {
    console.log('Fixing attributes for reviews collection...');
    
    // First, let's check what attributes exist
    try {
      const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
      console.log('Current collection attributes:', collection.attributes?.map(attr => attr.key));
    } catch (error) {
      console.log('Could not get collection info:', error.message);
    }
    
    // Add rating attribute (integer) - try different parameter orders
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
        console.log('❌ Error creating rating with method 1:', error.message);
        
        // Try alternative method
        try {
          await databases.createIntegerAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'rating',
            1, 5, // min, max
            true, // required
            false  // array
          );
          console.log('✅ Created attribute: rating (method 2)');
        } catch (error2) {
          console.log('❌ Error creating rating with method 2:', error2.message);
        }
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
        console.log('❌ Error creating published:', error.message);
        
        // Try without default
        try {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'published',
            true, // required
            false  // array
          );
          console.log('✅ Created attribute: published (no default)');
        } catch (error2) {
          console.log('❌ Error creating published (no default):', error2.message);
        }
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
        console.log('❌ Error creating featured:', error.message);
        
        // Try without default
        try {
          await databases.createBooleanAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'featured',
            true, // required
            false  // array
          );
          console.log('✅ Created attribute: featured (no default)');
        } catch (error2) {
          console.log('❌ Error creating featured (no default):', error2.message);
        }
      }
    }
    
    console.log('✅ Attribute fixing complete!');
    
  } catch (error) {
    console.error('❌ Error fixing attributes:', error);
    throw error;
  }
}

// Run the script
fixAttributes()
  .then(() => {
    console.log('🎉 Attributes fixed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fix failed:', error);
    process.exit(1);
  });
