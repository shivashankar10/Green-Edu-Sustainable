import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SampleCertificate from "@/components/SampleCertificate";

interface CompletedCourse {
  id: string;
  title: string;
  lessons: number;
  duration: string;
  score: number;
  completed: boolean;
  certificate_code?: string;
}

const CompletedCoursesSection = () => {
  const { user } = useAuth();
  const [completedCourses, setCompletedCourses] = useState<CompletedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCompletedCourses();
    } else {
      setCompletedCourses([]);
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchCompletedCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("course_enrollments")
      .select(
        `
        completed,
        course_id,
        courses (
          id,
          title,
          lessons,
          duration
        ),
        certificate_verifications (
          certificate_code,
          score
        )
      `
      )
      .eq("user_id", user?.id)
      .eq("completed", true);

    if (error) {
      setCompletedCourses([]);
      setLoading(false);
      return;
    }

    // Defensive: Only include enrollments with a certificate and passing score (>=80)
    const result = (data || [])
      .filter(
        (enrollment: any) =>
          enrollment.completed === true &&
          enrollment.certificate_verifications &&
          typeof enrollment.certificate_verifications.score === "number" &&
          enrollment.certificate_verifications.score >= 80
      )
      .map((enrollment: any) => ({
        id: enrollment.courses?.id || "",
        title: enrollment.courses?.title || "Untitled",
        lessons: Number(enrollment.courses?.lessons ?? 0), // Ensure lessons is a number
        duration: enrollment.courses?.duration ?? "",
        score: enrollment.certificate_verifications?.score ?? 0,
        completed: enrollment.completed,
        certificate_code: enrollment.certificate_verifications?.certificate_code,
      }));

    setCompletedCourses(result);
    setLoading(false);
  };

  if (!user) return null;

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle>Courses Completed ({completedCourses.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading completed courses...</div>
        ) : completedCourses.length === 0 ? (
          <div className="text-gray-500 text-center py-6">
            You haven't completed any courses yet.
          </div>
        ) : (
          <div className="space-y-10">
            {completedCourses.map((course) => (
              <div key={course.id} className="border rounded-md shadow-sm p-4 bg-green-50">
                <h3 className="text-lg font-semibold text-green-900 mb-2">{course.title}</h3>
                <SampleCertificate
                  courseTitle={course.title}
                  lessons={Number(course.lessons)}
                  hours={Number(course.duration)}
                  score={course.score}
                  completed={course.completed}
                  certificateCode={course.certificate_code}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompletedCoursesSection;
