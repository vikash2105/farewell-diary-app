/**
 * Profile Page
 * User profile management page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AvatarUpload from '../components/profile/AvatarUpload';
import ProfileForm from '../components/profile/ProfileForm';
import { userApi } from '../api';
import ThemeToggle from '../components/ThemeToggle';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
  try {
    const data = await userApi.getProfile();
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
      <div className="site-shell flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="site-shell flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">Failed to load profile</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="site-shell">
      <div className="border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-ghost px-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Diary</span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="sanctuary-card mb-8 p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex flex-col items-center">
              <AvatarUpload
                currentAvatar={profile.profilePicture}
                onUpload={handleAvatarUpload}
                onRemove={handleAvatarRemove}
              />
            </div>

            <div className="md:w-2/3">
              <h1 className="brand-script mb-6 text-5xl font-bold text-primary">Your Profile</h1>
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

        <div className="sanctuary-card p-8">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Account Information
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Email</span>
              <p className="text-foreground">{profile.email}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Member since</span>
              <p className="text-foreground">
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
