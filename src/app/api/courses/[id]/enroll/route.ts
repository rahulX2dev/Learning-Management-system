import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import User from '@/models/User';
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

        const course = await Course.findById(params.id);

        if (!course) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            );
        }

        const user = await User.findById(payload.userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if already enrolled
        if (user.enrolledCourses.includes(course._id)) {
            return NextResponse.json(
                { error: 'You are already enrolled in this course' },
                { status: 400 }
            );
        }

        // Add course to user's enrolled courses
        user.enrolledCourses.push(course._id);
        await user.save();

        // Increment enrolled students count
        course.enrolledStudents += 1;
        await course.save();

        return NextResponse.json({
            success: true,
            message: 'Successfully enrolled in course',
        });
    } catch (error: any) {
        console.error('Enroll course error:', error);
        return NextResponse.json(
            { error: 'Server error while enrolling in course' },
            { status: 500 }
        );
    }
}
