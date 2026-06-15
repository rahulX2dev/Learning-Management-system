import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import { verifyToken } from '@/lib/auth';

// POST: Add a new module
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const token = request.cookies.get('token')?.value;
        const user = verifyToken(token) as any;

        if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, description, videoUrl, duration, isFree } = await request.json();
        const courseId = params.id;

        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Verify ownership for instructors
        if (user.role === 'instructor' && course.instructor.toString() !== user.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const newModule = {
            title,
            description,
            videoUrl,
            duration,
            isFree,
            assignments: [],
            quizzes: []
        };

        course.modules.push(newModule);
        await course.save();

        return NextResponse.json({ success: true, message: 'Module added successfully', module: newModule });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to add module' }, { status: 500 });
    }
}

// PUT: Update a module
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const token = request.cookies.get('token')?.value;
        const user = verifyToken(token);

        if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { moduleId, title, description, videoUrl, duration, isFree } = await request.json();
        const courseId = params.id;

        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        if (user.role === 'instructor' && course.instructor.toString() !== user.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const moduleIndex = course.modules.findIndex((m: any) => m._id.toString() === moduleId);
        if (moduleIndex === -1) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        course.modules[moduleIndex] = {
            ...course.modules[moduleIndex], // Keep existing sub-docs like assignments
            title,
            description,
            videoUrl,
            duration,
            isFree
        };

        await course.save();

        return NextResponse.json({ success: true, message: 'Module updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to update module' }, { status: 500 });
    }
}

// DELETE: Remove a module
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const token = request.cookies.get('token')?.value;
        const user = verifyToken(token);
        const { searchParams } = new URL(request.url);
        const moduleId = searchParams.get('moduleId');

        if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const courseId = params.id;
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        if (user.role === 'instructor' && course.instructor.toString() !== user.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        course.modules = course.modules.filter((m: any) => m._id.toString() !== moduleId);
        await course.save();

        return NextResponse.json({ success: true, message: 'Module deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to delete module' }, { status: 500 });
    }
}
