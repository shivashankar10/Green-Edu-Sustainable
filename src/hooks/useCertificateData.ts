
import { useState, useEffect } from 'react';
import { useCertificateVerification } from '@/hooks/useCertificateVerification';

export const useCertificateData = (courseId: string, score: number, completed: boolean) => {
  const [certificateData, setCertificateData] = useState<any>(null);
  const { generateCertificateCode } = useCertificateVerification();

  useEffect(() => {
    // Only generate certificate if score is 80% or higher
    if (completed && score >= 80 && !certificateData) {
      generateCertificate();
    }
  }, [completed, score, courseId]);

  const generateCertificate = async () => {
    const certData = await generateCertificateCode(courseId, score);
    if (certData) {
      setCertificateData(certData);
    }
  };

  return { certificateData };
};
