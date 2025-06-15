
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Calendar, Trophy, BookOpen, Clock } from 'lucide-react';
import { useCertificateVerification } from '@/hooks/useCertificateVerification';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

const CertificateVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [certificateCode, setCertificateCode] = useState(searchParams.get('code') || '');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const { verifyCertificate, loading } = useCertificateVerification();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setCertificateCode(code);
      handleVerification(code);
    }
  }, [searchParams]);

  const handleVerification = async (code?: string) => {
    const codeToVerify = code || certificateCode;
    if (!codeToVerify.trim()) return;

    const result = await verifyCertificate(codeToVerify);
    setVerificationResult(result);
    setIsVerified(!!result);

    if (result) {
      // Fetch user profile for the certificate holder
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', result.user_id)
        .single();
      setUserProfile(profile);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-green-700 mb-2">
              Certificate Verification
            </CardTitle>
            <p className="text-gray-600">
              Enter or scan a certificate code to verify its authenticity
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="Enter certificate code (e.g., CERT-123456-ABC123)"
                value={certificateCode}
                onChange={(e) => setCertificateCode(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={() => handleVerification()}
                disabled={loading || !certificateCode.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>

            {isVerified === false && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-700 mb-2">Invalid Certificate</h3>
                    <p className="text-red-600">
                      The certificate code you entered is not valid or does not exist in our system.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {isVerified === true && verificationResult && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="py-6">
                  <div className="text-center mb-6">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-700 mb-2">Valid Certificate</h3>
                    <p className="text-green-600">This certificate is authentic and verified.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Student:</span>
                        <span className="text-gray-900">
                          {userProfile?.full_name || 'Name not available'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">Course:</span>
                        <span className="text-gray-900">{verificationResult.courses?.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">Score:</span>
                        <span className="text-gray-900">{verificationResult.score}%</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">Duration:</span>
                        <span className="text-gray-900">{verificationResult.courses?.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">Lessons:</span>
                        <span className="text-gray-900">{verificationResult.courses?.lessons}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-700">Issued:</span>
                        <span className="text-gray-900">
                          {new Date(verificationResult.issued_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm text-gray-600 text-center">
                      Certificate Code: <span className="font-mono">{verificationResult.certificate_code}</span>
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      Verified {verificationResult.verified_count || 1} time(s) • 
                      Last verified: {verificationResult.last_verified_at ? 
                        new Date(verificationResult.last_verified_at).toLocaleString() : 'Just now'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CertificateVerificationPage;
