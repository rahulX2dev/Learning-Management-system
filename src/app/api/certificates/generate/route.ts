import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import { verifyToken, TokenPayload } from '@/lib/auth';
import Certificate from '@/models/Certificate';
import IssuedCertificate from '@/models/IssuedCertificate';
import Course from '@/models/Course';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get('token')?.value || '';
        const user = verifyToken(token) as TokenPayload | null;
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (user.role !== 'student') return NextResponse.json({ error: 'Only students can generate certificates' }, { status: 403 });

        const body = await req.json();
        const { courseId, templateId } = body;
        if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });

        await dbConnect();

        // Check progress (require >= 70%)
        const me = await User.findById(user.userId).lean();
        const p = (me?.enrolledProgress || []).find((x: any) => String(x.course) === String(courseId));
        if (!p || p.progress < 70) return NextResponse.json({ error: 'Course not sufficiently completed (minimum 70%)' }, { status: 403 });

        // Find template: if provided use it, else pick a published template for course
        let template = null;
        if (templateId) template = await Certificate.findById(templateId);
        if (!template) template = await Certificate.findOne({ course: courseId, isPublished: true });
        if (!template) return NextResponse.json({ error: 'No published certificate template for course' }, { status: 404 });

        // Create issued certificate record
        const course = await Course.findById(courseId).lean();
        const issued = new IssuedCertificate({ template: template._id, course: courseId, student: user.userId, meta: { studentName: me?.name || '', courseTitle: course?.title } });
        await issued.save();

        return NextResponse.json({ success: true, issuedId: issued._id });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
