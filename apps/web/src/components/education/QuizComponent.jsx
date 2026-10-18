import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Trophy, ArrowLeftCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const QuizComponent = ({ quiz, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, [quiz.id]);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('created_at');
    
    if (!error && data) {
      setQuestions(data);
    }
  };

  const handleAnswerSelect = (answer) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let totalScore = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct_answer) {
        totalScore++;
      }
    });
    setScore(totalScore);
    setShowResults(true);
  };

  const getPerformanceMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return { message: 'Excellent! Outstanding performance!', color: 'text-green-600', emoji: '🌟' };
    if (percentage >= 75) return { message: 'Great job! Well done!', color: 'text-blue-600', emoji: '🎉' };
    if (percentage >= 50) return { message: 'Good effort! Keep practicing!', color: 'text-yellow-600', emoji: '👍' };
    return { message: 'Keep learning! Practice makes perfect!', color: 'text-orange-600', emoji: '💪' };
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">Loading questions...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    const performance = getPerformanceMessage();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold">Quiz Completed!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {score}/{questions.length}
                  </div>
                  <div className="text-2xl text-slate-600 mb-4">{percentage}%</div>
                  <div className={`text-xl font-semibold ${performance.color} flex items-center justify-center gap-2`}>
                    <span className="text-3xl">{performance.emoji}</span>
                    {performance.message}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900">Question Review:</h3>
                  {questions.map((question, index) => {
                    const userAnswer = userAnswers[index];
                    const isCorrect = userAnswer === question.correct_answer;
                    
                    return (
                      <div key={question.id} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 mb-2">
                              {index + 1}. {question.question_text}
                            </p>
                            <p className="text-sm text-slate-600">
                              Your answer: <span className={isCorrect ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>{userAnswer || 'Not answered'}</span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-700 font-semibold">
                                Correct answer: {question.correct_answer}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 justify-center pt-4">
                  <Button onClick={onBack} variant="outline" size="lg">
                    <ArrowLeftCircle className="w-5 h-5 mr-2" />
                    Back to Subject
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowResults(false);
                      setCurrentQuestionIndex(0);
                      setUserAnswers({});
                      setScore(0);
                    }}
                    className="bg-purple-500 hover:bg-purple-600"
                    size="lg"
                  >
                    Retake Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quiz List
          </Button>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <span className="text-slate-500 font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                  <p className="text-lg font-semibold text-slate-900">
                    {currentQuestion.question_text}
                  </p>
                </div>

                <div className="grid gap-3">
                  {['A', 'B', 'C', 'D'].map((option) => {
                    const optionText = currentQuestion[`option_${option.toLowerCase()}`];
                    const isSelected = userAnswers[currentQuestionIndex] === option;
                    
                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswerSelect(option)}
                        className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50 shadow-md'
                            : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            isSelected
                              ? 'bg-purple-500 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {option}
                          </div>
                          <span className="text-slate-900">{optionText}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between pt-4">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(userAnswers).length !== questions.length}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizComponent;