
-- First, check if the admin role already exists for this user
SELECT user_id, role 
FROM user_roles 
WHERE user_id = '6ad581b3-692a-4d2d-a949-77f7adbc9d1b' AND role = 'admin';

-- If no results from above, then insert the admin role
INSERT INTO user_roles (user_id, role)
SELECT '6ad581b3-692a-4d2d-a949-77f7adbc9d1b', 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = '6ad581b3-692a-4d2d-a949-77f7adbc9d1b' AND role = 'admin'
);

-- Finally, check your current profile and role status
SELECT 
  p.id, 
  p.email, 
  p.full_name,
  ur.role
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
WHERE p.email = 'tagorechowdary65@gmail.com';
