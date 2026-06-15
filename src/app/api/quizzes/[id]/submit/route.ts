import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quiz from '@/models/Quiz';
import QuizAttempt from '@/models/QuizAttempt';
import { verifyToken } from '@/lib/auth';

interface RouteParams {
    params: {
        id: string;
    };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        await connectDB();

        const quiz = await Quiz.findById(params.id);

        if (!quiz) {
            return NextResponse.json(
                { error: 'Quiz not found' },
                { status: 404 }
            );
        }

        const { answers } = await request.json();

        // Calculate score
        let score = 0;
        let totalPoints = 0;

        quiz.questions.forEach((question, index) => {
            totalPoints += question.points;
            const userAnswer = answers.find((a: any) => a.questionIndex === index);

            if (userAnswer && userAnswer.selectedAnswer === question.correctAnswer) {
                score += question.points;
            }
        });

        const percentage = (score / totalPoints) * 100;
        const passed = percentage >= quiz.passingScore;

        // Create quiz attempt
        const attempt = await QuizAttempt.create({
            userId: payload.userId,
            quizId: quiz._id,
            answers,
            score,
            totalPoints,
            percentage,
            passed,
            completedAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            message: passed ? 'Congratulations! You passed the quiz!' : 'You did not pass. Try again!',
            result: {
                score,
                totalPoints,
                percentage: percentage.toFixed(2),
                passed,
                correctAnswers: quiz.questions.map((q, i) => ({
                    questionIndex: i,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                })),
            },
        });
    } catch (error: any) {
        console.error('Submit quiz error:', error);
        return NextResponse.json(
            { error: 'Server error while submitting quiz' },
            { status: 500 }
        );
    }
}
