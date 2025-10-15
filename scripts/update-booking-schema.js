const { Client, Databases } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client();

// Check environment variables
console.log('Environment check:');
console.log('- NEXT_PUBLIC_APPWRITE_ENDPOINT:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
console.log('- NEXT_PUBLIC_APPWRITE_PROJECT_ID:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
console.log('- APPWRITE_API_KEY:', process.env.APPWRITE_API_KEY ? 'Set' : 'Not set');

if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
  console.error('❌ NEXT_PUBLIC_APPWRITE_ENDPOINT is not set');
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
  console.error('❌ NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set');
  process.exit(1);
}

if (!process.env.APPWRITE_API_KEY) {
  console.error('❌ APPWRITE_API_KEY is not set');
  process.exit(1);
}

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'bookings';

async function updateBookingSchema() {
  try {
    console.log('Updating booking collection schema...');
    console.log('Database ID:', DATABASE_ID);
    console.log('Collection ID:', COLLECTION_ID);

    // Add paymentInfo attribute as JSON
    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'paymentInfo',
      50000, // Large size for JSON data
      false,  // Not required
      '{}',   // Default empty JSON object
      false   // Not array
    );

    console.log('✅ Added paymentInfo attribute to bookings collection');
    console.log('⏳ Waiting for database to update (this may take a few minutes)...');
    
    // Wait a bit for the attribute to be created
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('✅ Database schema update completed!');
    console.log('You can now test the manual charge functionality.');

  } catch (error) {
    if (error.message && error.message.includes('Attribute already exists')) {
      console.log('✅ paymentInfo attribute already exists in the collection');
    } else {
      console.error('❌ Error updating schema:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        type: error.type
      });
    }
  }
}

// Run the update
updateBookingSchema();
