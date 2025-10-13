import { ID, Query, Models } from 'appwrite';
import { databases } from '@/lib/appwrite';
import { 
  UserProfile, 
  UserProfileDocument, 
  CreateUserProfileData, 
  UpdateUserProfileData 
} from '@/types/booking';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
const COLLECTION_ID = 'user_profiles';

export class UserProfileService {
  // Get user profile by user ID
  async getByUserId(userId: string): Promise<UserProfileDocument | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('userId', userId)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      return response.documents[0] as UserProfileDocument;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Get user profile by email
  async getByEmail(email: string): Promise<UserProfileDocument | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('email', email)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      return response.documents[0] as UserProfileDocument;
    } catch (error) {
      console.error('Error fetching user profile by email:', error);
      return null;
    }
  }

  // Get user profile by Stripe customer ID
  async getByStripeCustomerId(stripeCustomerId: string): Promise<UserProfileDocument | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('stripeCustomerId', stripeCustomerId)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      return response.documents[0] as UserProfileDocument;
    } catch (error) {
      console.error('Error fetching user profile by Stripe ID:', error);
      return null;
    }
  }

  // Create new user profile
  async create(data: CreateUserProfileData): Promise<UserProfileDocument> {
    try {
      const document = await databases.createDocument(
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
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async update(id: string, data: UpdateUserProfileData): Promise<UserProfileDocument> {
    try {
      const document = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        data
      );

      return document as UserProfileDocument;
    } catch (error) {
      console.error('Error updating user profile:', error);
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
      console.error('Error updating Stripe customer ID:', error);
      throw error;
    }
  }

  // Update communication preferences
  async updateCommunicationPreferences(
    userId: string, 
    preferences: {
      emailOptIn?: boolean;
      smsOptIn?: boolean;
      marketingOptIn?: boolean;
    }
  ): Promise<UserProfileDocument> {
    try {
      const profile = await this.getByUserId(userId);
      if (!profile) {
        throw new Error('User profile not found');
      }

      return await this.update(profile.$id, preferences);
    } catch (error) {
      console.error('Error updating communication preferences:', error);
      throw error;
    }
  }

  // Delete user profile
  async delete(id: string): Promise<void> {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  }

  // Check if user profile exists for user
  async exists(userId: string): Promise<boolean> {
    const profile = await this.getByUserId(userId);
    return profile !== null;
  }

  // Get or create user profile (useful for guest checkout conversion)
  async getOrCreate(userId: string, userData: Omit<CreateUserProfileData, 'userId'>): Promise<UserProfileDocument> {
    try {
      // Try to get existing profile
      let profile = await this.getByUserId(userId);
      
      if (!profile) {
        // Create new profile if it doesn't exist
        profile = await this.create({
          userId,
          ...userData
        });
      }

      return profile;
    } catch (error) {
      console.error('Error getting or creating user profile:', error);
      throw error;
    }
  }

  // Search user profiles (for admin)
  async search(query: string, limit: number = 20): Promise<UserProfileDocument[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.or([
            Query.search('firstName', query),
            Query.search('lastName', query),
            Query.search('email', query),
            Query.search('university', query)
          ]),
          Query.limit(limit)
        ]
      );

      return response.documents as UserProfileDocument[];
    } catch (error) {
      console.error('Error searching user profiles:', error);
      return [];
    }
  }

  // Get all user profiles (for admin, with pagination)
  async getAll(limit: number = 50, offset: number = 0): Promise<{
    profiles: UserProfileDocument[];
    total: number;
  }> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      );

      return {
        profiles: response.documents as UserProfileDocument[],
        total: response.total
      };
    } catch (error) {
      console.error('Error fetching all user profiles:', error);
      return { profiles: [], total: 0 };
    }
  }
}

// Export singleton instance
export const userProfileService = new UserProfileService();
