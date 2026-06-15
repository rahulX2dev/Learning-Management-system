import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Certificate from '@/models/Certificate';
import { verifyToken, TokenPayload } from '@/lib/auth';
import User from '@/models/User';

export async function POST(req: Request) {
    // Create certificate template (instructor only)
    try {
        const token = (await cookies()).get('token')?.value || '';
        const user = verifyToken(token) as TokenPayload | null;
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (!['instructor', 'admin'].includes(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = await req.json();
        const { course, title, description, templateData } = body;

        await dbConnect();

        const cert = new Certificate({ course, title, description, templateData, issuer: user.userId, isPublished: user.role === 'admin' });
        await cert.save();

        return NextResponse.json({ certificate: cert });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    // List certificates: admins see all, instructors see own, students see published for a course via query
    try {
        const token = (await cookies()).get('token')?.value || '';
        const user = verifyToken(token) as TokenPayload | null;
        const q = Object.fromEntries(new URL(req.url).searchParams.entries());

        await dbConnect();

        if (!user) {
            // public: allow query by course and only published
            const course = q.course;
            if (!course) return NextResponse.json({ error: 'Missing course' }, { status: 400 });
            const list = await Certificate.find({ course, isPublished: true }).lean();
            return NextResponse.json({ certificates: list });
        }

        if (user.role === 'admin') {
            const list = await Certificate.find().lean();
            return NextResponse.json({ certificates: list });
        }

        if (user.role === 'instructor') {
            const list = await Certificate.find({ issuer: user.userId }).lean();
            return NextResponse.json({ certificates: list });
        }

        // student: published for course
        const course = q.course;
        if (!course) return NextResponse.json({ error: 'Missing course' }, { status: 400 });
        const list = await Certificate.find({ course, isPublished: true }).lean();
        return NextResponse.json({ certificates: list });

    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    // Update certificate (instructor owner or admin)
    try {
        const token = (await cookies()).get('token')?.value || '';
        const user = verifyToken(token) as TokenPayload | null;
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        await dbConnect();

        const cert = await Certificate.findById(id);
        if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        if (user.role !== 'admin' && cert.issuer.toString() !== user.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        Object.assign(cert, updates);
        await cert.save();

        return NextResponse.json({ certificate: cert });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const token = (await cookies()).get('token')?.value || '';
        const user = verifyToken(token) as TokenPayload | null;
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const q = Object.fromEntries(new URL(req.url).searchParams.entries());
        const id = q.id;
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

        await dbConnect();
        const cert = await Certificate.findById(id);
        if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (user.role !== 'admin' && cert.issuer.toString() !== user.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await cert.deleteOne();
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
