const { Client, Databases, ID, Permission, Role } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); // You'll need to add this to your .env.local

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

// Collection configurations
const collections = [
  {
    id: 'user_profiles',
    name: 'User Profiles',
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'firstName', type: 'string', size: 255, required: true },
      { key: 'lastName', type: 'string', size: 255, required: true },
      { key: 'email', type: 'email', required: true },
      { key: 'phone', type: 'string', size: 50, required: true },
      { key: 'phoneCountryCode', type: 'string', size: 10, required: true },
      { key: 'university', type: 'string', size: 255, required: false },
      { key: 'studentStatus', type: 'enum', elements: ['college', 'youth'], required: true },
      { key: 'stripeCustomerId', type: 'string', size: 255, required: false },
      { key: 'emailOptIn', type: 'boolean', required: true },
      { key: 'smsOptIn', type: 'boolean', required: true },
      { key: 'marketingOptIn', type: 'boolean', required: true }
    ],
    indexes: [
      { key: 'userId', type: 'unique', attributes: ['userId'] },
      { key: 'email', type: 'unique', attributes: ['email'] },
      { key: 'stripeCustomerId', type: 'unique', attributes: ['stripeCustomerId'] }
    ]
  },
  {
    id: 'bookings',
    name: 'Bookings',
    attributes: [
      { key: 'tripId', type: 'string', size: 255, required: true },
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'userProfileId', type: 'string', size: 255, required: true },
      { key: 'packageType', type: 'string', size: 100, required: true },
      { key: 'roomPreference', type: 'enum', elements: ['twin', 'double', 'single'], required: true },
      { key: 'transportPreference', type: 'enum', elements: ['bus', 'own_car'], required: true },
      { key: 'specialRequests', type: 'string', size: 1000, required: false },
      { key: 'totalAmount', type: 'double', required: true },
      { key: 'depositAmount', type: 'double', required: true },
      { key: 'balanceAmount', type: 'double', required: true },
      { key: 'currency', type: 'string', size: 10, required: true },
      { key: 'stripeCustomerId', type: 'string', size: 255, required: true },
      { key: 'depositPaymentIntentId', type: 'string', size: 255, required: false },
      { key: 'balancePaymentIntentId', type: 'string', size: 255, required: false },
      { key: 'paymentMethodId', type: 'string', size: 255, required: false },
      { key: 'balanceDueDate', type: 'datetime', required: true },
      { key: 'bookingStatus', type: 'enum', elements: ['pending', 'deposit_paid', 'fully_paid', 'cancelled', 'refunded'], required: true },
      { key: 'paymentStatus', type: 'enum', elements: ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'], required: true }
    ],
    indexes: [
      { key: 'userId', type: 'key', attributes: ['userId'] },
      { key: 'tripId', type: 'key', attributes: ['tripId'] },
      { key: 'bookingStatus', type: 'key', attributes: ['bookingStatus'] },
      { key: 'paymentStatus', type: 'key', attributes: ['paymentStatus'] },
      { key: 'balanceDueDate', type: 'key', attributes: ['balanceDueDate'] }
    ]
  },
  {
    id: 'payment_schedules',
    name: 'Payment Schedules',
    attributes: [
      { key: 'bookingId', type: 'string', size: 255, required: true },
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'paymentType', type: 'enum', elements: ['deposit', 'balance'], required: true },
      { key: 'amount', type: 'double', required: true },
      { key: 'currency', type: 'string', size: 10, required: true },
      { key: 'paymentIntentId', type: 'string', size: 255, required: false },
      { key: 'paymentMethodId', type: 'string', size: 255, required: false },
      { key: 'scheduledDate', type: 'datetime', required: true },
      { key: 'processedAt', type: 'datetime', required: false },
      { key: 'status', type: 'enum', elements: ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'], required: true },
      { key: 'retryCount', type: 'integer', required: true },
      { key: 'maxRetries', type: 'integer', required: true },
      { key: 'lastAttemptAt', type: 'datetime', required: false },
      { key: 'nextRetryAt', type: 'datetime', required: false },
      { key: 'errorMessage', type: 'string', size: 1000, required: false }
    ],
    indexes: [
      { key: 'bookingId', type: 'key', attributes: ['bookingId'] },
      { key: 'userId', type: 'key', attributes: ['userId'] },
      { key: 'status', type: 'key', attributes: ['status'] },
      { key: 'scheduledDate', type: 'key', attributes: ['scheduledDate'] },
      { key: 'nextRetryAt', type: 'key', attributes: ['nextRetryAt'] }
    ]
  },
  {
    id: 'notifications',
    name: 'Notifications',
    attributes: [
      { key: 'bookingId', type: 'string', size: 255, required: false },
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'type', type: 'enum', elements: ['booking_confirmation', 'payment_success', 'payment_reminder', 'payment_failed', 'trip_reminder', 'admin_alert'], required: true },
      { key: 'method', type: 'enum', elements: ['email', 'sms'], required: true },
      { key: 'recipient', type: 'string', size: 255, required: true },
      { key: 'subject', type: 'string', size: 255, required: false },
      { key: 'content', type: 'string', size: 5000, required: true },
      { key: 'template', type: 'string', size: 100, required: false },
      { key: 'status', type: 'enum', elements: ['pending', 'sent', 'delivered', 'failed', 'bounced'], required: true },
      { key: 'sentAt', type: 'datetime', required: false },
      { key: 'deliveredAt', type: 'datetime', required: false },
      { key: 'errorMessage', type: 'string', size: 1000, required: false },
      { key: 'retryCount', type: 'integer', required: true },
      { key: 'maxRetries', type: 'integer', required: true },
      { key: 'externalId', type: 'string', size: 255, required: false }
    ],
    indexes: [
      { key: 'userId', type: 'key', attributes: ['userId'] },
      { key: 'bookingId', type: 'key', attributes: ['bookingId'] },
      { key: 'status', type: 'key', attributes: ['status'] },
      { key: 'type', type: 'key', attributes: ['type'] },
      { key: 'method', type: 'key', attributes: ['method'] }
    ]
  },
  {
    id: 'global_settings',
    name: 'Global Settings',
    attributes: [
      { key: 'depositPercentage', type: 'integer', required: true },
      { key: 'balancePercentage', type: 'integer', required: true },
      { key: 'balanceDueDays', type: 'integer', required: true },
      { key: 'currency', type: 'string', size: 10, required: true },
      { key: 'maxPaymentRetries', type: 'integer', required: true },
      { key: 'retryIntervalHours', type: 'integer', required: true },
      { key: 'sendBookingConfirmation', type: 'boolean', required: true },
      { key: 'sendPaymentReminders', type: 'boolean', required: true },
      { key: 'reminderDaysBefore', type: 'string', size: 100, required: true },
      { key: 'adminEmail', type: 'email', required: true },
      { key: 'adminAlertOnFailedPayment', type: 'boolean', required: true },
      { key: 'updatedBy', type: 'string', size: 255, required: false }
    ],
    indexes: []
  }
];

