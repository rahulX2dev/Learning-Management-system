'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaClock, FaCheckCircle, FaTimesCircle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function QuizPage({ params }: { params: { id: string; quizId: string } }) {
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<{ questionIndex: number; selectedAnswer: number }[]>([]);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        fetchQuiz();
    }, [params.quizId]);

    useEffect(() => {
        if (quiz && timeRemaining > 0 && !submitted) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [quiz, timeRemaining, submitted]);

    const fetchQuiz = async () => {
        try {
            const response = await axios.get(`/api/quizzes/${params.quizId}`);
            if (response.data.success) {
                setQuiz(response.data.quiz);
                setTimeRemaining(response.data.quiz.duration * 60); // Convert to seconds
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
        const newAnswers = answers.filter(a => a.questionIndex !== questionIndex);
        newAnswers.push({ questionIndex, selectedAnswer: answerIndex });
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`/api/quizzes/${params.quizId}/submit`, {
                answers,
            });

            if (response.data.success) {
                setSubmitted(true);
                setResult(response.data.result);
            }
        } catch (error: any) {
            console.error('Quiz submission error:', error);
            alert('Failed to submit quiz');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl text-slate-400">Quiz not found</h2>
            </div>
        );
    }

    if (submitted && result) {
        return (
            <div className="py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto glass rounded-2xl p-8 text-center"
                >
                    {result.passed ? (
                        <FaCheckCircle className="text-green-400 text-6xl mx-auto mb-4" />
                    ) : (
                        <FaTimesCircle className="text-red-400 text-6xl mx-auto mb-4" />
                    )}

                    <h2 className={`text-3xl font-bold mb-4 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                        {result.passed ? 'Congratulations!' : 'Keep Trying!'}
                    </h2>

                    <p className="text-slate-300 text-xl mb-8">
                        You scored {result.score} out of {result.totalPoints} points ({result.percentage}%)
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <p className="text-slate-400 text-sm">Your Score</p>
                            <p className="text-2xl font-bold gradient-text">{result.percentage}%</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <p className="text-slate-400 text-sm">Passing Score</p>
                            <p className="text-2xl font-bold text-white">{quiz.passingScore}%</p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push(`/courses/${params.id}`)}
                        className="btn-primary"
                    >
                        Back to Course
                    </button>
                </motion.div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];
    const userAnswer = answers.find(a => a.questionIndex === currentQuestion);

    return (
        <div className="py-12">
            {/* Timer and Progress */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="glass rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-primary-400">
                            <FaClock className="text-xl" />
                            <span className="text-xl font-bold">{formatTime(timeRemaining)}</span>
                        </div>
                        <div className="text-slate-400">
                            Question {currentQuestion + 1} of {quiz.questions.length}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={answers.length === 0}
                        className="btn-primary disabled:opacity-50"
                    >
                        Submit Quiz
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    />
                </div>
            </div>

            {/* Question */}
            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-4xl mx-auto glass rounded-2xl p-8"
            >
                <h2 className="text-2xl font-bold text-white mb-6">
                    {question.question}
                </h2>

                <div className="space-y-4 mb-8">
                    {question.options.map((option: string, index: number) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAnswerSelect(currentQuestion, index)}
                            className={`w-full p-4 rounded-lg text-left transition-all ${userAnswer?.selectedAnswer === index
                                    ? 'bg-primary-600 border-2 border-primary-400'
                                    : 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${userAnswer?.selectedAnswer === index
                                        ? 'border-white bg-white'
                                        : 'border-slate-400'
                                    }`}>
                                    {userAnswer?.selectedAnswer === index && (
                                        <div className="w-3 h-3 rounded-full bg-primary-600" />
                                    )}
                                </div>
                                <span className="text-white">{option}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button
                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestion === 0}
                        className="btn-secondary disabled:opacity-50 flex items-center space-x-2"
                    >
                        <FaArrowLeft />
                        <span>Previous</span>
                    </button>

                    <button
                        onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                        disabled={currentQuestion === quiz.questions.length - 1}
                        className="btn-secondary disabled:opacity-50 flex items-center space-x-2"
                    >
                        <span>Next</span>
                        <FaArrowRight />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
