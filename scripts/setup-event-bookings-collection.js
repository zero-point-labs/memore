const { Client, Databases, ID, Permission, Role } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

async function createEventBookingsCollection() {
  try {
    console.log('Creating event_bookings collection...');

    // Create the collection
    const collection = await databases.createCollection(
      DATABASE_ID,
      'event_bookings',
      'Event Bookings',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    console.log('Event bookings collection created:', collection.$id);

    // Create attributes for the event bookings collection
    const attributes = [
      // References
      { key: 'eventId', type: 'string', size: 255, required: true },
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'userProfileId', type: 'string', size: 255, required: true },
      
      // Booking details
      { key: 'ticketType', type: 'enum', elements: ['general', 'vip'], required: true },
      { key: 'quantity', type: 'integer', required: true },
      { key: 'totalPrice', type: 'double', required: true },
      { key: 'currency', type: 'string', size: 10, required: true },
      { key: 'bookingStatus', type: 'enum', elements: ['confirmed', 'cancelled'], required: true },
      { key: 'specialRequests', type: 'string', size: 1000, required: false },
      { key: 'bookingReference', type: 'string', size: 50, required: true },
    ];

    // Create each attribute
    for (const attr of attributes) {
      try {
        await databases.createStringAttribute(
          DATABASE_ID,
          collection.$id,
          attr.key,
          attr.size,
          attr.required,
          attr.default,
          attr.array
        );
        console.log(`✓ Created string attribute: ${attr.key}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠ String attribute already exists: ${attr.key}`);
        } else {
          console.error(`✗ Error creating string attribute ${attr.key}:`, error.message);
        }
      }
    }

    // Create integer attributes
    const integerAttributes = [
      { key: 'quantity', required: true }
    ];

    for (const attr of integerAttributes) {
      try {
        await databases.createIntegerAttribute(
          DATABASE_ID,
          collection.$id,
          attr.key,
          attr.required,
          attr.min,
          attr.max,
          attr.default,
          attr.array
        );
        console.log(`✓ Created integer attribute: ${attr.key}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠ Integer attribute already exists: ${attr.key}`);
        } else {
          console.error(`✗ Error creating integer attribute ${attr.key}:`, error.message);
        }
      }
    }

    // Create double attributes
    const doubleAttributes = [
      { key: 'totalPrice', required: true }
    ];

    for (const attr of doubleAttributes) {
      try {
        await databases.createFloatAttribute(
          DATABASE_ID,
          collection.$id,
          attr.key,
          attr.required,
          attr.min,
          attr.max,
          attr.default,
          attr.array
        );
        console.log(`✓ Created double attribute: ${attr.key}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠ Double attribute already exists: ${attr.key}`);
        } else {
          console.error(`✗ Error creating double attribute ${attr.key}:`, error.message);
        }
      }
    }

    // Create enum attributes
    const enumAttributes = [
      { key: 'ticketType', elements: ['general', 'vip'], required: true },
      { key: 'bookingStatus', elements: ['confirmed', 'cancelled'], required: true }
    ];

    for (const attr of enumAttributes) {
      try {
        await databases.createEnumAttribute(
          DATABASE_ID,
          collection.$id,
          attr.key,
          attr.elements,
          attr.required,
          attr.default,
          attr.array
        );
        console.log(`✓ Created enum attribute: ${attr.key}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠ Enum attribute already exists: ${attr.key}`);
        } else {
          console.error(`✗ Error creating enum attribute ${attr.key}:`, error.message);
        }
      }
    }

    // Create indexes for better query performance
    const indexes = [
      { key: 'eventId', type: 'key', attributes: ['eventId'] },
      { key: 'userId', type: 'key', attributes: ['userId'] },
      { key: 'bookingStatus', type: 'key', attributes: ['bookingStatus'] },
      { key: 'bookingReference', type: 'unique', attributes: ['bookingReference'] },
      { key: 'createdAt', type: 'key', attributes: ['$createdAt'] }
    ];

    for (const index of indexes) {
      try {
        await databases.createIndex(
          DATABASE_ID,
          collection.$id,
          index.key,
          index.type,
          index.attributes
        );
        console.log(`✓ Created index: ${index.key}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠ Index already exists: ${index.key}`);
        } else {
          console.error(`✗ Error creating index ${index.key}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Event bookings collection setup completed successfully!');
    console.log(`Collection ID: ${collection.$id}`);

  } catch (error) {
    console.error('Error setting up event bookings collection:', error);
    throw error;
  }
}

// Run the setup
if (require.main === module) {
  createEventBookingsCollection()
    .then(() => {
      console.log('Setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createEventBookingsCollection };
