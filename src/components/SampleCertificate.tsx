
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { QrCode } from 'lucide-react';

// Change this to your own logo if available!
const LOGO_URL = "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=256&h=256&fit=crop";

// Signature image (user-uploaded)
const SIGNATURE_URL = "/lovable-uploads/85418616-5153-4340-a52a-9d8756b4b3c3.png";

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
    <div 
      className="relative bg-white border-2 border-green-600 p-8 overflow-hidden"
      style={{
        width: '297mm', // A4 landscape width
        height: '210mm', // A4 landscape height
        minWidth: '297mm',
        minHeight: '210mm',
      }}
    >
      {/* Watermark grid background: "greenedu" text in every cell, much lighter and less bright */}
      <div
        className="pointer-events-none select-none absolute inset-0"
        aria-hidden="true"
        style={{
          zIndex: 0,
          opacity: 1, // full so we control per-span
          userSelect: "none",
          backgroundImage: `repeating-linear-gradient(120deg, transparent 0 50px, rgba(34,197,94,0.02) 50px 60px), 
            repeating-linear-gradient(-120deg, transparent 0 50px, rgba(34,197,94,0.02) 50px 60px)`,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'repeat(5, 1fr)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {[...Array(8 * 5)].map((_, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              <span
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: "#22c55e",
                  letterSpacing: "0.075em",
                  opacity: 0.08, // much lighter - reduced from 0.29 to 0.08
                  textTransform: "lowercase",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  textShadow: "0 1px 2px rgba(255,255,255,0.3)", // much lighter shadow
                  pointerEvents: 'none',
                  fontFamily: 'inherit, sans-serif'
                }}
              >
                greenedu
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="border-b-2 border-green-600 pb-4 text-center">
          <h1 className="text-5xl font-bold text-green-700 mb-2">Certificate of Completion</h1>
          <p className="text-xl text-gray-600">Sustainable Learning Platform</p>
        </div>

        {/* Main Content - Flex layout for landscape */}
        <div className="flex-1 flex items-center justify-between py-8">
          {/* Left side - Certificate content */}
          <div className="flex-1 space-y-6 text-center">
            <p className="text-xl text-gray-700">This is to certify that</p>
            <div className="border-b-2 border-gray-300 pb-2 mx-auto max-w-md">
              <h2 className="text-4xl font-bold text-black" data-user-name>{userName}</h2>
            </div>
            <p className="text-xl text-gray-700">has successfully completed the course</p>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 mx-8">
              <h3 className="text-3xl font-bold text-green-800 mb-4">{courseTitle}</h3>
              <div className="text-gray-600 space-y-2 text-lg">
                <p>Course Duration: {hours} hours</p>
                <p>Number of Lessons: {lessons}</p>
                <p>Final Score: {score}%</p>
              </div>
            </div>
            <p className="text-xl text-gray-700 px-8">with a passing grade, demonstrating knowledge and understanding of sustainable practices.</p>
          </div>

          {/* Right side - QR Code and Certificate ID */}
          <div className="flex flex-col items-center space-y-6 px-8">
            {certificateCode && (
              <>
                {/* QR Code */}
                <div className="text-center space-y-2">
                  <div className="w-32 h-32 border-2 border-gray-400 flex items-center justify-center bg-gray-50">
                    <QrCode className="w-24 h-24 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-500">Scan to Verify</p>
                </div>
                
                {/* Certificate ID */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">Certificate ID</p>
                  <p className="font-mono text-lg font-semibold text-black bg-gray-100 px-4 py-2 rounded border">
                    {certificateCode}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end pt-6 border-t border-gray-300">
          <div className="text-left">
            <p className="text-sm text-gray-500">Date of Completion</p>
            <p className="font-semibold text-lg text-black">{new Date().toLocaleDateString()}</p>
          </div>

          <div className="text-right flex flex-col items-end">
            {/* Signature image */}
            <img
              src={SIGNATURE_URL}
              alt="Authorized Signature"
              className="h-24 w-auto object-contain mb-1"
              style={{
                maxWidth: 180,
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.05))"
              }}
              draggable={false}
            />
            <p className="text-sm text-gray-600">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleCertificate;
