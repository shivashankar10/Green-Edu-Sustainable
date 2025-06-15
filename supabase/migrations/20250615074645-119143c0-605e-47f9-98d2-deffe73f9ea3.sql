
-- Create a table to store certificate verification data
CREATE TABLE public.certificate_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES public.courses NOT NULL,
  certificate_code TEXT UNIQUE NOT NULL,
  score INTEGER NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_count INTEGER DEFAULT 0,
  last_verified_at TIMESTAMP WITH TIME ZONE
);

-- Add Row Level Security
ALTER TABLE public.certificate_verifications ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to read certificate data for verification (public verification)
CREATE POLICY "Anyone can verify certificates" 
  ON public.certificate_verifications 
  FOR SELECT 
  USING (true);

-- Create policy that allows users to create their own certificates
CREATE POLICY "Users can create their own certificates" 
  ON public.certificate_verifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_certificate_verifications_code ON public.certificate_verifications(certificate_code);
