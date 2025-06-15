
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Timer, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CertificateGenerator from './CertificateGenerator';

// Mock quiz data as fallback
const createMockQuiz = (courseTitle: string) => ({
  title: `${courseTitle} Quiz`,
  course_title: courseTitle,
  time_limit: 150, // 15 seconds per question * 10 questions
  lessons: 10,
  questions: [
    {
      question: "What is the main focus of sustainable development?",
      options: [
        "Economic growth only",
        "Environmental protection only", 
        "Balancing economic, social, and environmental needs",
        "Population control"
      ],
      correct_answer: "Balancing economic, social, and environmental needs"
    },
    {
      question: "Which of the following is a renewable energy source?",
      options: [
        "Coal",
        "Natural gas",
        "Solar energy",
        "Nuclear energy"
      ],
      correct_answer: "Solar energy"
    },
    {
      question: "What does the term 'carbon footprint' refer to?",
      options: [
        "The size of your shoes",
        "The amount of carbon dioxide produced by activities",
        "The number of trees planted",
        "The weight of carbon materials"
      ],
      correct_answer: "The amount of carbon dioxide produced by activities"
    },
    {
      question: "Which practice helps reduce waste?",
      options: [
        "Single-use plastics",
        "Recycling and reusing materials",
        "Burning waste",
        "Buying more products"
      ],
      correct_answer: "Recycling and reusing materials"
    },
    {
      question: "What is biodiversity?",
      options: [
        "The variety of life forms in an ecosystem",
        "The study of biology",
        "A type of renewable energy",
        "A method of farming"
      ],
      correct_answer: "The variety of life forms in an ecosystem"
    }
  ]
});

export const QuizComponent = ({ courseId, quiz, onComplete }: { courseId: string; quiz: any; onComplete: (score: number) => void }) => {
  // All hooks must be declared at the top level, before any conditional logic
  const [actualQuiz, setActualQuiz] = useState(quiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [questionTimeLeft, setQuestionTimeLeft] = useState(15); // 15 seconds per question
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const { toast } = useToast();
  
  // Initialize quiz data
  useEffect(() => {
    if (!quiz) {
      setActualQuiz(createMockQuiz("Course"));
    } else {
      setActualQuiz(quiz);
    }
  }, [quiz]);

  // Question timer effect - auto advance to next question
  useEffect(() => {
    if (!quizStarted || completed || !actualQuiz) return;
    
    const timer = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          // Auto advance to next question when time runs out
          if (currentQuestionIndex < actualQuiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            return 15; // Reset timer for next question
          } else {
            // Quiz completed
            handleSubmitQuiz();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizStarted, completed, actualQuiz, currentQuestionIndex]);

  // Reset timer when question changes
  useEffect(() => {
    if (quizStarted) {
      setQuestionTimeLeft(15);
    }
  }, [currentQuestionIndex, quizStarted]);

  // NOW we can do the conditional rendering after all hooks are declared
  if (!actualQuiz || !actualQuiz.questions) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Loading Quiz...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div>Please wait while the quiz loads...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalQuestions = actualQuiz.questions.length;
  const currentQuestion = actualQuiz.questions[currentQuestionIndex];
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer
    });
    
    // Auto advance to next question after selecting answer
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        handleSubmitQuiz();
      }
    }, 500); // Small delay to show selection
  };
  
  const calculateScore = () => {
    let correctAnswers = 0;
    
    actualQuiz.questions.forEach((question: any, index: number) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctAnswers++;
      }
    });
    
    return Math.round((correctAnswers / totalQuestions) * 100);
  };
  
  const handleSubmitQuiz = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setCompleted(true);
    setShowResults(true);
    
    // Call the onComplete callback with the score
    onComplete(finalScore);
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setQuestionTimeLeft(15);
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Quiz start screen
  if (!quizStarted && !completed) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{actualQuiz.title}</CardTitle>
          <CardDescription>
            Get ready for your quiz! You'll have 15 seconds per question.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Quiz Instructions:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Each question has a 15-second time limit</li>
              <li>• Questions advance automatically after selection or timeout</li>
              <li>• No going back to previous questions</li>
              <li>• You need 80% or higher to earn a certificate</li>
              <li>• Total questions: {totalQuestions}</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartQuiz} className="w-full bg-green-600 hover:bg-green-700">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (showResults) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Quiz Results</CardTitle>
          <CardDescription>
            You scored {score}% on this quiz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {score >= 80 ? (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
                <p className="text-xl font-bold text-green-700">Congratulations!</p>
                <p className="text-gray-600">You passed the quiz and earned a certificate!</p>
              </div>
            ) : (
              <div className="text-center">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-2" />
                <p className="text-xl font-bold text-red-700">Not quite there</p>
                <p className="text-gray-600">You need 80% or higher to earn a certificate</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Your score</span>
              <span className="font-medium">{score}%</span>
            </div>
            <Progress value={score} className={getProgressColor(score)} />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Question Summary:</h3>
            {actualQuiz.questions.map((question: any, index: number) => (
              <div key={index} className="border rounded-md p-3">
                <p className="font-medium">{question.question}</p>
                <div className="flex items-center mt-2">
                  <div className="mr-2">
                    {selectedAnswers[index] === question.correct_answer ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">Your answer: <span className={selectedAnswers[index] === question.correct_answer ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {selectedAnswers[index] || "Not answered"}
                    </span></p>
                    {selectedAnswers[index] !== question.correct_answer && (
                      <p className="text-sm">Correct answer: <span className="text-green-600 font-medium">{question.correct_answer}</span></p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show certificate if score >= 80% */}
          {score >= 80 && (
            <CertificateGenerator
              courseId={courseId}
              courseTitle={actualQuiz.course_title || "Course"}
              lessons={actualQuiz.lessons || 10}
              hours={4}
              score={score}
              completed={true}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => window.location.reload()}>
            Retake Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{actualQuiz.title}</CardTitle>
            <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full">
              <Timer className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{questionTimeLeft}s</span>
            </div>
          </div>
          <CardDescription>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </CardDescription>
          <Progress value={(currentQuestionIndex + 1) / totalQuestions * 100} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
            <RadioGroup 
              value={selectedAnswers[currentQuestionIndex] || ""}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {currentQuestion.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizComponent;
