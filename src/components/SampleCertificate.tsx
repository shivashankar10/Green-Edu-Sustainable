
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
    <div className="relative bg-white border-2 border-green-600 p-8 max-w-4xl mx-auto overflow-hidden">
      {/* Watermark grid background: "greenedu" text in every cell, brighter and more visible */}
      <div
        className="pointer-events-none select-none absolute inset-0"
        aria-hidden="true"
        style={{
          zIndex: 0,
          opacity: 1, // full so we control per-span
          userSelect: "none",
          backgroundImage: `repeating-linear-gradient(120deg, transparent 0 50px, rgba(34,197,94,0.06) 50px 60px), 
            repeating-linear-gradient(-120deg, transparent 0 50px, rgba(34,197,94,0.06) 50px 60px)`,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(7, 1fr)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {[...Array(7 * 6)].map((_, idx) => (
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
                  opacity: 0.29, // brighter and more visible
                  textTransform: "lowercase",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  textShadow: "0 1px 4px #fff, 0 1px 16px #b4f8d8",
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

        {/* Footer with QR Code and Signature */}
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

          <div className="text-right flex flex-col items-end">
            {/* Signature image */}
            <img
              src={SIGNATURE_URL}
              alt="Authorized Signature"
              className="h-16 w-auto object-contain mb-1"
              style={{
                maxWidth: 140,
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

