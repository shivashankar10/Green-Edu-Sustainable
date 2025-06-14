
-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  lessons INTEGER DEFAULT 0,
  students INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
  category TEXT,
  image_url TEXT,
  video_url TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create course enrollments table
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES public.courses NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  UNIQUE(user_id, course_id)
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  read BOOLEAN DEFAULT false
);

-- Create user roles table for admin functionality
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = is_admin.user_id AND role = 'admin'
  );
$$;

-- RLS Policies for courses (public read, admin write)
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);

CREATE POLICY "Only admins can insert courses" ON public.courses 
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Only admins can update courses" ON public.courses 
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Only admins can delete courses" ON public.courses 
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- RLS Policies for enrollments
CREATE POLICY "Users can view their own enrollments" ON public.course_enrollments 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own enrollments" ON public.course_enrollments 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own enrollments" ON public.course_enrollments 
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for contact messages
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view contact messages" ON public.contact_messages 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- RLS Policies for user roles
CREATE POLICY "Users can view their own role" ON public.user_roles 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert roles" ON public.user_roles 
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Only admins can update roles" ON public.user_roles 
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Only admins can delete roles" ON public.user_roles 
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Insert sample courses
INSERT INTO public.courses (title, description, duration, lessons, students, rating, level, category, video_url, is_featured) VALUES
('Renewable Energy Fundamentals', 'Explore solar, wind, hydro, and other renewable energy sources shaping our sustainable future.', '4 hours', 12, 1234, 4.8, 'Beginner', 'Energy', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true),
('Sustainable Agriculture Practices', 'Learn modern farming techniques that protect the environment while ensuring food security.', '6 hours', 18, 890, 4.9, 'Intermediate', 'Agriculture', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true),
('Climate Change Mitigation', 'Understand climate science and discover practical solutions to reduce global warming.', '5 hours', 15, 2156, 4.7, 'All Levels', 'Climate', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true),
('Waste Management & Recycling', 'Master the principles of waste reduction, recycling, and circular economy practices.', '3 hours', 10, 756, 4.6, 'Beginner', 'Waste', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', false),
('Water Conservation Strategies', 'Discover innovative methods to conserve and manage water resources effectively.', '4 hours', 14, 1089, 4.8, 'Intermediate', 'Water', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', false),
('Green Building & Architecture', 'Learn sustainable construction practices and eco-friendly building design principles.', '7 hours', 20, 634, 4.9, 'Advanced', 'Construction', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true);
