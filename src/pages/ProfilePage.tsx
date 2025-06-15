
import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, saveProfile, loading } = useProfile();
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || user?.email || '',
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
      email: profile?.email || user?.email || '',
      phone_number: profile?.phone_number || '',
      college_name: profile?.college_name || '',
      college_mailid: profile?.college_mailid || '',
      gender: profile?.gender || '',
    });
  }, [profile, user]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenderChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    const { error } = await saveProfile({
      full_name: form.full_name,
      email: form.email,
      phone_number: form.phone_number,
      college_name: form.college_name,
      college_mailid: form.college_mailid,
      gender: form.gender,
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
        
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-gray-700 font-medium">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Your full name"
            required
            className="bg-green-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your email address"
            required
            className="bg-green-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number" className="text-gray-700 font-medium">Phone Number</Label>
          <Input
            id="phone_number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="Phone number"
            className="bg-green-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="college_name" className="text-gray-700 font-medium">College Name</Label>
          <Input
            id="college_name"
            name="college_name"
            value={form.college_name}
            onChange={handleChange}
            placeholder="College name"
            className="bg-green-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="college_mailid" className="text-gray-700 font-medium">
            College Mail ID <span className="text-xs text-gray-400">(optional)</span>
          </Label>
          <Input
            id="college_mailid"
            name="college_mailid"
            type="email"
            value={form.college_mailid}
            onChange={handleChange}
            placeholder="Your college email"
            className="bg-green-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-gray-700 font-medium">Gender</Label>
          <Select value={form.gender} onValueChange={handleGenderChange}>
            <SelectTrigger className="bg-green-50">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={saving || loading}>
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
        
        {success && <div className="text-green-700 font-medium text-center">Profile updated successfully!</div>}
      </form>
    </main>
  );
};

export default ProfilePage;