// Helper functions
async function createAttribute(collectionId, attribute) {
  try {
    let result;
    
    switch (attribute.type) {
      case 'string':
        result = await databases.createStringAttribute(
          DATABASE_ID,
          collectionId,
          attribute.key,
          attribute.size,
          attribute.required,
          attribute.default
        );
        break;
        
      case 'email':
        result = await databases.createEmailAttribute(
          DATABASE_ID,
          collectionId,
          attribute.key,
          attribute.required,
          attribute.default
        );
        break;
        
      case 'enum':
        result = await databases.createEnumAttribute(
          DATABASE_ID,
          collectionId,
          attribute.key,
          attribute.elements,
          attribute.required,
          attribute.default
        );
        break;
        
      case 'boolean':
        result = await databases.createBooleanAttribute(
          DATABASE_ID,
          collectionId,
          attribute.key,
          attribute.required
        );
        break;
        
      case 'integer':
        result = await databases.createIntegerAttribute(
          DATABASE_ID,
          collectionId,
          attribute.key,
          attribute.required
        );
        break;
        
      case 'double':
        result = await databases.createFloatAttribute(
          DATABASE_ID,
          collectionId,
          attribute.key,
          attribute.required
        );
        break;
        
      case 'datetime':
        result = await databases.createDatetimeAttribute(
          DATABASE_ID,
          collectionId,
          attribute.key,
          attribute.required,
          attribute.default
        );
        break;
        
      default:
        throw new Error(`Unknown attribute type: ${attribute.type}`);
    }
    
    console.log(`✅ Created attribute: ${attribute.key} (${attribute.type})`);
    return result;
  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠️  Attribute ${attribute.key} already exists`);
    } else {
      console.error(`❌ Failed to create attribute ${attribute.key}:`, error.message);
      throw error;
    }
  }
}

async function createIndex(collectionId, index) {
  try {
    const result = await databases.createIndex(
      DATABASE_ID,
      collectionId,
      index.key,
      index.type,
      index.attributes
    );
    console.log(`✅ Created index: ${index.key} (${index.type})`);
    return result;
  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠️  Index ${index.key} already exists`);
    } else {
      console.error(`❌ Failed to create index ${index.key}:`, error.message);
      throw error;
    }
  }
}

