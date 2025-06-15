
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, X, Award, RotateCcw, Clock } from 'lucide-react';
import CertificateGenerator from './CertificateGenerator';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

interface QuizComponentProps {
  courseId: string;
  onClose: () => void;
}

const QuizComponent = ({ courseId, onClose }: QuizComponentProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [courseDetails, setCourseDetails] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchQuestions();
    fetchCourseDetails();
  }, [courseId]);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0 && !showResults) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResults) {
      // Auto move to next question when timer expires
      handleNext();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isTimerActive, showResults]);

  // Start timer when component loads and questions are available
  useEffect(() => {
    if (questions.length > 0 && !showResults) {
      setIsTimerActive(true);
      setTimeLeft(15);
    }
  }, [questions, currentQuestion, showResults]);

  const fetchCourseDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('title, lessons, duration')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourseDetails(data);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('course_id', courseId);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({
          title: "No quiz available",
          description: "This course doesn't have a quiz yet.",
          variant: "destructive"
        });
        onClose();
        return;
      }

      // Transform the data to match our interface
      const transformedQuestions: QuizQuestion[] = data.map(item => ({
        id: item.id,
        question: item.question,
        options: Array.isArray(item.options) ? item.options as string[] : [],
        correct_answer: item.correct_answer
      }));

      setQuestions(transformedQuestions);
      setSelectedAnswers(new Array(transformedQuestions.length).fill(-1));
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz questions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    // Clear the timer
    setIsTimerActive(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(15); // Reset timer for next question
      setIsTimerActive(true);
    } else {
      submitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      // Clear the timer
      setIsTimerActive(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      setCurrentQuestion(currentQuestion - 1);
      setTimeLeft(15); // Reset timer
      setIsTimerActive(true);
    }
  };

  const submitQuiz = async () => {
    // Stop the timer
    setIsTimerActive(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);

    try {
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user?.id,
          course_id: courseId,
          score: finalScore,
          total_questions: questions.length,
          answers: selectedAnswers
        });

      if (error) throw error;

      // Update course enrollment progress to 100% if score is 80% or higher
      if (finalScore >= 80) {
        await supabase
          .from('course_enrollments')
          .update({ 
            progress: 100,
            completed: true 
          })
          .eq('user_id', user?.id)
          .eq('course_id', courseId);
      }

      toast({
        title: "Quiz completed!",
        description: `You scored ${finalScore}%. ${finalScore >= 80 ? 'Congratulations! You can now download your certificate.' : 'You need 80% or higher to get a certificate.'}`
      });
    } catch (error) {
      console.error('Error saving quiz results:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz results.",
        variant: "destructive"
      });
    }

    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setShowResults(false);
    setScore(0);
    setTimeLeft(15);
    setIsTimerActive(true);
  };

  // Extract hours from duration string (e.g., "4 hours" -> 4)
  const getHoursFromDuration = (duration: string) => {
    const match = duration?.match(/(\d+)\s*hours?/i);
    return match ? parseInt(match[1]) : 4;
  };

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-center">
          <div>Loading quiz...</div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${score >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
              {score}%
            </div>
            <p className="text-gray-600">
              You answered {questions.filter((_, index) => selectedAnswers[index] === questions[index].correct_answer).length} out of {questions.length} questions correctly.
            </p>
            {score >= 80 && (
              <p className="text-green-600 font-semibold mt-2">
                🎉 Congratulations! You passed the quiz and earned a certificate!
              </p>
            )}
          </div>

          {/* Certificate Generation */}
          {score >= 80 && courseDetails && (
            <CertificateGenerator
              courseTitle={courseDetails.title}
              lessons={courseDetails.lessons || 12}
              hours={getHoursFromDuration(courseDetails.duration)}
              score={score}
              completed={true}
            />
          )}

          <div className="flex space-x-4">
            <Button onClick={resetQuiz} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 flex-1">
              Close Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Course Quiz</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Timer Display */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className={`font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-gray-700'}`}>
              {timeLeft}s
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Timer Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
          <div 
            className={`h-1 rounded-full transition-all duration-1000 ${timeLeft <= 5 ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-green-600 bg-green-50 text-green-800'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-green-600 bg-green-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === -1}
            className="bg-green-600 hover:bg-green-700"
          >
            {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizComponent;
