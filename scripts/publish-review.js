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

async function publishReview() {
  try {
    console.log('Publishing the existing review...');

    // Get the review ID from the API response we saw
    const reviewId = '68f240ff0031063992ad';

    // Update the review to be published
    const updatedReview = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      reviewId,
      {
        published: true
      }
    );

    console.log('✓ Review published successfully!');
    console.log('Review ID:', updatedReview.$id);
    console.log('Published:', updatedReview.published);

  } catch (error) {
    console.error('Error publishing review:', error);
  }
}

publishReview();
