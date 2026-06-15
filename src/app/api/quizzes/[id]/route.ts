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

// GET single quiz
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await connectDB();

        const quiz = await Quiz.findById(params.id);

        if (!quiz) {
            return NextResponse.json(
                { error: 'Quiz not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            quiz,
        });
    } catch (error: any) {
        console.error('Get quiz error:', error);
        return NextResponse.json(
            { error: 'Server error while fetching quiz' },
            { status: 500 }
        );
    }
}
