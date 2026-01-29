/**
 * ProfileForm Component
 * Form for editing user profile (name, username, bio)
 */

import { useState } from 'react';
import { Save } from 'lucide-react';

interface ProfileFormProps {
  initialData: {
    name: string;
    username?: string;
    bio?: string;
  };
  onSave: (data: { name: string; username?: string; bio?: string }) => Promise<void>;
}

export default function ProfileForm({ initialData, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    username: initialData.username || '',
    bio: initialData.bio || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasChanges =
    formData.name !== initialData.name ||
    formData.username !== (initialData.username || '') ||
    formData.bio !== (initialData.bio || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name
    if (!formData.name || formData.name.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    // Validate username if provided
    if (formData.username && formData.username.length > 0) {
      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters');
        return;
      }
      if (!/^[a-z0-9_]+$/i.test(formData.username)) {
        setError('Username can only contain letters, numbers, and underscores');
        return;
      }
    }

    // Validate bio
    if (formData.bio && formData.bio.length > 500) {
      setError('Bio must be less than 500 characters');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await onSave({
        name: formData.name,
        username: formData.username || undefined,
        bio: formData.bio || undefined,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-secondary-900 mb-2">
          My Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="
            w-full px-4 py-3 
            bg-white border-2 border-secondary-200 
            rounded-xl
            focus:border-primary-400 focus:ring-2 focus:ring-primary-200 
            transition-all
          "
          placeholder="Alex Rivers"
          required
          minLength={2}
          maxLength={255}
        />
      </div>

      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-secondary-900 mb-2">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
          className="
            w-full px-4 py-3 
            bg-white border-2 border-secondary-200 
            rounded-xl
            focus:border-primary-400 focus:ring-2 focus:ring-primary-200 
            transition-all
          "
          placeholder="alex_sketches"
          minLength={3}
          maxLength={50}
        />
        <p className="mt-1 text-xs text-secondary-500">
          Letters, numbers, and underscores only
        </p>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-secondary-900 mb-2">
          My Story
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          className="
            w-full px-4 py-3 
            bg-white border-2 border-secondary-200 
            rounded-xl
            focus:border-primary-400 focus:ring-2 focus:ring-primary-200 
            transition-all
            resize-none
          "
          placeholder="Memory collector, doodle enthusiast, and professional over-thinker. Saving all the good bits of life here."
          maxLength={500}
        />
        <div className="mt-1 flex justify-between text-xs text-secondary-500">
          <span>Tell us about yourself</span>
          <span>{formData.bio.length}/500</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          Profile updated successfully!
        </div>
      )}

      {/* Save Button */}
      <button
        type="submit"
        disabled={!hasChanges || saving}
        className="
          w-full py-3 px-6
          bg-primary-500 hover:bg-primary-600
          text-white font-medium
          rounded-xl
          flex items-center justify-center gap-2
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg hover:shadow-xl
        "
      >
        {saving ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </>
        )}
      </button>
    </form>
  );
}
