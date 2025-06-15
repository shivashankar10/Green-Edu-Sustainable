
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight } from 'lucide-react';

interface EnrolledCourse {
  id: string;
  title: string;
  level: string;
  progress: number;
}

const EnrolledCoursesList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          progress,
          courses (
            id,
            title,
            level
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      const courses: EnrolledCourse[] = (data || []).map(enrollment => ({
        id: enrollment.courses.id,
        title: enrollment.courses.title,
        level: enrollment.courses.level,
        progress: enrollment.progress || 0
      }));

      setEnrolledCourses(courses);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <BookOpen className="h-5 w-5 mr-2" />
            My Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <BookOpen className="h-5 w-5 mr-2" />
          My Courses ({enrolledCourses.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {enrolledCourses.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <p>No enrolled courses yet</p>
            <p className="text-sm">Browse courses to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">
                      {course.title}
                    </h4>
                    <Badge className={`${getLevelColor(course.level)} text-xs`}>
                      {course.level}
                    </Badge>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnrolledCoursesList;
