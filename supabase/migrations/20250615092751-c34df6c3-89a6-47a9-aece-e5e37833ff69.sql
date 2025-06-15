
-- Add quiz questions for Sustainable Agriculture Practices
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
((SELECT id FROM courses WHERE title LIKE '%Sustainable Agriculture%' LIMIT 1), 'What is the primary goal of sustainable agriculture?', '["Maximizing profits", "Balancing productivity with environmental protection", "Using only organic methods", "Eliminating all pesticides"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Sustainable Agriculture%' LIMIT 1), 'Which practice helps improve soil health in sustainable farming?', '["Monoculture", "Crop rotation", "Heavy tillage", "Excessive irrigation"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Sustainable Agriculture%' LIMIT 1), 'What is integrated pest management (IPM)?', '["Using only chemical pesticides", "Combining multiple pest control strategies", "Eliminating all insects", "Using only biological controls"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Sustainable Agriculture%' LIMIT 1), 'Which cover crop is known for nitrogen fixation?', '["Wheat", "Corn", "Legumes", "Rice"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Sustainable Agriculture%' LIMIT 1), 'What is permaculture?', '["Permanent agriculture design system", "Chemical farming method", "Genetic modification technique", "Industrial farming practice"]', 0),
((SELECT id FROM courses WHERE title LIKE '%Sustainable Agriculture%' LIMIT 1), 'Which irrigation method conserves the most water?', '["Flood irrigation", "Sprinkler irrigation", "Drip irrigation", "Furrow irrigation"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Sustainable Agriculture%' LIMIT 1), 'What is composting in agriculture?', '["Burning organic waste", "Recycling organic matter into fertilizer", "Using synthetic fertilizers", "Removing all organic matter"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Sustainable Agriculture%' LIMIT 1), 'Which farming practice reduces soil erosion?', '["Continuous tilling", "Contour farming", "Removing vegetation", "Steep slope farming"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Sustainable Agriculture%' LIMIT 1), 'What is agroforestry?', '["Removing all trees from farms", "Integrating trees with crops", "Only growing trees", "Industrial farming"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Sustainable Agriculture%' LIMIT 1), 'Which is a benefit of biodiversity in farming?', '["Increased pest problems", "Natural pest control", "Reduced crop yields", "Higher chemical use"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Sustainable Agriculture%' LIMIT 1), 'What does organic certification ensure?', '["Higher profits", "No synthetic chemicals used", "Faster growth", "Lower costs"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Sustainable Agriculture%' LIMIT 1), 'Which practice helps maintain soil moisture?', '["Excessive tilling", "Mulching", "Removing organic matter", "Deep plowing"]', 1);

-- Add quiz questions for Climate Change Mitigation
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
((SELECT id FROM courses WHERE title LIKE '%Climate Change%' LIMIT 1), 'What is the main greenhouse gas responsible for climate change?', '["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Climate Change%' LIMIT 1), 'Which sector produces the most global greenhouse gas emissions?', '["Agriculture", "Transportation", "Energy production", "Industry"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Climate Change%' LIMIT 1), 'What is carbon sequestration?', '["Releasing carbon into atmosphere", "Capturing and storing carbon", "Burning fossil fuels", "Deforestation"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Climate Change%' LIMIT 1), 'Which renewable energy source is most widely used globally?', '["Solar", "Wind", "Hydroelectric", "Geothermal"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Climate Change%' LIMIT 1), 'What is the Paris Agreement target for global temperature rise?', '["1.5°C above pre-industrial levels", "2.5°C above pre-industrial levels", "3°C above pre-industrial levels", "No specific target"]', 0),
((SELECT id FROM courses WHERE title LIKE '%Climate Change%' LIMIT 1), 'Which practice reduces methane emissions from agriculture?', '["Increasing livestock", "Improved livestock management", "More rice cultivation", "Burning crop residues"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Climate Change%' LIMIT 1), 'What is climate adaptation?', '["Preventing climate change", "Adjusting to climate change effects", "Ignoring climate change", "Accelerating climate change"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Climate Change%' LIMIT 1), 'Which technology helps reduce carbon emissions?', '["Coal power plants", "Carbon capture and storage", "Diesel engines", "Deforestation"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Climate Change%' LIMIT 1), 'What is the role of forests in climate change?', '["They increase CO2", "They absorb CO2", "They have no effect", "They release methane"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Climate Change%' LIMIT 1), 'Which transportation mode has the lowest carbon footprint?', '["Air travel", "Car", "Public transit", "Motorcycle"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Climate Change%' LIMIT 1), 'What is a carbon tax?', '["Tax on carbon products", "Fee on carbon emissions", "Reward for carbon use", "Carbon trading system"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Climate Change%' LIMIT 1), 'Which building feature reduces energy consumption?', '["Large windows facing any direction", "Proper insulation", "No ventilation", "Dark roofs in hot climates"]', 1);

