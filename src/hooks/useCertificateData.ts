
import { useState, useEffect } from 'react';
import { useCertificateVerification } from '@/hooks/useCertificateVerification';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

export const useCertificateData = (courseId: string, score: number, completed: boolean) => {
  const [certificateData, setCertificateData] = useState<any>(null);
  const { generateCertificateCode } = useCertificateVerification();
  const { user } = useAuth();
  const { profile } = useProfile();

  useEffect(() => {
    // Only generate certificate if score is 80% or higher
    if (completed && score >= 80 && !certificateData) {
      generateCertificate();
    }
    // eslint-disable-next-line
  }, [completed, score, courseId]);

  const generateCertificate = async () => {
    // Prefer full_name from profile, fallback to auth/user, as in above
    let fullNameToStore =
      profile?.full_name ||
      user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      'Student';

    const certData = await generateCertificateCode(courseId, score, { full_name: fullNameToStore });
    if (certData) {
      setCertificateData(certData);
    }
  };

  return { certificateData };
};
