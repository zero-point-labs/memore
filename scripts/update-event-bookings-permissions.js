const { Client, Databases, Permission, Role } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = 'event_bookings';

async function updateEventBookingsPermissions() {
  try {
    console.log('Updating event_bookings collection permissions...');

    // Update collection permissions to allow server-side access
    const collection = await databases.updateCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'Event Bookings',
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),  // Allow server-side creation
        Permission.update(Role.any()),  // Allow server-side updates
        Permission.delete(Role.any()),  // Allow server-side deletion
      ]
    );

    console.log('✓ Event bookings collection permissions updated successfully!');
    console.log(`Collection ID: ${collection.$id}`);

  } catch (error) {
    console.error('Error updating event bookings permissions:', error);
    throw error;
  }
}

// Run the update
if (require.main === module) {
  updateEventBookingsPermissions()
    .then(() => {
      console.log('Permission update completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Permission update failed:', error);
      process.exit(1);
    });
}

module.exports = { updateEventBookingsPermissions };
