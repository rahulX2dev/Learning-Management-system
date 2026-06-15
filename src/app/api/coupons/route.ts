import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';
import { verifyToken } from '@/lib/auth';

// GET /api/coupons?courseId=...  -> list
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');

        const query: any = {};
        if (courseId) query.course = courseId;

        const coupons = await Coupon.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, coupons });
    } catch (error: any) {
        console.error('Get coupons error:', error);
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

// POST - create coupon (admin only)
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Auth required' }, { status: 401 });
        const payload = verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Only admins can manage coupons' }, { status: 403 });

        const data = await request.json();
        const { code, course, discountPercent, amountOff, expiresAt, usageLimit } = data;
        if (!code || !course) return NextResponse.json({ error: 'code and course are required' }, { status: 400 });

        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            course,
            discountPercent: discountPercent ?? undefined,
            amountOff: amountOff ?? undefined,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            usageLimit: usageLimit ?? undefined,
            createdBy: payload.userId,
        });

        return NextResponse.json({ success: true, coupon }, { status: 201 });
    } catch (error: any) {
        console.error('Create coupon error:', error);
        return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
    }
}

// PUT - update coupon (admin only)
export async function PUT(request: NextRequest) {
    try {
        await connectDB();
        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Auth required' }, { status: 401 });
        const payload = verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Only admins can manage coupons' }, { status: 403 });

        const { id, ...update } = await request.json();
        if (!id) return NextResponse.json({ error: 'Coupon id required' }, { status: 400 });

        const coupon = await Coupon.findByIdAndUpdate(id, update, { new: true });
        if (!coupon) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });

        return NextResponse.json({ success: true, coupon });
    } catch (error: any) {
        console.error('Update coupon error:', error);
        return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
    }
}

// DELETE - delete coupon (admin only)
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Auth required' }, { status: 401 });
        const payload = verifyToken(token);
        if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Only admins can manage coupons' }, { status: 403 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Coupon id required' }, { status: 400 });

        await Coupon.deleteOne({ _id: id });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete coupon error:', error);
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }
}
