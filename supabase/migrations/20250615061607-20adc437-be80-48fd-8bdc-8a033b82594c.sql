
-- Insert sample quiz questions for courses
-- Note: You'll need to replace the course IDs with actual IDs from your courses table

-- Sample questions for a Renewable Energy course (replace with actual course ID)
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
-- Replace 'your-course-id-here' with actual course IDs from your courses table
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is the most abundant renewable energy source?', '["Solar energy", "Wind energy", "Hydroelectric energy", "Geothermal energy"]', 0),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which of the following is NOT a fossil fuel?', '["Coal", "Natural gas", "Uranium", "Oil"]', 2),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What percentage of global electricity generation comes from renewable sources approximately?', '["10%", "25%", "30%", "50%"]', 2),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which country is the largest producer of solar energy?', '["Germany", "United States", "China", "Japan"]', 2),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is the main component of a photovoltaic cell?', '["Silicon", "Carbon", "Aluminum", "Copper"]', 0),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which renewable energy source is most dependent on geographic location?', '["Solar", "Wind", "Geothermal", "Biomass"]', 2),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is the typical lifespan of a wind turbine?', '["10-15 years", "20-25 years", "30-35 years", "40-45 years"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which of the following is a disadvantage of hydroelectric power?', '["High operating costs", "Environmental impact on aquatic ecosystems", "Low efficiency", "Weather dependency"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What does LCOE stand for in renewable energy?', '["Low Cost of Energy", "Levelized Cost of Energy", "Local Cost of Electricity", "Limited Cost of Equipment"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which technology is used to store excess renewable energy?', '["Capacitors", "Batteries", "Transformers", "Resistors"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is the main greenhouse gas reduced by using renewable energy?', '["Methane", "Carbon dioxide", "Nitrous oxide", "Sulfur dioxide"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which renewable energy source has the highest capacity factor?', '["Solar", "Wind onshore", "Wind offshore", "Geothermal"]', 3);

-- You can add more questions for other courses by replacing the course_id
-- For example, if you have a course about "Sustainable Agriculture":
-- INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
-- ('another-course-id', 'What is organic farming?', '["Farming without chemicals", "Farming with robots", "Indoor farming", "Underwater farming"]', 0);
