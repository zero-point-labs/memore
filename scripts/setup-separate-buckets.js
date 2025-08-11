require('dotenv').config({ path: '.env.local' });
const { Client, Storage, Permission, Role } = require('node-appwrite');

async function setupSeparateBuckets() {
  console.log('🚀 Setting up separate buckets for Blog and Trip images...');
  console.log('⚠️  This requires a paid Appwrite plan that allows multiple buckets.\n');

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const storage = new Storage(client);

  try {
    // Check current buckets
    const buckets = await storage.listBuckets();
    console.log(`📦 Current buckets: ${buckets.total}`);
    
    // Create Trip Images bucket
    console.log('\n1️⃣ Creating Trip Images bucket...');
    const tripBucket = await storage.createBucket(
      'trip_images',
      'Trip Images',
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any())
      ],
      false, // fileSecurity
      true,  // enabled
      undefined, // maximumFileSize
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'], // allowedFileExtensions
      'gzip', // compression
      false, // encryption
      false  // antivirus
    );

    console.log('✅ Trip Images bucket created:', tripBucket.$id);

    // Rename existing bucket to be more specific
    console.log('\n2️⃣ Renaming existing bucket to "Blog Images"...');
    await storage.updateBucket(
      'blog_images',
      'Blog Images', // Rename back to be specific
      undefined, // Keep existing permissions
    );

    console.log('✅ Blog Images bucket renamed');

    console.log('\n🎉 Separate buckets setup complete!');
    console.log('📦 Blog Images (blog_images) - for blog featured images');
    console.log('📦 Trip Images (trip_images) - for trip gallery images');
    
    console.log('\n📝 Next steps:');
    console.log('1. Add this to your .env.local file:');
    console.log('   NEXT_PUBLIC_USE_SEPARATE_BUCKETS=true');
    console.log('   NEXT_PUBLIC_APPWRITE_TRIP_BUCKET_ID=trip_images');
    console.log('');
    console.log('2. Restart your development server: npm run dev');
    console.log('');
    console.log('✨ Your images will now be stored in separate buckets!');

  } catch (error) {
    if (error.code === 403 && error.type === 'additional_resource_not_allowed') {
      console.log('❌ Cannot create additional buckets');
      console.log('💡 Your current plan only allows 1 storage bucket');
      console.log('📁 Continue using folder organization: blogs/ and trips/');
      console.log('\n🔧 To upgrade:');
      console.log('1. Go to your Appwrite Console');
      console.log('2. Upgrade to a paid plan');
      console.log('3. Run this script again');
    } else {
      console.error('❌ Error setting up separate buckets:', error);
    }
  }
}

setupSeparateBuckets();
