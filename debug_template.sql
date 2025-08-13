-- Debug script to check template field status
-- Run this in your database to see what's happening with the template field

-- Check if the template column exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'template';

-- Check current template values for all profiles
SELECT username, template, 
       CASE 
         WHEN template IS NULL THEN 'NULL'
         WHEN template = '' THEN 'EMPTY STRING'
         ELSE template
       END as template_status
FROM profiles
ORDER BY username;

-- Check if there are any profiles with eclipse template
SELECT username, template 
FROM profiles 
WHERE template = 'eclipse';

-- Update a specific profile to test (replace 'your_username' with actual username)
-- UPDATE profiles SET template = 'eclipse' WHERE username = 'your_username';

-- Check the updated profile
-- SELECT username, template FROM profiles WHERE username = 'your_username';
