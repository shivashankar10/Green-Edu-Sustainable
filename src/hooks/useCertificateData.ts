
import { useState, useEffect } from 'react';
import { useCertificateVerification } from '@/hooks/useCertificateVerification';

export const useCertificateData = (courseId: string, score: number, completed: boolean) => {
  const [certificateData, setCertificateData] = useState<any>(null);
  const { generateCertificateCode } = useCertificateVerification();

  useEffect(() => {
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
