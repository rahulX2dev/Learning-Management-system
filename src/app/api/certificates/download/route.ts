import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import { verifyToken, TokenPayload } from '@/lib/auth';
import IssuedCertificate from '@/models/IssuedCertificate';
import Certificate from '@/models/Certificate';
import Course from '@/models/Course';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        const params = Object.fromEntries(new URL(req.url).searchParams.entries());
        const issuedId = params.issuedId;
        if (!issuedId) return NextResponse.json({ error: 'Missing issuedId' }, { status: 400 });

        await dbConnect();

        const issued = await IssuedCertificate.findById(issuedId).populate('template').populate('course').populate('student').lean();
        if (!issued) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Check user: only student who owns it or admin can download
        const token = (await cookies()).get('token')?.value || '';
        const user = verifyToken(token) as TokenPayload | null;
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        if (user.role !== 'admin' && String(user.userId) !== String((issued.student as any)?._id || (issued.student as any))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // For now return JSON payload describing certificate; front-end can render/generate PDF
        const payload = {
            title: (issued.template as any)?.title,
            studentName: (issued.student as any)?.name,
            courseTitle: (issued.course as any)?.title,
            issuedAt: issued.issuedAt,
            issuedId: issued._id
        };

        return NextResponse.json({ success: true, certificate: payload });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