-- Add quiz questions for Green Building & Architecture
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
((SELECT id FROM courses WHERE title LIKE '%Green Building%' LIMIT 1), 'What does LEED certification measure?', '["Building cost", "Environmental performance", "Construction speed", "Aesthetic appeal"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Green Building%' LIMIT 1), 'Which material is considered most sustainable for construction?', '["Steel", "Concrete", "Bamboo", "Plastic"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Green Building%' LIMIT 1), 'What is passive solar design?', '["Using solar panels", "Building orientation for natural heating/cooling", "Electric solar systems", "Solar water heating"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Green Building%' LIMIT 1), 'Which roofing system provides insulation and manages stormwater?', '["Metal roof", "Green roof", "Asphalt shingles", "Clay tiles"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Green Building%' LIMIT 1), 'What is the purpose of building orientation in green design?', '["Aesthetic reasons", "Maximizing natural light and ventilation", "Easier construction", "Lower land costs"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Green Building%' LIMIT 1), 'Which insulation type is most environmentally friendly?', '["Fiberglass", "Foam", "Cellulose from recycled paper", "Plastic foam"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Green Building%' LIMIT 1), 'What is greywater recycling?', '["Treating blackwater", "Reusing water from sinks and showers", "Collecting rainwater", "Purifying drinking water"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Green Building%' LIMIT 1), 'Which window type is most energy efficient?', '["Single pane", "Double pane", "Triple pane low-E", "No windows"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Green Building%' LIMIT 1), 'What is daylighting in green building?', '["Artificial lighting", "Using natural light effectively", "Outdoor lighting", "Emergency lighting"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Green Building%' LIMIT 1), 'Which HVAC feature improves energy efficiency?', '["Constant operation", "Programmable thermostats", "Maximum cooling", "No ventilation"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Green Building%' LIMIT 1), 'What is thermal mass in building design?', '["Weight of building", "Materials that store and release heat", "Insulation thickness", "Structural support"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Green Building%' LIMIT 1), 'Which landscaping practice conserves water?', '["Lawn irrigation", "Xeriscaping", "Exotic plants", "Frequent watering"]', 1);

