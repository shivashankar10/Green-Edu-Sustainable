
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Users, BookOpen, MessageSquare, Shield } from 'lucide-react';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    duration: '',
    lessons: 0,
    level: 'Beginner',
    category: '',
    video_url: '',
    is_featured: false
  });

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (data?.role === 'admin') {
        setIsAdmin(true);
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive"
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch contact messages
      const { data: messagesData } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch enrollments with course info
      const { data: enrollmentsData } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses(title)
        `)
        .order('enrolled_at', { ascending: false });

      setCourses(coursesData || []);
      setMessages(messagesData || []);
      setEnrollments(enrollmentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('courses')
        .insert(courseForm);

      if (error) throw error;

      toast({
        title: "Course created successfully!",
        description: "The new course has been added to the platform."
      });

      setShowCourseForm(false);
      setCourseForm({
        title: '',
        description: '',
        duration: '',
        lessons: 0,
        level: 'Beginner',
        category: '',
        video_url: '',
        is_featured: false
      });
      fetchData();
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('courses')
        .update(courseForm)
        .eq('id', editingCourse.id);

      if (error) throw error;

      toast({
        title: "Course updated successfully!",
        description: "The course has been updated."
      });

      setEditingCourse(null);
      setShowCourseForm(false);
      fetchData();
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: "Failed to update course.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Course deleted successfully!",
        description: "The course has been removed from the platform."
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course.",
        variant: "destructive"
      });
    }
  };

  const startEditCourse = (course: any) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description || '',
      duration: course.duration || '',
      lessons: course.lessons || 0,
      level: course.level || 'Beginner',
      category: course.category || '',
      video_url: course.video_url || '',
      is_featured: course.is_featured || false
    });
    setShowCourseForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 pb-16 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-gray-600">Manage your GreenEdu platform</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="h-4 w-4 mr-1" />
              Admin Access
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{enrollments.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{messages.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Featured Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.filter(c => c.is_featured).length}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Course Management</h2>
                <Button onClick={() => setShowCourseForm(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </div>

              {showCourseForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={courseForm.title}
                            onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={courseForm.category}
                            onChange={(e) => setCourseForm({...courseForm, category: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={courseForm.description}
                          onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            value={courseForm.duration}
                            onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                            placeholder="e.g., 4 hours"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lessons">Lessons</Label>
                          <Input
                            id="lessons"
                            type="number"
                            value={courseForm.lessons}
                            onChange={(e) => setCourseForm({...courseForm, lessons: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="level">Level</Label>
                          <Select value={courseForm.level} onValueChange={(value) => setCourseForm({...courseForm, level: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                              <SelectItem value="All Levels">All Levels</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="video_url">Video URL</Label>
                        <Input
                          id="video_url"
                          value={courseForm.video_url}
                          onChange={(e) => setCourseForm({...courseForm, video_url: e.target.value})}
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_featured"
                          checked={courseForm.is_featured}
                          onChange={(e) => setCourseForm({...courseForm, is_featured: e.target.checked})}
                          className="rounded"
                        />
                        <Label htmlFor="is_featured">Featured Course</Label>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                          {editingCourse ? 'Update Course' : 'Create Course'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => {
                          setShowCourseForm(false);
                          setEditingCourse(null);
                        }}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {courses.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          {course.is_featured && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{course.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{course.category}</span>
                          <span>{course.level}</span>
                          <span>{course.duration}</span>
                          <span>{course.lessons} lessons</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => startEditCourse(course)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteCourse(course.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="enrollments" className="space-y-6">
              <h2 className="text-2xl font-bold">Course Enrollments</h2>
              <div className="grid gap-4">
                {enrollments.map((enrollment) => (
                  <Card key={enrollment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{enrollment.courses?.title}</h3>
                          <p className="text-gray-600">Progress: {enrollment.progress}%</p>
                          <p className="text-sm text-gray-500">
                            Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {enrollment.completed ? (
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          ) : (
                            <Badge variant="secondary">In Progress</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <h2 className="text-2xl font-bold">Contact Messages</h2>
              <div className="grid gap-4">
                {messages.map((message) => (
                  <Card key={message.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{message.name}</h3>
                            <span className="text-gray-600">({message.email})</span>
                            {!message.read && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                New
                              </Badge>
                            )}
                          </div>
                          {message.subject && (
                            <p className="font-medium text-gray-800 mb-2">{message.subject}</p>
                          )}
                          <p className="text-gray-600 mb-2">{message.message}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(message.created_at).toLocaleDateString()} at{' '}
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
