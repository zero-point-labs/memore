const { Client, Databases, Permission, Role } = require('node-appwrite');

// Configuration
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68991582002caa13715f';
const APPWRITE_API_KEY = 'standard_80b592a711537ec58e159e1e826186a91bf85ceadf1bd5c43a75cf6ced81a22f5e49079e1e783a063c101f2ca80b28a0387519875f7bf293d96acf81d14ba2a41b8ad71d5ba09d588a3474d2ca52fadfcf1b97f89a3a18d8a28aae5afdfa49632bbf631f2731d81fd40d7c9537d131a5a9aa36eebb8677ffd970953172018c46';

const DATABASE_ID = 'memora_db';
const BLOGS_COLLECTION_ID = 'blogs';

// Initialize Appwrite
const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function setupAppwrite() {
  console.log('🚀 Setting up Appwrite collections...');

  try {
    // Try to create database first
    try {
      const database = await databases.create(DATABASE_ID, 'Memora Database');
      console.log('✅ Database created:', database.name);
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Database already exists');
      } else {
        throw error;
      }
    }

    // Create blogs collection
    try {
      const blogsCollection = await databases.createCollection(
        DATABASE_ID,
        BLOGS_COLLECTION_ID,
        'Blogs',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      console.log('✅ Blogs collection created:', blogsCollection.name);
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Blogs collection already exists');
      } else {
        throw error;
      }
    }

    // Create attributes for blogs collection
    const attributes = [
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'content', type: 'string', size: 65536, required: true },
      { key: 'excerpt', type: 'string', size: 500, required: true },
      { key: 'category', type: 'string', size: 50, required: true },
      { key: 'author', type: 'string', size: 1000, required: true }, // JSON string
      { key: 'image', type: 'string', size: 255, required: true },
      { key: 'tags', type: 'string', size: 1000, required: true }, // JSON array as string
      { key: 'likes', type: 'integer', min: 0, max: 999999999, default: 0 },
      { key: 'comments', type: 'integer', min: 0, max: 999999999, default: 0 },
      { key: 'trending', type: 'boolean', default: false },
      { key: 'readTime', type: 'integer', min: 1, max: 999, required: true },
      { key: 'published', type: 'boolean', default: true },
    ];

    for (const attr of attributes) {
      try {
        let attribute;
        switch (attr.type) {
          case 'string':
            attribute = await databases.createStringAttribute(
              DATABASE_ID,
              BLOGS_COLLECTION_ID,
              attr.key,
              attr.size,
              attr.required || false,
              attr.default
            );
            break;
          case 'integer':
            attribute = await databases.createIntegerAttribute(
              DATABASE_ID,
              BLOGS_COLLECTION_ID,
              attr.key,
              attr.required || false,
              attr.min,
              attr.max,
              attr.default
            );
            break;
          case 'boolean':
            attribute = await databases.createBooleanAttribute(
              DATABASE_ID,
              BLOGS_COLLECTION_ID,
              attr.key,
              attr.required || false,
              attr.default
            );
            break;
        }
        console.log(`✅ Created attribute: ${attr.key}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Attribute ${attr.key} already exists`);
        } else {
          console.log(`❌ Error creating attribute ${attr.key}:`, error.message);
        }
      }
    }

    // Create indexes
    const indexes = [
      { key: 'category_index', type: 'key', attributes: ['category'] },
      { key: 'published_index', type: 'key', attributes: ['published'] },
      { key: 'trending_index', type: 'key', attributes: ['trending'] },
      { key: 'date_index', type: 'key', attributes: ['$createdAt'], orders: ['DESC'] },
    ];

    for (const index of indexes) {
      try {
        const createdIndex = await databases.createIndex(
          DATABASE_ID,
          BLOGS_COLLECTION_ID,
          index.key,
          index.type,
          index.attributes,
          index.orders
        );
        console.log(`✅ Created index: ${index.key}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️  Index ${index.key} already exists`);
        } else {
          console.log(`❌ Error creating index ${index.key}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Appwrite setup completed successfully!');
    console.log('\n📋 Collection Info:');
    console.log(`Database ID: ${DATABASE_ID}`);
    console.log(`Blogs Collection ID: ${BLOGS_COLLECTION_ID}`);
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupAppwrite();