import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Play, Clock, Users, Award, Star, CheckCircle, Video, HelpCircle, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuizComponent from '@/components/QuizComponent';
import EnrolledCoursesList from '@/components/EnrolledCoursesList';
import CertificateGenerator from '@/components/CertificateGenerator';

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [pendingQuizScore, setPendingQuizScore] = useState<number | null>(null);

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
      
      // Get video URL if it's stored locally
      if (data.video_file_path) {
        const { data: urlData } = supabase.storage
          .from('course-videos')
          .getPublicUrl(data.video_file_path);
        setVideoUrl(urlData.publicUrl);
      } else if (data.video_url) {
        setVideoUrl(data.video_url);
      }
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

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleQuizComplete = (score: number) => {
    setPendingQuizScore(score);
    // We'll dismiss (setShowQuiz(false)) only when user closes results in QuizComponent
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score}%. ${score >= 80 ? 'Congratulations!' : 'Try again to improve your score.'}`,
      variant: score >= 80 ? "default" : "destructive"
    });
    setShowQuiz(false); // Only now, after user closes quiz, do we hide it
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
          {/* Certificate at top middle */}
          <div className="flex justify-center mb-10">
            {/* Only show if enrolled, completed, and passed */}
            {enrollment && enrollment.completed && enrollment.score >= 80 && (
              <CertificateGenerator
                courseId={course.id}
                courseTitle={course.title}
                lessons={course.lessons}
                hours={course.duration}
                score={enrollment.score}
                completed={enrollment.completed}
              />
            )}
          </div>

          {/* Back Button */}
          <div className="mb-6">
            <Button 
              onClick={handleGoBack}
              variant="ghost" 
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="flex gap-6">
            {/* Enrolled Courses List - Top Left */}
            {user && (
              <div className="hidden lg:block flex-shrink-0">
                <EnrolledCoursesList />
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
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
                          
                          {/* Video Player */}
                          {videoUrl && (
                            <div className="mb-6">
                              <h3 className="text-lg font-semibold mb-4">Course Video</h3>
                              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                <video 
                                  controls 
                                  className="w-full h-full"
                                  src={videoUrl}
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-4">
                            {videoUrl && (
                              <Button className="bg-green-600 hover:bg-green-700 flex-1">
                                <Video className="h-4 w-4 mr-2" />
                                Video Available
                              </Button>
                            )}
                            <Button 
                              onClick={() => setShowQuiz(true)} 
                              variant="outline" 
                              className="border-green-600 text-green-600 hover:bg-green-50 flex-1"
                            >
                              <HelpCircle className="h-4 w-4 mr-2" />
                              Take Quiz
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button onClick={handleEnroll} className="w-full bg-green-600 hover:bg-green-700">
                          <Award className="h-4 w-4 mr-2" />
                          Enroll Now
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quiz Component */}
                  {showQuiz && enrollment && (
                    <QuizComponent 
                      courseId={id!}
                      quiz={null}
                      onComplete={handleQuizComplete}
                    />
                  )}
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
                      {course.video_file_path && (
                        <div className="flex items-center text-blue-600">
                          <Video className="h-4 w-4 mr-1" />
                          <span className="text-sm">Local video available</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Enrolled Courses */}
          {user && (
            <div className="lg:hidden mt-8">
              <EnrolledCoursesList />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursePage;
