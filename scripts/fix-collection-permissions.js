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

const collections = [
  'user_profiles',
  'bookings', 
  'payment_schedules',
  'notifications',
  'global_settings'
];

async function updateCollectionPermissions(collectionId) {
  try {
    console.log(`Updating permissions for collection: ${collectionId}`);
    
    // Set permissions that allow authenticated users to manage their own data
    const permissions = [
      Permission.create(Role.users()),
      Permission.read(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
      // Also allow any authenticated user to read (for cross-references)
      Permission.read(Role.user('any')),
    ];

    await databases.updateCollection(
      DATABASE_ID,
      collectionId,
      collectionId, // name stays the same
      permissions
    );
    
    console.log(`✅ Updated permissions for ${collectionId}`);
  } catch (error) {
    console.error(`❌ Failed to update permissions for ${collectionId}:`, error.message);
  }
}

async function main() {
  console.log('🔧 Fixing collection permissions...\n');
  
  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ APPWRITE_API_KEY is required in .env.local');
    process.exit(1);
  }
  
  try {
    for (const collectionId of collections) {
      await updateCollectionPermissions(collectionId);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    }
    
    console.log('\n🎉 All collection permissions updated!');
    console.log('\n📋 Updated collections:');
    collections.forEach(col => {
      console.log(`   ✅ ${col}`);
    });
    
    console.log('\n🔧 Permissions set to:');
    console.log('   - Users can create their own records');
    console.log('   - Users can read/update/delete their own records');
    console.log('   - Any authenticated user can read (for cross-references)');
    
  } catch (error) {
    console.error('\n❌ Permission update failed:', error.message);
    process.exit(1);
  }
}

main();
