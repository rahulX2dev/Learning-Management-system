import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

        const user = verifyToken(token) as any;
        if (!user || user.role !== 'student') return NextResponse.json({ error: 'Only students can update progress' }, { status: 403 });

        const body = await request.json();
        const { progress, increment } = body;

        const student = await User.findById(user.userId);
        if (!student) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const courseId = params.id;
        student.enrolledProgress = student.enrolledProgress || [];
        const entry = student.enrolledProgress.find((p: any) => String(p.course) === String(courseId));
        if (!entry) {
            // If not enrolled or no entry, initialize
            const newProg = Math.max(0, Math.min(100, Number(progress ?? 0)));
            student.enrolledProgress.push({ course: courseId, progress: newProg });
        } else {
            if (typeof increment === 'number') {
                entry.progress = Math.min(100, Math.max(0, entry.progress + increment));
            } else if (typeof progress === 'number') {
                entry.progress = Math.min(100, Math.max(0, progress));
            }
        }

        await student.save();

        return NextResponse.json({ success: true, enrolledProgress: student.enrolledProgress });
    } catch (err: any) {
        console.error('Update progress error:', err);
        return NextResponse.json({ error: err.message || 'Failed to update progress' }, { status: 500 });
    }
}
