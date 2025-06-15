
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  college_name: string;
  college_mailid: string;
  gender: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      setLoading(true);
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) {
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const saveProfile = async (profileData: Omit<Profile, 'id'>) => {
    if (!user) return;
    setLoading(true);
    // Upsert the profile
    const { data, error } = await supabase
      .from('profiles')
      .upsert([{ id: user.id, ...profileData, email: user.email }], { onConflict: 'id' })
      .select()
      .single();
    if (data) setProfile(data);
    setLoading(false);
    return { data, error };
  };

  return { profile, setProfile, saveProfile, loading };
};
