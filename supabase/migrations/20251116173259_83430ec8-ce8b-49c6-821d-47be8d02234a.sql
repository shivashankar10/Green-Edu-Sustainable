-- Fix certificate verification privacy issue
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can verify certificates" ON public.certificate_verifications;

-- Create policies for authenticated users to manage their own certificates
CREATE POLICY "Users can view own certificates"
ON public.certificate_verifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own certificates"
ON public.certificate_verifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create a secure public function to verify certificates without exposing user_id
CREATE OR REPLACE FUNCTION public.verify_certificate_public(cert_code TEXT)
RETURNS TABLE (
  certificate_code TEXT,
  course_title TEXT,
  course_duration TEXT,
  course_lessons INTEGER,
  score INTEGER,
  issued_at TIMESTAMPTZ,
  full_name TEXT,
  verified_count INTEGER
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cv.certificate_code,
    c.title as course_title,
    c.duration as course_duration,
    c.lessons as course_lessons,
    cv.score,
    cv.issued_at,
    cv.full_name,
    cv.verified_count
  FROM certificate_verifications cv
  JOIN courses c ON c.id = cv.course_id
  WHERE cv.certificate_code = cert_code;
END;
$$;

-- Create a secure function to increment verification count
CREATE OR REPLACE FUNCTION public.increment_certificate_verification(cert_code TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE certificate_verifications
  SET 
    verified_count = COALESCE(verified_count, 0) + 1,
    last_verified_at = now()
  WHERE certificate_code = cert_code;
  
  RETURN FOUND;
END;
$$;