async function setupCollection(collection) {
  console.log(`\n🚀 Setting up collection: ${collection.name}`);
  
  try {
    // Create collection
    await databases.createCollection(
      DATABASE_ID,
      collection.id,
      collection.name,
      [
        Permission.create(Role.users()),
        Permission.read(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );
    console.log(`✅ Created collection: ${collection.name}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠️  Collection ${collection.name} already exists`);
    } else {
      console.error(`❌ Failed to create collection ${collection.name}:`, error.message);
      throw error;
    }
  }
  
  // Wait a bit for collection to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create attributes
  for (const attribute of collection.attributes) {
    await createAttribute(collection.id, attribute);
    // Wait between attribute creation
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Wait for attributes to be ready before creating indexes
  console.log('⏳ Waiting for attributes to be ready...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Create indexes
  for (const index of collection.indexes) {
    await createIndex(collection.id, index);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`✅ Collection ${collection.name} setup complete!`);
}

async function createDefaultGlobalSettings() {
  try {
    console.log('\n🔧 Creating default global settings...');
    
    const defaultSettings = {
      depositPercentage: 30,
      balancePercentage: 70,
      balanceDueDays: 7,
      currency: 'EUR',
      maxPaymentRetries: 3,
      retryIntervalHours: 24,
      sendBookingConfirmation: true,
      sendPaymentReminders: true,
      reminderDaysBefore: '3,1',
      adminEmail: 'admin@memora.com', // You should update this
      adminAlertOnFailedPayment: true,
      updatedBy: 'system'
    };
    
    await databases.createDocument(
      DATABASE_ID,
      'global_settings',
      ID.unique(),
      defaultSettings
    );
    
    console.log('✅ Default global settings created!');
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  Global settings already exist');
    } else {
      console.error('❌ Failed to create global settings:', error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting Memora booking collections setup...\n');
  
  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ APPWRITE_API_KEY is required in .env.local');
    console.log('📝 Please add your Appwrite API key to .env.local:');
    console.log('   APPWRITE_API_KEY=your_api_key_here');
    process.exit(1);
  }
  
  try {
    // Setup all collections
    for (const collection of collections) {
      await setupCollection(collection);
    }
    
    // Create default global settings
    await createDefaultGlobalSettings();
    
    console.log('\n🎉 All collections setup complete!');
    console.log('\n📋 Created collections:');
    collections.forEach(col => {
      console.log(`   ✅ ${col.name} (${col.id})`);
    });
    
    console.log('\n🔧 Next steps:');
    console.log('   1. Update adminEmail in global_settings collection');
    console.log('   2. Verify collections in your Appwrite console');
    console.log('   3. Continue with the implementation!');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
