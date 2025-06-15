
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, QrCode } from 'lucide-react';
import SampleCertificate from './SampleCertificate';
import { useCertificateVerification } from '@/hooks/useCertificateVerification';

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
  const [certificateData, setCertificateData] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
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
      
      // Generate QR code URL using dynamic import
      try {
        const QRCode = await import('qrcode');
        const verificationUrl = `${window.location.origin}/verify-certificate?code=${certData.certificate_code}`;
        const qrDataUrl = await QRCode.default.toDataURL(verificationUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#16a34a',
            light: '#ffffff'
          }
        });
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current || !certificateData) return;

    try {
      // Create a canvas to convert the certificate to image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;

      // Fill background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add border
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Set text properties
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';

      // Title
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#16a34a';
      ctx.fillText('Certificate of Completion', canvas.width / 2, 100);

      // Subtitle
      ctx.font = '16px Arial';
      ctx.fillStyle = '#666666';
      ctx.fillText('This is to certify that', canvas.width / 2, 150);

      // Get user name from the certificate component
      const nameElement = certificateRef.current.querySelector('[data-user-name]');
      const userName = nameElement?.textContent || 'Student';

      // User name
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#16a34a';
      ctx.fillText(userName, canvas.width / 2, 200);

      // Course completion text
      ctx.font = '16px Arial';
      ctx.fillStyle = '#666666';
      ctx.fillText('has successfully completed', canvas.width / 2, 250);

      // Course title
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#000000';
      const maxWidth = 600;
      const words = courseTitle.split(' ');
      let line = '';
      let y = 300;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[n] + ' ';
          y += 30;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);

      // Course details
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666666';
      ctx.fillText(`${hours} hours • ${lessons} lessons`, canvas.width / 2, y + 50);

      // Score
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = '#16a34a';
      ctx.fillText(`Score: ${score}%`, canvas.width / 2, y + 90);

      // Date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      ctx.font = '14px Arial';
      ctx.fillStyle = '#666666';
      ctx.fillText(currentDate, canvas.width / 2, canvas.height - 120);

      // Certificate code
      ctx.font = '12px Arial';
      ctx.fillStyle = '#888888';
      ctx.fillText(`Certificate Code: ${certificateData.certificate_code}`, canvas.width / 2, canvas.height - 100);

      // Platform name
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#16a34a';
      ctx.fillText('GreenEdu Platform', canvas.width / 2, canvas.height - 80);

      // Add QR code if available
      if (qrCodeUrl) {
        const qrImage = new Image();
        qrImage.onload = () => {
          ctx.drawImage(qrImage, canvas.width - 140, canvas.height - 140, 100, 100);
          
          // Add QR code label
          ctx.font = '10px Arial';
          ctx.fillStyle = '#666666';
          ctx.textAlign = 'center';
          ctx.fillText('Scan to verify', canvas.width - 90, canvas.height - 25);
          
          // Convert canvas to blob and download
          canvas.toBlob((blob) => {
            if (!blob) return;
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${courseTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_certificate.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 'image/png');
        };
        qrImage.src = qrCodeUrl;
      } else {
        // Download without QR code
        canvas.toBlob((blob) => {
          if (!blob) return;
          
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${courseTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_certificate.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 'image/png');
      }
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
          qrCodeUrl={qrCodeUrl}
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
        {qrCodeUrl && (
          <p className="text-sm text-gray-600">
            <QrCode className="h-4 w-4 inline mr-1" />
            Scan the QR code to verify authenticity
          </p>
        )}
      </div>
    </div>
  );
};

export default CertificateGenerator;
