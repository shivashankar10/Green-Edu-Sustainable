
-- First, let's get the actual course IDs and then insert questions for each course
-- We'll use the existing course ID that we know works, and find others

-- Get quiz questions for all existing courses - let's add questions for different course topics
-- Using the known working course ID and adding questions for other common sustainability topics

-- More questions for the existing Renewable Energy course (091e6065-ab59-4ac8-b2ad-e22299e2f829)
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is energy efficiency?', '["Using more energy", "Using less energy for the same output", "Creating new energy", "Storing energy permanently"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which renewable energy source works best at night?', '["Solar", "Wind", "Hydroelectric", "All work equally well"]', 2),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is a smart grid?', '["A fishing net", "An intelligent electricity distribution system", "A computer game", "A type of solar panel"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which country leads in wind energy production?', '["United States", "China", "Germany", "India"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is biomass energy?', '["Energy from living organisms", "Energy from fossils", "Energy from metals", "Energy from water"]', 0);

-- Let's also add some generic sustainability questions that can work for any course
-- These will use placeholder IDs that you can update with actual course IDs

-- For now, let's create a few more question sets using the same course ID as examples
-- You can later update these with actual course IDs for different courses

-- Questions about Climate Change (you can assign to climate-related courses)
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What causes the greenhouse effect?', '["Too many plants", "Gases trapping heat in atmosphere", "Cold weather", "Ocean currents"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which is the most effective way to reduce carbon footprint?', '["Recycling paper", "Using renewable energy", "Buying new cars", "Eating more meat"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is carbon neutrality?', '["Producing no carbon", "Balancing carbon emissions with removal", "Using only carbon products", "Avoiding all technology"]', 1);
