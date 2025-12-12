
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
import { Plus, Edit, Trash2, Users, BookOpen, MessageSquare, Shield, Upload, Video } from 'lucide-react';

const AdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    duration: '',
    lessons: 0,
    level: 'Beginner',
    category: '',
    video_url: '',
    video_file_path: '',
    is_featured: false
  });
  const [quizCourse, setQuizCourse] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0
  });
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  useEffect(() => {
    console.log('AdminPage: useEffect triggered', { user, authLoading });
    
    if (authLoading) {
      console.log('AdminPage: Still loading auth...');
      return;
    }

    if (!user) {
      console.log('AdminPage: No user found, redirecting to auth');
      navigate('/auth');
      return;
    }

    console.log('AdminPage: User found, checking admin status for:', user.id);
    checkAdminStatus();
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchCourses();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (quizCourse) {
      fetchQuizQuestions();
    } else {
      setQuizQuestions([]);
    }
  }, [quizCourse]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      console.log('AdminPage: Checking admin status for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      console.log('AdminPage: User roles query result:', { data, error });

      if (error) {
        console.error('AdminPage: Error fetching user roles:', error);
        toast({
          title: "Error",
          description: "Failed to check admin status.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      const hasAdminRole = data?.some(role => role.role === 'admin');
      console.log('AdminPage: Has admin role:', hasAdminRole);

      if (hasAdminRole) {
        setIsAdmin(true);
        toast({
          title: "Welcome Admin",
          description: "You have successfully accessed the admin dashboard.",
        });
      } else {
        console.log('AdminPage: User does not have admin role, redirecting');
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive"
        });
        navigate('/');
      }
    } catch (error) {
      console.error('AdminPage: Exception in checkAdminStatus:', error);
      toast({
        title: "Error",
        description: "An error occurred while checking admin status.",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    setCourses(data || []);
  };

  // === COURSE MANAGEMENT ===

  const handleVideoUpload = async (file: File) => {
    if (!file) return null;
    setUploadingVideo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `courses/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      return filePath;
    } catch {
      toast({ title: "Error", description: "Failed to upload video file.", variant: "destructive" });
      return null;
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('courses').insert(courseForm);
    if (!error) {
      toast({ title: "Course created!" });
      setShowCourseForm(false);
      setCourseForm({ title: '', description: '', duration: '', lessons: 0, level: 'Beginner', category: '', video_url: '', video_file_path: '', is_featured: false });
      fetchCourses();
    } else {
      toast({ title: "Error", description: "Failed to create course.", variant: "destructive" });
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('courses').update(courseForm).eq('id', editingCourse.id);
    if (!error) {
      toast({ title: "Course updated!" });
      setEditingCourse(null);
      setShowCourseForm(false);
      fetchCourses();
    } else {
      toast({ title: "Error", description: "Failed to update course.", variant: "destructive" });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    const { error } = await supabase.from('courses').delete().eq('id', courseId);
    if (!error) {
      toast({ title: "Course deleted!" });
      fetchCourses();
    } else {
      toast({ title: "Error", description: "Failed to delete course.", variant: "destructive" });
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
      video_file_path: course.video_file_path || '',
      is_featured: course.is_featured || false
    });
    setShowCourseForm(true);
  };

  // === QUIZ MANAGEMENT ===

  const fetchQuizQuestions = async () => {
    if (!quizCourse) return setQuizQuestions([]);
    const { data } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('course_id', quizCourse)
      .order('created_at');
    setQuizQuestions(data || []);
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizCourse) {
      toast({ title: "Please select a course", variant: "destructive" });
      return;
    }
    const { error } = await supabase
      .from('quiz_questions')
      .insert({
        course_id: quizCourse,
        question: questionForm.question,
        options: questionForm.options.filter(x => x.trim() !== ''),
        correct_answer: questionForm.correct_answer
      });
    if (!error) {
      toast({ title: "Question created!" });
      resetQuestionForm();
      fetchQuizQuestions();
    } else {
      toast({ title: "Error", description: "Failed to create question.", variant: "destructive" });
    }
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    const { error } = await supabase
      .from('quiz_questions')
      .update({
        question: questionForm.question,
        options: questionForm.options.filter(x => x.trim() !== ''),
        correct_answer: questionForm.correct_answer
      }).eq('id', editingQuestion.id);
    if (!error) {
      toast({ title: "Question updated!" });
      resetQuestionForm();
      fetchQuizQuestions();
    } else {
      toast({ title: "Error", description: "Failed to update question.", variant: "destructive" });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz question?')) return;
    await supabase.from('quiz_questions').delete().eq('id', id);
    fetchQuizQuestions();
  };

  const startEditQuestion = (q: any) => {
    setEditingQuestion(q);
    setQuestionForm({
      question: q.question,
      options: [...q.options, '', '', '', ''].slice(0,4),
      correct_answer: q.correct_answer ?? 0
    });
    setShowQuestionForm(true);
  };

  const resetQuestionForm = () => {
    setQuestionForm({ question: '', options: ['', '', '', ''], correct_answer: 0 });
    setShowQuestionForm(false);
    setEditingQuestion(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 pb-16 flex items-center justify-center">
          <div className="text-lg">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have admin privileges to access this page.</p>
            <Button onClick={() => navigate('/')} className="bg-green-600 hover:bg-green-700">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="h-4 w-4 mr-1" />
              Admin Access
            </Badge>
          </div>
          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>
            {/* === COURSES === */}
            <TabsContent value="courses" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Course Management</h2>
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
                          <Input id="title" value={courseForm.title}
                            onChange={e => setCourseForm({...courseForm, title: e.target.value})}
                            required />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input id="category" value={courseForm.category}
                            onChange={e => setCourseForm({...courseForm, category: e.target.value})}
                            required />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={courseForm.description}
                          onChange={e => setCourseForm({...courseForm, description: e.target.value})}
                          rows={3} />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Input id="duration" value={courseForm.duration}
                            onChange={e => setCourseForm({...courseForm, duration: e.target.value})}
                            placeholder="e.g., 4 hours" />
                        </div>
                        <div>
                          <Label htmlFor="lessons">Lessons</Label>
                          <Input id="lessons" type="number" value={courseForm.lessons}
                            onChange={e => setCourseForm({...courseForm, lessons: parseInt(e.target.value) || 0})} />
                        </div>
                        <div>
                          <Label htmlFor="level">Level</Label>
                          <Select value={courseForm.level} onValueChange={value => setCourseForm({...courseForm, level: value})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
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
                        <Label htmlFor="video_file">Video File (Upload directly)</Label>
                        <Input id="video_file" type="file" accept="video/*" onChange={async e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const filePath = await handleVideoUpload(file);
                            if (filePath) {
                              setCourseForm({...courseForm, video_file_path: filePath, video_url: ''});
                            }
                          }
                        }} disabled={uploadingVideo} />
                        {uploadingVideo && <p className="text-sm text-gray-500 mt-1">Uploading video...</p>}
                        {courseForm.video_file_path && (
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-sm text-green-600">
                              <Video className="h-4 w-4 mr-1" />
                              Video file: {courseForm.video_file_path}
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setCourseForm({...courseForm, video_file_path: ''})}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="video_url">Or Video URL (YouTube, external link)</Label>
                        <Input id="video_url" value={courseForm.video_url}
                          onChange={e => setCourseForm({...courseForm, video_url: e.target.value, video_file_path: ''})}
                          placeholder="https://youtube.com/watch?v=..." />
                        <p className="text-xs text-gray-500 mt-1">
                          YouTube links will embed. Other links will show as clickable buttons.
                        </p>
                        {courseForm.video_url && (
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-sm text-blue-600">
                              <Video className="h-4 w-4 mr-1" />
                              URL: {courseForm.video_url.substring(0, 50)}...
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setCourseForm({...courseForm, video_url: ''})}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="is_featured"
                          checked={courseForm.is_featured}
                          onChange={e => setCourseForm({...courseForm, is_featured: e.target.checked})}
                          className="rounded"/>
                        <Label htmlFor="is_featured">Featured Course</Label>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={uploadingVideo}>
                          {editingCourse ? 'Update Course' : 'Create Course'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => { setShowCourseForm(false); setEditingCourse(null); }}>Cancel</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
              <div className="grid gap-4">
                {courses.map(course => (
                  <Card key={course.id}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          {course.is_featured && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Featured</Badge>
                          )}
                          {course.video_file_path && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              <Video className="h-3 w-3 mr-1" /> Local Video
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
                        <Button size="sm" variant="outline" onClick={() => startEditCourse(course)}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteCourse(course.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            {/* === QUIZZES === */}
            <TabsContent value="quizzes" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Quiz Management</h2>
                <Button onClick={() => setShowQuestionForm(true)} className="bg-green-600 hover:bg-green-700" disabled={!quizCourse}>
                  <Plus className="h-4 w-4 mr-2" /> Add Question
                </Button>
              </div>
              <Card>
                <CardHeader><CardTitle>Select Course</CardTitle></CardHeader>
                <CardContent>
                  <Select value={quizCourse} onValueChange={setQuizCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a course to manage quiz questions" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              {showQuestionForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>{editingQuestion ? 'Edit Quiz Question' : 'Create New Quiz Question'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion} className="space-y-4">
                      <div>
                        <Label htmlFor="question">Question</Label>
                        <Textarea id="question" value={questionForm.question}
                          onChange={e => setQuestionForm({...questionForm, question: e.target.value})}
                          required rows={3}/>
                      </div>
                      <div>
                        <Label>Answer Options</Label>
                        <div className="space-y-2">
                          {questionForm.options.map((option, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <Input value={option}
                                onChange={e => {
                                  const opts = [...questionForm.options];
                                  opts[idx] = e.target.value;
                                  setQuestionForm({...questionForm, options: opts});
                                }}
                                placeholder={`Option ${idx + 1}`} required={idx < 2}/>
                              <input type="radio" name="correct_answer"
                                checked={questionForm.correct_answer === idx}
                                onChange={() => setQuestionForm({...questionForm, correct_answer: idx})}
                                className="w-4 h-4"/>
                              <Label className="text-sm">Correct</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                          {editingQuestion ? 'Update Question' : 'Create Question'}
                        </Button>
                        <Button type="button" variant="outline" onClick={resetQuestionForm}>Cancel</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
              {quizCourse && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz Questions ({quizQuestions.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {quizQuestions.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No quiz questions found for this course. Add some questions to get started.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {quizQuestions.map((question, idx) => (
                          <div key={question.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold mb-2">{idx + 1}. {question.question}</h4>
                                <div className="space-y-1">
                                  {question.options.map((option: string, optionIdx: number) => (
                                    <div key={optionIdx} className={`text-sm p-2 rounded ${optionIdx === question.correct_answer ? 'bg-green-100 text-green-800 font-medium' : 'bg-gray-50'}`}>
                                      {String.fromCharCode(65 + optionIdx)}. {option}{optionIdx === question.correct_answer && ' ✓'}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <Button size="sm" variant="outline" onClick={() => startEditQuestion(question)}><Edit className="h-4 w-4" /></Button>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteQuestion(question.id)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};
export default AdminPage;
