import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useCertificateVerification = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Defensive: validates certificate code string
  function isValidCertCode(code: string) {
    return /^CERT-\d{6,}-[A-Z0-9]{5,}$/.test(code.trim());
  }

  const generateCertificateCode = async (courseId: string, score: number) => {
    if (!user) return null;

    // Defensive: Only allow if valid user, course, score range (0-100)
    if (
      !courseId ||
      typeof courseId !== "string" ||
      typeof score !== "number" ||
      score < 0 ||
      score > 100
    ) {
      console.warn("Abnormal certificate code request", { courseId, score });
      return null;
    }

    setLoading(true);
    try {
      // Generate a unique certificate code
      const tsPart = Date.now().toString().slice(-6);
      const randPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const certificateCode = `CERT-${tsPart}-${randPart}`;

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
    // Defensive: validate code before sending to db
    if (!isValidCertCode(certificateCode)) {
      console.warn("Abnormal certificate code verification attempt", { certificateCode });
      setLoading(false);
      return null;
    }
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
