import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import CertificateGenerator from './CertificateGenerator';
import SampleCertificate from './SampleCertificate';
import html2canvas from 'html2canvas';
import { useCertificateData } from '@/hooks/useCertificateData';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

interface QuizComponentProps {
  courseId: string;
  quiz: any;
  onComplete: (score: number) => void;
}

const QuizComponent = ({ courseId, onComplete }: QuizComponentProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // NEW: Generate certificate on quiz completion, use the same logic as CertificateGenerator
  const { certificateData } = useCertificateData(courseId, score, showResults && score >= 80);

  useEffect(() => {
    fetchQuestions();
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isQuizActive && timeLeft > 0 && !showResults) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isQuizActive && !showResults) {
      handleNextQuestion();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, isQuizActive, showResults]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('course_id', courseId)
        .limit(12);

      if (error) throw error;

      const formattedQuestions = data.map(q => ({
        id: q.id,
        question: q.question,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
        correct_answer: q.correct_answer
      }));

      setQuestions(formattedQuestions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz questions",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setIsQuizActive(true);
    setTimeLeft(15);
  };

  // Defensive: valid answer check for each question
  const handleAnswerSelect = (answerIndex: number) => {
    if (
      !questions[currentQuestionIndex] ||
      answerIndex < 0 ||
      answerIndex >= questions[currentQuestionIndex].options.length
    ) {
      console.warn("Attempted to select out-of-bounds answer", { answerIndex, question: questions[currentQuestionIndex]?.question });
      toast({
        title: "Invalid Answer",
        description: "Selected answer is not valid for this question.",
        variant: "destructive"
      });
      return;
    }
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    // Defensive: don't allow advancing if answer is invalid
    if (
      selectedAnswer !== null &&
      (selectedAnswer < 0 || selectedAnswer >= questions[currentQuestionIndex]?.options.length)
    ) {
      toast({
        title: "Invalid Response",
        description: "Please select a valid option.",
        variant: "destructive"
      });
      setSelectedAnswer(null);
      return;
    }
    const newAnswers = [...userAnswers, selectedAnswer ?? -1];
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(15);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (answers: number[]) => {
    setIsQuizActive(false);
    
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    if (user) {
      try {
        await supabase.from('quiz_attempts').insert({
          user_id: user.id,
          course_id: courseId,
          score: finalScore,
          total_questions: questions.length,
          answers: answers
        });
      } catch (error) {
        console.error('Error saving quiz attempt:', error);
      }
    }
    setQuizCompleted(true);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading quiz...</div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">No quiz questions available for this course.</div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold text-green-600">{score}%</div>
            <p className="text-lg">
              You scored {score}% ({userAnswers.filter((answer, index) => answer === questions[index]?.correct_answer).length} out of {questions.length} correct)
            </p>
            {score >= 80 ? (
              <div className="space-y-4">
                <p className="text-green-600 font-semibold">
                  Congratulations! You passed the quiz and are eligible for a certificate.
                </p>
                {course && (
                  <>
                    {/* Certificate display area - Real A4 Landscape size */}
                    <div className="my-6 bg-gray-50 p-8 rounded-lg overflow-auto">
                      <div 
                        ref={certificateRef} 
                        className="mx-auto bg-white shadow-lg"
                        style={{
                          width: '297mm', // A4 landscape width
                          height: '210mm', // A4 landscape height
                          minWidth: '297mm',
                          minHeight: '210mm',
                        }}
                      >
                        <SampleCertificate
                          courseTitle={course.title}
                          lessons={course.lessons || 0}
                          hours={parseInt(course.duration?.split(' ')[0] || '0')}
                          score={score}
                          completed={true}
                          certificateCode={certificateData?.certificate_code}
                        />
                        {/* If there is no certificate code yet, show fallback */}
                        {!certificateData?.certificate_code && (
                          <div className="text-sm text-center text-red-500 mt-6">
                            Certificate code not generated yet. Please wait a moment and <span className="underline cursor-pointer" onClick={() => window.location.reload()}>reload</span> if needed.
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white mt-2"
                      onClick={async () => {
                        if (!certificateRef.current) return;

                        try {
                          // Create canvas with high DPI for crisp output - A4 landscape
                          const canvas = await html2canvas(certificateRef.current, {
                            backgroundColor: '#fff',
                            scale: 3, // High resolution for print quality
                            useCORS: true,
                            allowTaint: true,
                            width: certificateRef.current.offsetWidth,
                            height: certificateRef.current.offsetHeight,
                          });

                          // Download as PNG
                          const url = canvas.toDataURL("image/png", 1.0);
                          const link = document.createElement("a");
                          link.download = `Certificate-${course.title.replace(/\s/g, "_")}-A4-Landscape.png`;
                          link.href = url;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);

                          toast({
                            title: "Success",
                            description: "Certificate downloaded successfully!",
                          });
                        } catch (error) {
                          console.error('Error generating certificate:', error);
                          toast({
                            title: "Error",
                            description: "Failed to download certificate. Please try again.",
                            variant: "destructive"
                          });
                        }
                      }}
                      disabled={!certificateData?.certificate_code}
                    >
                      Download Certificate (A4 Landscape PNG)
                    </Button>
                  </>
                )}
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    setShowResults(false);
                    setQuizCompleted(false);
                    onComplete(score);
                  }}
                >
                  Back to Course
                </Button>
              </div>
            ) : (
              <>
                <p className="text-red-600">
                  You need at least 80% to earn a certificate. Please retake the quiz to improve your score.
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    setShowResults(false);
                    setQuizCompleted(false);
                    onComplete(score);
                  }}
                >
                  Back to Course
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isQuizActive) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p>• This quiz contains {questions.length} questions</p>
            <p>• You have 15 seconds per question</p>
            <p>• Questions will automatically advance when time expires</p>
            <p>• You cannot go back to previous questions</p>
            <p>• You need 80% or higher to earn a certificate</p>
          </div>
          <Button onClick={startQuiz} className="w-full bg-green-600 hover:bg-green-700">
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{timeLeft}s</div>
              <div className="text-sm text-gray-500">Time left</div>
            </div>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full text-left justify-start p-4 h-auto ${
                  selectedAnswer === index 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Select an answer or wait for auto-advance
          </div>
          <Button 
            onClick={handleNextQuestion}
            className="bg-green-600 hover:bg-green-700"
            disabled={selectedAnswer === null}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizComponent;
