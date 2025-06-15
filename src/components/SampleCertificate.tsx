
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { QrCode } from 'lucide-react';

interface SampleCertificateProps {
  courseTitle: string;
  lessons: number;
  hours: number;
  score: number;
  completed: boolean;
  certificateCode?: string;
}

const SampleCertificate = ({ 
  courseTitle, 
  lessons, 
  hours, 
  score, 
  completed, 
  certificateCode 
}: SampleCertificateProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();

  // Get user name from profile first, then fallback to auth metadata or email
  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';

  if (!completed || score < 80) {
    return null;
  }

  // Generate verification URL for QR code
  const verificationUrl = certificateCode ? 
    `${window.location.origin}/verify-certificate?code=${certificateCode}` : 
    `${window.location.origin}/verify-certificate`;

  return (
    <div className="relative bg-white border-2 border-green-600 p-8 max-w-4xl mx-auto overflow-hidden">
      {/* Watermark background */}
      <div
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
        style={{
          zIndex: 0,
          opacity: 0.10,
          userSelect: "none",
        }}
      >
        <span
          style={{
            transform: "rotate(-25deg)",
            fontSize: "3rem",
            fontWeight: 900,
            color: "#22c55e", // Tailwind green-500
            letterSpacing: "0.15em",
            whiteSpace: "nowrap",
            textShadow: "0 2px 12px white"
          }}
        >
          GreenEdu Platform
        </span>
      </div>

      <div className="relative z-10 text-center space-y-6">
        {/* Header */}
        <div className="border-b-2 border-green-600 pb-4">
          <h1 className="text-4xl font-bold text-green-700 mb-2">Certificate of Completion</h1>
          <p className="text-lg text-gray-600">Sustainable Learning Platform</p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <p className="text-lg text-gray-700">This is to certify that</p>
          
          <div className="border-b-2 border-gray-300 pb-2 mx-auto max-w-md">
            <h2 className="text-3xl font-bold text-black" data-user-name>{userName}</h2>
          </div>

          <p className="text-lg text-gray-700">has successfully completed the course</p>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-2xl font-bold text-green-800 mb-2">{courseTitle}</h3>
            <div className="text-gray-600 space-y-1">
              <p>Course Duration: {hours} hours</p>
              <p>Number of Lessons: {lessons}</p>
              <p>Final Score: {score}%</p>
            </div>
          </div>

          <p className="text-lg text-gray-700">with a passing grade, demonstrating knowledge and understanding of sustainable practices.</p>
        </div>

        {/* Footer with QR Code */}
        <div className="flex justify-between items-end pt-8 border-t border-gray-300">
          <div className="text-left">
            <p className="text-sm text-gray-500">Date of Completion</p>
            <p className="font-semibold">{new Date().toLocaleDateString()}</p>
          </div>
          
          {certificateCode && (
            <div className="text-center space-y-2">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-2 border-gray-400 flex items-center justify-center bg-gray-50">
                  <QrCode className="w-12 h-12 text-gray-600" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Scan to Verify</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Certificate ID</p>
                <p className="font-mono text-sm">{certificateCode}</p>
              </div>
            </div>
          )}
          
          <div className="text-right">
            <div className="border-b border-gray-400 w-32 mb-1"></div>
            <p className="text-sm text-gray-600">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleCertificate;
