
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Play, Clock, Users, Award, Star, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
    if (user) {
      checkEnrollment();
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('course_id', id)
        .eq('user_id', user?.id)
        .single();

      if (data) setEnrollment(data);
    } catch (error) {
      // User not enrolled, which is fine
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: id,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Enrolled successfully!",
        description: "You can now access this course content."
      });

      checkEnrollment();
    } catch (error) {
      console.error('Error enrolling:', error);
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive"
      });
    }
  };

  const handleWatchVideo = () => {
    if (course?.video_url) {
      window.open(course.video_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 pb-16 flex items-center justify-center">
          <div>Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 pb-16 flex items-center justify-center">
          <div>Course not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {course.rating}
                    </div>
                  </div>
                  <CardTitle className="text-3xl mb-4">{course.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Play className="h-4 w-4 mr-1" />
                      {course.lessons} lessons
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students?.toLocaleString() || 0} students
                    </div>
                  </div>

                  {enrollment ? (
                    <div className="space-y-4">
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Enrolled
                      </div>
                      <Button onClick={handleWatchVideo} className="w-full bg-green-600 hover:bg-green-700">
                        <Play className="h-4 w-4 mr-2" />
                        Watch Video
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleEnroll} className="w-full bg-green-600 hover:bg-green-700">
                      <Award className="h-4 w-4 mr-2" />
                      Enroll Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <strong>Category:</strong> {course.category}
                  </div>
                  <div>
                    <strong>Duration:</strong> {course.duration}
                  </div>
                  <div>
                    <strong>Lessons:</strong> {course.lessons}
                  </div>
                  <div>
                    <strong>Students:</strong> {course.students?.toLocaleString() || 0}
                  </div>
                  <div>
                    <strong>Rating:</strong> {course.rating}/5
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursePage;
