
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useCertificateVerification = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const generateCertificateCode = async (courseId: string, score: number) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      // Generate a unique certificate code
      const certificateCode = `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Insert certificate verification record
      const { data, error } = await supabase
        .from('certificate_verifications')
        .insert([{
          user_id: user.id,
          course_id: courseId,
          certificate_code: certificateCode,
          score: score
        }])
        .select()
        .single();

      if (error) throw error;
      
      setLoading(false);
      return data;
    } catch (error) {
      console.error('Error generating certificate code:', error);
      setLoading(false);
      return null;
    }
  };

  const verifyCertificate = async (certificateCode: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificate_verifications')
        .select(`
          *,
          courses(title, duration, lessons)
        `)
        .eq('certificate_code', certificateCode)
        .single();

      if (error) throw error;

      // Update verification count
      await supabase
        .from('certificate_verifications')
        .update({ 
          verified_count: (data.verified_count || 0) + 1,
          last_verified_at: new Date().toISOString()
        })
        .eq('certificate_code', certificateCode);

      setLoading(false);
      return data;
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setLoading(false);
      return null;
    }
  };

  return {
    generateCertificateCode,
    verifyCertificate,
    loading
  };
};
