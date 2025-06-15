import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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

  // Utility: Simple validators
  const isValidName = (name: string) => !!name && name.trim().length >= 2 && /^[a-zA-Z\s\.\-']+$/.test(name);
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => phone.trim() === "" || /^[0-9\-\+\(\)\s]{8,17}$/.test(phone);

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
          <h2 className="text-xl font-bold mb-4 text-black">Profile</h2>
          <p className="text-black">Please log in to view your profile.</p>
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

    // Validate input
    if (!isValidName(form.full_name)) {
      setSaving(false);
      return toast({ title: "Invalid Name", description: "Please enter a valid full name (letters only).", variant: "destructive" });
    }
    if (!isValidEmail(form.email)) {
      setSaving(false);
      return toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
    }
    if (!isValidPhone(form.phone_number)) {
      setSaving(false);
      return toast({ title: "Invalid Phone Number", description: "Enter a valid phone (digits, spaces, -, (), +) or leave blank.", variant: "destructive" });
    }

    const { error } = await saveProfile({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone_number: form.phone_number.trim(),
      college_name: form.college_name.trim(),
      college_mailid: form.college_mailid?.trim() ?? "",
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
        <h2 className="text-2xl font-bold text-black mb-4 text-center">Edit Your Profile</h2>
        
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-black font-medium">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Your full name"
            required
            className="bg-green-50 text-black placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-black font-medium">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your email address"
            required
            className="bg-green-50 text-black placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number" className="text-black font-medium">Phone Number</Label>
          <Input
            id="phone_number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="Phone number"
            className="bg-green-50 text-black placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="college_name" className="text-black font-medium">College Name</Label>
          <Input
            id="college_name"
            name="college_name"
            value={form.college_name}
            onChange={handleChange}
            placeholder="College name"
            className="bg-green-50 text-black placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="college_mailid" className="text-black font-medium">
            College Mail ID <span className="text-xs text-gray-400">(optional)</span>
          </Label>
          <Input
            id="college_mailid"
            name="college_mailid"
            type="email"
            value={form.college_mailid}
            onChange={handleChange}
            placeholder="Your college email"
            className="bg-green-50 text-black placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-black font-medium">Gender</Label>
          <Select value={form.gender} onValueChange={handleGenderChange}>
            <SelectTrigger className="bg-green-50 text-black">
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
        
        {success && <div className="text-black font-medium text-center">Profile updated successfully!</div>}
      </form>
    </main>
  );
};

export default ProfilePage;
