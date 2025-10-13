import { ID, Query } from 'node-appwrite';
import { serverDatabases } from '@/lib/appwrite-server';
import { 
  UserProfile, 
  UserProfileDocument, 
  CreateUserProfileData, 
  UpdateUserProfileData 
} from '@/types/booking';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'user_profiles';

export class ServerUserProfileService {
  // Get user profile by user ID
  async getByUserId(userId: string): Promise<UserProfileDocument | null> {
    try {
      const response = await serverDatabases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('userId', userId)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      return response.documents[0] as UserProfileDocument;
    } catch (error) {
      console.error('Error fetching user profile (server):', error);
      return null;
    }
  }

  // Get user profile by email
  async getByEmail(email: string): Promise<UserProfileDocument | null> {
    try {
      const response = await serverDatabases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('email', email)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      return response.documents[0] as UserProfileDocument;
    } catch (error) {
      console.error('Error fetching user profile by email (server):', error);
      return null;
    }
  }

  // Get user profile by Stripe customer ID
  async getByStripeCustomerId(stripeCustomerId: string): Promise<UserProfileDocument | null> {
    try {
      const response = await serverDatabases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('stripeCustomerId', stripeCustomerId)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      return response.documents[0] as UserProfileDocument;
    } catch (error) {
      console.error('Error fetching user profile by Stripe ID (server):', error);
      return null;
    }
  }

  // Create new user profile
  async create(data: CreateUserProfileData): Promise<UserProfileDocument> {
    try {
      const document = await serverDatabases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          ...data,
          // Set default values for required boolean fields
          emailOptIn: data.emailOptIn ?? true,
          smsOptIn: data.smsOptIn ?? true,
          marketingOptIn: data.marketingOptIn ?? false,
        }
      );

      return document as UserProfileDocument;
    } catch (error) {
      console.error('Error creating user profile (server):', error);
      throw error;
    }
  }

  // Update user profile
  async update(id: string, data: UpdateUserProfileData): Promise<UserProfileDocument> {
    try {
      const document = await serverDatabases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        data
      );

      return document as UserProfileDocument;
    } catch (error) {
      console.error('Error updating user profile (server):', error);
      throw error;
    }
  }

  // Update Stripe customer ID
  async updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<UserProfileDocument> {
    try {
      const profile = await this.getByUserId(userId);
      if (!profile) {
        throw new Error('User profile not found');
      }

      return await this.update(profile.$id, { stripeCustomerId });
    } catch (error) {
      console.error('Error updating Stripe customer ID (server):', error);
      throw error;
    }
  }
}

// Export singleton instance
export const serverUserProfileService = new ServerUserProfileService();
