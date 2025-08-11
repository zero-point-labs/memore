const { Client, Storage, Permission, Role } = require('node-appwrite');

// Configuration
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68991582002caa13715f';
const APPWRITE_API_KEY = 'standard_80b592a711537ec58e159e1e826186a91bf85ceadf1bd5c43a75cf6ced81a22f5e49079e1e783a063c101f2ca80b28a0387519875f7bf293d96acf81d14ba2a41b8ad71d5ba09d588a3474d2ca52fadfcf1b97f89a3a18d8a28aae5afdfa49632bbf631f2731d81fd40d7c9537d131a5a9aa36eebb8677ffd970953172018c46';

const BUCKET_ID = 'blog_images';

// Initialize Appwrite
const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const storage = new Storage(client);

async function setupStorage() {
  console.log('🚀 Setting up Appwrite storage...');

  try {
    // Create storage bucket for blog images
    try {
      const bucket = await storage.createBucket(
        BUCKET_ID,
        'Blog Images',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ],
        false, // Not file security (we'll handle permissions)
        true,  // Enabled
        undefined, // No size limit
        ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'], // Allowed file extensions
        'gzip', // Compression
        false, // Not encrypted
        false  // Not antivirus
      );
      console.log('✅ Storage bucket created:', bucket.name);
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Storage bucket already exists');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Storage setup completed successfully!');
    console.log('\n📋 Storage Info:');
    console.log(`Bucket ID: ${BUCKET_ID}`);
    console.log('Allowed file types: jpg, jpeg, png, gif, webp, svg');
    console.log('Compression: gzip enabled');
    
  } catch (error) {
    console.error('❌ Storage setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupStorage();