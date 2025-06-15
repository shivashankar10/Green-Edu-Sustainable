
-- Add a 'full_name' column to store the certificate holder's name at issuance
ALTER TABLE public.certificate_verifications
ADD COLUMN full_name TEXT;

-- (Optional but recommended) For new certificates, always require full_name to be set
-- If you want to prevent inserts with no name, uncomment the next line:
-- ALTER TABLE public.certificate_verifications
-- ALTER COLUMN full_name SET NOT NULL;
