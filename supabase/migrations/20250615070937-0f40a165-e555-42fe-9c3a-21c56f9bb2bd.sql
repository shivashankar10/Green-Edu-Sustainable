
-- Get actual course IDs first and create questions for different sustainability topics
-- Let me fix the escaping issue and use proper course IDs

-- First, let's get actual course IDs from the existing courses
-- For now, I'll create a comprehensive set using the known working course ID
-- and you can later update the course_id values to match your actual courses

-- Questions for Introduction to Sustainable Living
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is the main goal of sustainable living?', '["To save money", "To meet present needs without compromising future generations", "To live in rural areas", "To avoid technology"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which of the following is NOT a pillar of sustainability?', '["Environmental", "Economic", "Social", "Political"]', 3),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What does the term carbon footprint refer to?', '["The size of your shoes", "The amount of carbon dioxide emissions caused by activities", "A type of renewable energy", "A measurement of land use"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which practice helps reduce water consumption?', '["Taking longer showers", "Fixing leaky faucets", "Running dishwasher half-full", "Watering plants at noon"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is composting?', '["Burning organic waste", "Decomposing organic matter into fertilizer", "Recycling plastic", "Storing food"]', 1);

-- Questions for Climate Change Awareness
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is the main cause of current climate change?', '["Natural cycles", "Human activities", "Solar flares", "Volcanic eruptions"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which gas contributes most to global warming?', '["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"]', 2),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is the Paris Agreement?', '["A trade deal", "An international climate accord", "A peace treaty", "A tourism agreement"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which sector produces the most greenhouse gases globally?', '["Transportation", "Agriculture", "Energy production", "Manufacturing"]', 2),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What does climate adaptation mean?', '["Preventing climate change", "Adjusting to climate change effects", "Measuring temperature", "Creating new weather patterns"]', 1);

-- Questions for Waste Management
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What are the 3 Rs of waste management?', '["Read, Write, Remember", "Reduce, Reuse, Recycle", "Run, Rest, Repeat", "Research, Review, Report"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'How long does it take for plastic bottles to decompose?', '["1 year", "10 years", "100 years", "450+ years"]', 3),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which material can be recycled indefinitely without quality loss?', '["Paper", "Plastic", "Glass", "Rubber"]', 2),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is e-waste?', '["Electronic waste", "Energy waste", "Environmental waste", "Economic waste"]', 0),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which composting method is best for small spaces?', '["Open pile", "Vermicomposting", "Windrow composting", "Aerated static pile"]', 1);

-- Questions for Sustainable Agriculture
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is organic farming?', '["Farming without synthetic chemicals", "Farming with robots", "Indoor farming", "Underwater farming"]', 0),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which practice helps maintain soil health?', '["Monoculture", "Crop rotation", "Excessive tilling", "Chemical fertilizers only"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is permaculture?', '["Permanent agriculture design system", "Temporary farming", "Chemical agriculture", "Industrial farming"]', 0),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which is a natural pest control method?', '["DDT spraying", "Beneficial insects", "Burning crops", "Genetic modification only"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What does agricultural biodiversity mean?', '["Using one crop type", "Variety of plants and animals on farms", "Chemical diversity", "Machine diversity"]', 1);

-- Questions for Water Conservation (fixed escaping issue)
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What percentage of Earth water is freshwater?', '["50%", "25%", "10%", "About 3%"]', 3),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which irrigation method is most water-efficient?', '["Drip irrigation", "Flood irrigation", "Sprinkler systems", "Manual watering"]', 0),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is greywater?', '["Polluted industrial water", "Wastewater from sinks and showers", "Rainwater", "Drinking water"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'How much water can a leaky faucet waste per day?', '["1 gallon", "5 gallons", "10+ gallons", "No significant amount"]', 2),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What is xeriscaping?', '["Water-efficient landscaping", "Swimming pool design", "Irrigation system installation", "Water treatment process"]', 0);

-- Questions for Green Technology
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What defines green technology?', '["Technology painted green", "Environmentally friendly technology", "Agricultural technology only", "Military technology"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which is an example of green technology?', '["Coal power plant", "LED light bulbs", "Diesel engines", "Traditional incandescent bulbs"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'What does IoT stand for in green technology?', '["Internet of Things", "Institute of Technology", "International Operations Team", "Indoor Outdoor Technology"]', 0),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'How do smart grids help the environment?', '["They consume more energy", "They enable efficient energy distribution", "They only work with fossil fuels", "They replace all renewable energy"]', 1),
('091e6065-ab59-4ac8-b2ad-e22299e2f829', 'Which technology significantly reduces paper waste?', '["3D printing", "Digital documentation systems", "Mechanical printing", "Voice recording only"]', 1);
