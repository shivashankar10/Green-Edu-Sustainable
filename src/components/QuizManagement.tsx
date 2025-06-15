import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface QuizQuestion {
  id: string;
  course_id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

interface Course {
  id: string;
  title: string;
}

const QuizManagement = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [questionForm, setQuestionForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchQuestions();
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch courses.",
        variant: "destructive"
      });
    }
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('course_id', selectedCourse)
        .order('created_at');

      if (error) throw error;
      
      // Convert the data to match our interface
      const typedQuestions: QuizQuestion[] = (data || []).map(item => ({
        id: item.id,
        course_id: item.course_id,
        question: item.question,
        options: Array.isArray(item.options) ? item.options as string[] : [],
        correct_answer: item.correct_answer
      }));
      
      setQuestions(typedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quiz questions.",
        variant: "destructive"
      });
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      toast({
        title: "Error",
        description: "Please select a course first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('quiz_questions')
        .insert({
          course_id: selectedCourse,
          question: questionForm.question,
          options: questionForm.options.filter(option => option.trim() !== ''),
          correct_answer: questionForm.correct_answer
        });

      if (error) throw error;

      toast({
        title: "Question created successfully!",
        description: "The quiz question has been added."
      });

      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
      toast({
        title: "Error",
        description: "Failed to create quiz question.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingQuestion) return;

    try {
      const { error } = await supabase
        .from('quiz_questions')
        .update({
          question: questionForm.question,
          options: questionForm.options.filter(option => option.trim() !== ''),
          correct_answer: questionForm.correct_answer
        })
        .eq('id', editingQuestion.id);

      if (error) throw error;

      toast({
        title: "Question updated successfully!",
        description: "The quiz question has been updated."
      });

      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Error",
        description: "Failed to update quiz question.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this quiz question?')) return;

    try {
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Question deleted successfully!",
        description: "The quiz question has been removed."
      });

      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete quiz question.",
        variant: "destructive"
      });
    }
  };

  const startEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setQuestionForm({
      question: question.question,
      options: [...question.options, '', '', '', ''].slice(0, 4),
      correct_answer: question.correct_answer
    });
    setShowQuestionForm(true);
  };

  const resetForm = () => {
    setQuestionForm({
      question: '',
      options: ['', '', '', ''],
      correct_answer: 0
    });
    setShowQuestionForm(false);
    setEditingQuestion(null);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quiz Management</h2>
        <Button 
          onClick={() => setShowQuestionForm(true)} 
          className="bg-green-600 hover:bg-green-700"
          disabled={!selectedCourse}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Course</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a course to manage quiz questions" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Question Form */}
      {showQuestionForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingQuestion ? 'Edit Quiz Question' : 'Create New Quiz Question'}
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion} className="space-y-4">
              <div>
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({...questionForm, question: e.target.value})}
                  required
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Answer Options</Label>
                <div className="space-y-2">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required={index < 2}
                      />
                      <input
                        type="radio"
                        name="correct_answer"
                        checked={questionForm.correct_answer === index}
                        onChange={() => setQuestionForm({...questionForm, correct_answer: index})}
                        className="w-4 h-4"
                      />
                      <Label className="text-sm">Correct</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingQuestion ? 'Update Question' : 'Create Question'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      {selectedCourse && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No quiz questions found for this course. Add some questions to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="space-y-1">
                          {question.options.map((option, optionIndex) => (
                            <div 
                              key={optionIndex}
                              className={`text-sm p-2 rounded ${
                                optionIndex === question.correct_answer 
                                  ? 'bg-green-100 text-green-800 font-medium' 
                                  : 'bg-gray-50'
                              }`}
                            >
                              {String.fromCharCode(65 + optionIndex)}. {option}
                              {optionIndex === question.correct_answer && ' ✓'}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => startEditQuestion(question)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteQuestion(question.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizManagement;
