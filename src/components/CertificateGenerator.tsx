
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import SampleCertificate from './SampleCertificate';
import { useCertificateData } from '@/hooks/useCertificateData';
import { generateCertificateCanvas, downloadCanvasAsPNG } from '@/utils/certificateCanvas';

interface CertificateGeneratorProps {
  courseId: string;
  courseTitle: string;
  lessons: number;
  hours: number;
  score: number;
  completed: boolean;
}

const CertificateGenerator = ({ courseId, courseTitle, lessons, hours, score, completed }: CertificateGeneratorProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { certificateData } = useCertificateData(courseId, score, completed);

  const downloadCertificate = async () => {
    if (!certificateRef.current || !certificateData) return;

    try {
      // Get user name from the certificate component
      const nameElement = certificateRef.current.querySelector('[data-user-name]');
      const userName = nameElement?.textContent || 'Student';

      // Generate canvas
      const canvas = generateCertificateCanvas(
        certificateData,
        courseTitle,
        lessons,
        hours,
        score,
        userName
      );

      // Download the certificate
      const filename = `${courseTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_certificate.png`;
      downloadCanvasAsPNG(canvas, filename);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  if (!completed || score < 80) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <div ref={certificateRef}>
        <SampleCertificate 
          courseTitle={courseTitle}
          lessons={lessons}
          hours={hours}
          score={score}
          completed={completed}
          certificateCode={certificateData?.certificate_code}
        />
      </div>
      <div className="text-center space-y-2">
        <Button 
          onClick={downloadCertificate}
          className="bg-green-600 hover:bg-green-700"
          disabled={!certificateData}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Certificate
        </Button>
      </div>
    </div>
  );
};

export default CertificateGenerator;
