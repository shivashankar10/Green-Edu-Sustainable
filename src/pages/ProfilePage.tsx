
import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, saveProfile, loading } = useProfile();
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone_number: profile?.phone_number || '',
    college_name: profile?.college_name || '',
    college_mailid: profile?.college_mailid || '',
    gender: profile?.gender || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Update form when profile loaded
  React.useEffect(() => {
    setForm({
      full_name: profile?.full_name || '',
      phone_number: profile?.phone_number || '',
      college_name: profile?.college_name || '',
      college_mailid: profile?.college_mailid || '',
      gender: profile?.gender || '',
    });
  }, [profile]);

  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <p>Please log in to view your profile.</p>
          <Button onClick={() => navigate('/auth')} className="mt-4">
            Login
          </Button>
        </div>
      </main>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    const { error } = await saveProfile({
      full_name: form.full_name,
      phone_number: form.phone_number,
      college_name: form.college_name,
      college_mailid: form.college_mailid,
      gender: form.gender,
      email: user.email,
    });
    setSaving(false);
    if (!error) {
      setSuccess(true);
      navigate("/");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-green-50">
      <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Edit Your Profile</h2>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Full Name</label>
          <Input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Your full name"
            required
            className="bg-green-50"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <Input
            name="email"
            value={user.email}
            disabled
            className="bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
          <Input
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="Phone number"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">College Name</label>
          <Input
            name="college_name"
            value={form.college_name}
            onChange={handleChange}
            placeholder="College name"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">College Mail ID <span className="text-xs text-gray-400">(optional)</span></label>
          <Input
            name="college_mailid"
            value={form.college_mailid}
            onChange={handleChange}
            placeholder="Your college email"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="bg-green-50 border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={saving || loading}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
        {success && <div className="text-green-700 font-medium text-center">Profile updated!</div>}
      </form>
    </main>
  );
};

export default ProfilePage;
