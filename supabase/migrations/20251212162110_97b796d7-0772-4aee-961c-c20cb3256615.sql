-- First, delete any rows with NULL user_id (if any exist)
DELETE FROM quiz_attempts WHERE user_id IS NULL;

-- Then add NOT NULL constraint to user_id
ALTER TABLE quiz_attempts
ALTER COLUMN user_id SET NOT NULL;