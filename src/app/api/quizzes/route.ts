import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Quiz from '@/models/Quiz';
import { verifyToken } from '@/lib/auth';

// GET quizzes for a course
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');

        if (!courseId) {
            return NextResponse.json(
                { error: 'Course ID is required' },
                { status: 400 }
            );
        }

        const quizzes = await Quiz.find({ courseId }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            quizzes,
        });
    } catch (error: any) {
        console.error('Get quizzes error:', error);
        return NextResponse.json(
            { error: 'Server error while fetching quizzes' },
            { status: 500 }
        );
    }
}

// POST - Create quiz (instructor/admin only)
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);
        if (!payload || (payload.role !== 'instructor' && payload.role !== 'admin')) {
            return NextResponse.json(
                { error: 'You must be an instructor or admin to create quizzes' },
                { status: 403 }
            );
        }

        await connectDB();

        const quizData = await request.json();
        const quiz = await Quiz.create(quizData);

        return NextResponse.json({
            success: true,
            message: 'Quiz created successfully',
            quiz,
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create quiz error:', error);
        return NextResponse.json(
            { error: 'Server error while creating quiz' },
            { status: 500 }
        );
    }
}
