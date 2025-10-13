import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userProfileService } from '@/services/userProfileService';
import { UserProfileDocument, CreateUserProfileData } from '@/types/booking';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user profile
  const loadProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userProfile = await userProfileService.getByUserId(user.$id);
      setProfile(userProfile);
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Create user profile
  const createProfile = async (profileData: Omit<CreateUserProfileData, 'userId' | 'email'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);
      
      const newProfile = await userProfileService.create({
        userId: user.$id,
        email: user.email,
        ...profileData
      });
      
      setProfile(newProfile);
      return newProfile;
    } catch (err) {
      console.error('Error creating user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to create profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<CreateUserProfileData>) => {
    if (!profile) {
      throw new Error('No profile to update');
    }

    try {
      setLoading(true);
      setError(null);
      
      const updatedProfile = await userProfileService.update(profile.$id, updates);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update communication preferences
  const updateCommunicationPreferences = async (preferences: {
    emailOptIn?: boolean;
    smsOptIn?: boolean;
    marketingOptIn?: boolean;
  }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);
      
      const updatedProfile = await userProfileService.updateCommunicationPreferences(
        user.$id, 
        preferences
      );
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error('Error updating communication preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if profile is complete
  const isProfileComplete = () => {
    if (!profile) return false;
    
    return !!(
      profile.firstName &&
      profile.lastName &&
      profile.phone &&
      profile.phoneCountryCode &&
      profile.studentStatus
    );
  };

  // Get profile completion percentage
  const getProfileCompletionPercentage = () => {
    if (!profile) return 0;
    
    const requiredFields = [
      'firstName',
      'lastName', 
      'phone',
      'phoneCountryCode',
      'studentStatus'
    ];
    
    const optionalFields = [
      'university',
      'stripeCustomerId'
    ];
    
    const completedRequired = requiredFields.filter(field => 
      profile[field as keyof UserProfileDocument]
    ).length;
    
    const completedOptional = optionalFields.filter(field => 
      profile[field as keyof UserProfileDocument]
    ).length;
    
    const totalFields = requiredFields.length + optionalFields.length;
    const completedFields = completedRequired + completedOptional;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  // Load profile when user changes
  useEffect(() => {
    loadProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    updateCommunicationPreferences,
    refreshProfile: loadProfile,
    isProfileComplete: isProfileComplete(),
    profileCompletionPercentage: getProfileCompletionPercentage()
  };
};
