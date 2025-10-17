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

async function createMissingAttributes() {
  try {
    console.log('Creating missing attributes for reviews collection...');
    
    // Add rating attribute (integer) - using correct parameter order
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
        console.log('❌ Error creating rating:', error.message);
        
        // Try with different parameter order
        try {
          await databases.createIntegerAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'rating',
            1, 5, // min, max
            true, // required
            false  // array
          );
          console.log('✅ Created attribute: rating (alternative)');
        } catch (error2) {
          console.log('❌ Error creating rating (alternative):', error2.message);
        }
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add published attribute (boolean) - try different approaches
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
        
        // Try without default value
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
          
          // Try as not required
          try {
            await databases.createBooleanAttribute(
              DATABASE_ID,
              COLLECTION_ID,
              'published',
              false, // required
              false, // array
              true   // default
            );
            console.log('✅ Created attribute: published (not required)');
          } catch (error3) {
            console.log('❌ Error creating published (not required):', error3.message);
          }
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
        
        // Try without default value
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
          
          // Try as not required
          try {
            await databases.createBooleanAttribute(
              DATABASE_ID,
              COLLECTION_ID,
              'featured',
              false, // required
              false, // array
              false  // default
            );
            console.log('✅ Created attribute: featured (not required)');
          } catch (error3) {
            console.log('❌ Error creating featured (not required):', error3.message);
          }
        }
      }
    }
    
    console.log('✅ Attribute creation complete!');
    
  } catch (error) {
    console.error('❌ Error creating attributes:', error);
    throw error;
  }
}

// Run the script
createMissingAttributes()
  .then(() => {
    console.log('🎉 Attributes created!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Creation failed:', error);
    process.exit(1);
  });
