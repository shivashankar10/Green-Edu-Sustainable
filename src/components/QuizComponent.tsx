
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, X, Award, RotateCcw } from 'lucide-react';

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

  useEffect(() => {
    fetchQuestions();
  }, [courseId]);

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
        options: Array.isArray(item.options) ? item.options : [],
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
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
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

      toast({
        title: "Quiz completed!",
        description: `You scored ${finalScore}%. Your results have been saved.`
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
            <div className="text-4xl font-bold text-green-600 mb-2">{score}%</div>
            <p className="text-gray-600">
              You answered {questions.filter((_, index) => selectedAnswers[index] === questions[index].correct_answer).length} out of {questions.length} questions correctly.
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">{index + 1}. {question.question}</h4>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div 
                      key={optionIndex}
                      className={`p-2 rounded flex items-center ${
                        optionIndex === question.correct_answer 
                          ? 'bg-green-100 text-green-800' 
                          : selectedAnswers[index] === optionIndex 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-50'
                      }`}
                    >
                      {optionIndex === question.correct_answer && (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {selectedAnswers[index] === optionIndex && optionIndex !== question.correct_answer && (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

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
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </p>
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
