
-- First, let's get the actual course IDs and redistribute the quiz questions
-- We'll update the existing questions to be assigned to different courses

-- Get the course IDs (this is for reference, the actual IDs will be used below)
-- UPDATE quiz questions for Renewable Energy Fundamentals (keep some existing ones)
-- Keep the first 5 questions for Renewable Energy
-- The course ID 091e6065-ab59-4ac8-b2ad-e22299e2f829 appears to be Renewable Energy

-- Update questions for Sustainable Agriculture Practices
UPDATE quiz_questions 
SET course_id = (SELECT id FROM courses WHERE title LIKE '%Sustainable Agriculture%' LIMIT 1)
WHERE question IN (
  'What is organic farming?',
  'Which practice helps maintain soil health?',
  'What is permaculture?',
  'Which is a natural pest control method?',
  'What does agricultural biodiversity mean?'
);

-- Update questions for Climate Change Mitigation  
UPDATE quiz_questions 
SET course_id = (SELECT id FROM courses WHERE title LIKE '%Climate Change%' LIMIT 1)
WHERE question IN (
  'What is the main cause of current climate change?',
  'Which gas contributes most to global warming?',
  'What is the Paris Agreement?',
  'Which sector produces the most greenhouse gases globally?',
  'What does climate adaptation mean?'
);

-- Update questions for Waste Management & Recycling
UPDATE quiz_questions 
SET course_id = (SELECT id FROM courses WHERE title LIKE '%Waste Management%' LIMIT 1)
WHERE question IN (
  'What are the 3 Rs of waste management?',
  'How long does it take for plastic bottles to decompose?',
  'Which material can be recycled indefinitely without quality loss?',
  'What is e-waste?',
  'Which composting method is best for small spaces?'
);

-- Update questions for Water Conservation Strategies
UPDATE quiz_questions 
SET course_id = (SELECT id FROM courses WHERE title LIKE '%Water Conservation%' LIMIT 1)
WHERE question IN (
  'What percentage of Earth water is freshwater?',
  'Which irrigation method is most water-efficient?',
  'What is greywater?',
  'How much water can a leaky faucet waste per day?',
  'What is xeriscaping?'
);

-- Update questions for Green Building & Architecture
UPDATE quiz_questions 
SET course_id = (SELECT id FROM courses WHERE title LIKE '%Green Building%' LIMIT 1)
WHERE question IN (
  'What defines green technology?',
  'Which is an example of green technology?',
  'What does IoT stand for in green technology?',
  'How do smart grids help the environment?',
  'Which technology significantly reduces paper waste?'
);

-- Add some specific questions for Renewable Energy Fundamentals
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
((SELECT id FROM courses WHERE title LIKE '%Renewable Energy%' LIMIT 1), 'What is the most abundant renewable energy source?', '["Wind", "Solar", "Hydroelectric", "Geothermal"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Renewable Energy%' LIMIT 1), 'Which renewable energy technology converts sunlight directly into electricity?', '["Solar thermal", "Photovoltaic cells", "Wind turbines", "Hydroelectric dams"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Renewable Energy%' LIMIT 1), 'What does the term "grid parity" mean in renewable energy?', '["Energy storage capacity", "Cost competitiveness with fossil fuels", "Maximum power output", "Environmental impact measurement"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Renewable Energy%' LIMIT 1), 'Which factor most affects wind turbine efficiency?', '["Height of installation", "Wind speed consistency", "Turbine color", "Number of blades"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Renewable Energy%' LIMIT 1), 'What is the main advantage of geothermal energy?', '["High initial cost", "Weather dependence", "Consistent power output", "Limited locations"]', 2);
