/**
 * Profile Page
 * User profile management page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AvatarUpload from '../components/profile/AvatarUpload';
import ProfileForm from '../components/profile/ProfileForm';
import { userApi } from '../api/client';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
  try {
    const response = await userApi.getProfile();
    const data = response.data.data;
    if (!data) {
      console.error('Profile data is null');
      setProfile(null);
    } else {
      setProfile(data);
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
    setProfile(null);
  } finally {
    setLoading(false);
  }
};

  const handleAvatarUpload = async (file: File) => {
    const result = await userApi.uploadAvatar(file);
    if (result.success && result.avatarUrl) {
      setProfile({ ...profile, profilePicture: result.avatarUrl });
    } else {
      throw new Error(result.message);
    }
  };

  const handleAvatarRemove = async () => {
    const result = await userApi.removeAvatar();
    if (result.success) {
      setProfile({ ...profile, profilePicture: null });
    } else {
      throw new Error(result.message);
    }
  };

  const handleProfileSave = async (data: any) => {
    const result = await userApi.updateProfile(data);
    if (result.success) {
      setProfile({ ...profile, ...data });
    } else {
      throw new Error(result.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary-600 mb-4">Failed to load profile</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Diary</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Avatar */}
            <div className="md:w-1/3 flex flex-col items-center">
              <AvatarUpload
                currentAvatar={profile.profilePicture}
                onUpload={handleAvatarUpload}
                onRemove={handleAvatarRemove}
              />
            </div>

            {/* Right: Form */}
            <div className="md:w-2/3">
              <ProfileForm
                initialData={{
                  name: profile.name,
                  username: profile.username,
                  bio: profile.bio,
                }}
                onSave={handleProfileSave}
              />
            </div>
          </div>
        </div>

        {/* Account Info Card (Optional) */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Account Information
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-secondary-500">Email</span>
              <p className="text-secondary-900">{profile.email}</p>
            </div>
            <div>
              <span className="text-sm text-secondary-500">Member since</span>
              <p className="text-secondary-900">
                {new Date(profile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
