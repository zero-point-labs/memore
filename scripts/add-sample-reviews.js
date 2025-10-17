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
const COLLECTION_ID = 'reviews';

// Sample reviews data
const sampleReviews = [
  {
    userId: 'sample-user-1',
    userProfileId: 'sample-profile-1',
    title: 'Emma Thompson',
    content: 'Rating: 5/5 stars\n\nAbsolutely insane 3 days! The beach parties were unreal and Lora helped us skip every queue. Already planning my next trip!',
    tripId: '6899b3000009d6d4eb48',
    published: true,
    featured: true
  },
  {
    userId: 'sample-user-2',
    userProfileId: 'sample-profile-2',
    title: 'Jake Wilson',
    content: 'Rating: 5/5 stars\n\nBest uni trip ever! The VIP treatment at every club, yacht parties, and cliff jumping - literally everything was perfect.',
    tripId: '6899b3000009d6d4eb48',
    published: true,
    featured: true
  },
  {
    userId: 'sample-user-3',
    userProfileId: 'sample-profile-3',
    title: 'Sophia Chen',
    content: 'Rating: 5/5 stars\n\nMet so many amazing people! The sunset boat party was magical. Lora made everything so easy - just had to show up and party!',
    tripId: '6899b3000009d6d4eb48',
    published: true,
    featured: true
  },
  {
    userId: 'sample-user-4',
    userProfileId: 'sample-profile-4',
    title: 'Alex Martinez',
    content: 'Rating: 5/5 stars\n\nCyprus with this crew hits different! Every moment was Instagram-worthy. The villa parties were next level 🔥',
    tripId: '6899b3000009d6d4eb48',
    published: true,
    featured: true
  },
  {
    userId: 'sample-user-5',
    userProfileId: 'sample-profile-5',
    title: 'Mia Anderson',
    content: 'Rating: 5/5 stars\n\nWorth every penny! VIP everywhere, no waiting, just pure vibes. The group chat before the trip got everyone hyped!',
    tripId: '6899b3000009d6d4eb48',
    published: true,
    featured: true
  },
  {
    userId: 'sample-user-6',
    userProfileId: 'sample-profile-6',
    title: 'Oliver Brown',
    content: 'Rating: 4/5 stars\n\nAmazing experience overall! The beach clubs were incredible and the nightlife was unmatched. Only wish we had more time!',
    tripId: '6899b3000009d6d4eb48',
    published: true,
    featured: false
  },
  {
    userId: 'sample-user-7',
    userProfileId: 'sample-profile-7',
    title: 'Isabella Garcia',
    content: 'Rating: 5/5 stars\n\nThe cliff jumping was absolutely terrifying but so worth it! The views were breathtaking and the adrenaline rush was insane.',
    tripId: '6899b3000009d6d4eb48',
    published: true,
    featured: true
  },
  {
    userId: 'sample-user-8',
    userProfileId: 'sample-profile-8',
    title: 'Lucas Johnson',
    content: 'Rating: 5/5 stars\n\nBest decision ever! Made friends for life and experienced Cyprus like never before. The yacht party was the highlight of my year!',
    tripId: '6899b3000009d6d4eb48',
    published: true,
    featured: false
  }
];

async function addSampleReviews() {
  try {
    console.log('Adding sample reviews to the database...');

    for (let i = 0; i < sampleReviews.length; i++) {
      const review = sampleReviews[i];
      
      try {
        const createdReview = await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          review
        );

        console.log(`✓ Created review ${i + 1}: ${review.title}`);
      } catch (error) {
        console.error(`✗ Error creating review ${i + 1}:`, error.message);
      }
    }

    console.log('\n🎉 Sample reviews added successfully!');
    console.log(`Added ${sampleReviews.length} sample reviews`);

  } catch (error) {
    console.error('Error adding sample reviews:', error);
  }
}

addSampleReviews();