-- Add quiz questions for Waste Management & Recycling
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
((SELECT id FROM courses WHERE title LIKE '%Waste Management%' LIMIT 1), 'What are the 3 Rs of waste management?', '["Read, Write, Recycle", "Reduce, Reuse, Recycle", "Remove, Replace, Recycle", "Refuse, Reduce, Reuse"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Waste Management%' LIMIT 1), 'Which material takes the longest to decompose in landfills?', '["Paper", "Food waste", "Glass", "Organic matter"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Waste Management%' LIMIT 1), 'What is e-waste?', '["Electronic waste", "Edible waste", "Energy waste", "Environmental waste"]', 0),
((SELECT id FROM courses WHERE title LIKE '%Waste Management%' LIMIT 1), 'Which recycling process uses the least energy?', '["Aluminum recycling", "Plastic recycling", "Paper recycling", "Glass recycling"]', 0),
((SELECT id FROM courses WHERE title LIKE '%Waste Management%' LIMIT 1), 'What is composting?', '["Burning organic waste", "Decomposing organic matter naturally", "Burying waste", "Plastic recycling"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Waste Management%' LIMIT 1), 'Which plastic recycling code indicates the easiest to recycle?', '["1 (PET)", "3 (PVC)", "6 (PS)", "7 (Other)"]', 0),
((SELECT id FROM courses WHERE title LIKE '%Waste Management%' LIMIT 1), 'What is the circular economy concept?', '["Linear production", "Continuous waste generation", "Eliminate waste through design", "Increased consumption"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Waste Management%' LIMIT 1), 'Which waste management method produces energy?', '["Landfilling", "Waste-to-energy incineration", "Open dumping", "Ocean dumping"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Waste Management%' LIMIT 1), 'What is source reduction in waste management?', '["Reducing waste at origin", "Sorting waste", "Transporting waste", "Burning waste"]', 0),
((SELECT id FROM courses WHERE title LIKE '%Waste Management%' LIMIT 1), 'Which method is best for organic waste?', '["Incineration", "Composting", "Landfilling", "Ocean disposal"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Waste Management%' LIMIT 1), 'What percentage of municipal waste is typically recyclable?', '["10-20%", "30-40%", "50-70%", "80-90%"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Waste Management%' LIMIT 1), 'Which practice reduces packaging waste?', '["Using more packaging", "Bulk purchasing", "Individual packaging", "Disposable containers"]', 1);

-- Add quiz questions for Water Conservation Strategies
INSERT INTO quiz_questions (course_id, question, options, correct_answer) VALUES
((SELECT id FROM courses WHERE title LIKE '%Water Conservation%' LIMIT 1), 'What percentage of Earth''s water is fresh water?', '["3%", "10%", "25%", "50%"]', 0),
((SELECT id FROM courses WHERE title LIKE '%Water Conservation%' LIMIT 1), 'Which irrigation method is most water-efficient?', '["Flood irrigation", "Sprinkler irrigation", "Drip irrigation", "Furrow irrigation"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Water Conservation%' LIMIT 1), 'What is greywater?', '["Polluted water", "Wastewater from sinks and showers", "Drinking water", "Ocean water"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Water Conservation%' LIMIT 1), 'How much water can a leaky faucet waste per day?', '["1 gallon", "10 gallons", "50 gallons", "100 gallons"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Water Conservation%' LIMIT 1), 'What is xeriscaping?', '["Water gardening", "Landscaping with drought-resistant plants", "Swimming pool design", "Irrigation system"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Water Conservation%' LIMIT 1), 'Which appliance uses the most water in homes?', '["Dishwasher", "Washing machine", "Toilet", "Shower"]', 2),
((SELECT id FROM courses WHERE title LIKE '%Water Conservation%' LIMIT 1), 'What is rainwater harvesting?', '["Collecting and storing rainwater", "Preventing rain", "Cloud seeding", "Weather modification"]', 0),
((SELECT id FROM courses WHERE title LIKE '%Water Conservation%' LIMIT 1), 'Which toilet feature saves the most water?', '["Larger tank", "Dual-flush system", "Automatic flush", "Decorative design"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Water Conservation%' LIMIT 1), 'What is water footprint?', '["Size of water containers", "Total water used for products/activities", "Water quality measurement", "Water temperature"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Water Conservation%' LIMIT 1), 'Which crop requires the most water to produce?', '["Wheat", "Rice", "Corn", "Soybeans"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Water Conservation%' LIMIT 1), 'What is desalination?', '["Adding salt to water", "Removing salt from seawater", "Water purification", "Water storage"]', 1),
((SELECT id FROM courses WHERE title LIKE '%Water Conservation%' LIMIT 1), 'Which practice reduces water pollution?', '["Using more fertilizers", "Proper waste disposal", "Increasing runoff", "Industrial discharge"]', 1);
