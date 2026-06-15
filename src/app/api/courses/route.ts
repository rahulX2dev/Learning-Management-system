import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import { verifyToken } from '@/lib/auth';

// GET all courses
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const level = searchParams.get('level');
        const search = searchParams.get('search');
        const view = searchParams.get('view'); // 'admin' | 'instructor'

        let query: any = { isPublished: true, isApproved: true, isActive: true }; // Default public view — only show active courses

        // Check auth for special views
        const token = request.cookies.get('token')?.value;
        if (token && (view === 'admin' || view === 'instructor')) {
            const payload = verifyToken(token);
            if (payload) {
                if (view === 'admin' && payload.role === 'admin') {
                    query = {}; // Admin sees everything
                } else if (view === 'instructor' && (payload.role === 'instructor' || payload.role === 'admin')) {
                    query = { instructor: payload.userId }; // Instructor sees own courses
                }
            }
        }

        if (category && category !== 'all') {
            query.category = category;
        }

        if (level && level !== 'all') {
            query.level = level;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const courses = await Course.find(query)
            .populate('instructor', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            courses,
        });
    } catch (error: any) {
        console.error('Get courses error:', error);
        return NextResponse.json(
            { error: 'Server error while fetching courses' },
            { status: 500 }
        );
    }
}

// POST - Create new course (instructor/admin only)
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
                { error: 'You must be an instructor or admin to create courses' },
                { status: 403 }
            );
        }

        await connectDB();

        const courseData = await request.json();

        const isAutoApproved = payload.role === 'admin';

        const course = await Course.create({
            ...courseData,
            instructor: payload.userId,
            instructorName: payload.email.split('@')[0],
            isApproved: isAutoApproved,
            status: isAutoApproved ? 'approved' : 'pending',
            isPublished: isAutoApproved ? (courseData.isPublished ?? false) : false, // Instructors can't publish immediately if pending
        });

        return NextResponse.json({
            success: true,
            message: isAutoApproved ? 'Course created successfully' : 'Course submitted for approval',
            course,
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create course error:', error);
        return NextResponse.json(
            { error: 'Server error while creating course' },
            { status: 500 }
        );
    }
}
