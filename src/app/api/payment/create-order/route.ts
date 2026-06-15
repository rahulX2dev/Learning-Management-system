import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Coupon from '@/models/Coupon';
import User from '@/models/User';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const user = verifyToken(token) as any;

        if (!user || user.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized. Only students can purchase courses.' },
                { status: 401 }
            );
        }

        const { courseId, paymentType, couponCode } = await request.json();

        if (!courseId) {
            return NextResponse.json(
                { error: 'Course ID is required' },
                { status: 400 }
            );
        }

        // Fetch course details
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            );
        }

        // Prevent duplicate purchase: check if user already enrolled
        const student = await User.findById(user.userId);
        if (student && student.enrolledCourses.includes(courseId)) {
            return NextResponse.json({ error: 'You are already enrolled in this course' }, { status: 400 });
        }

        // Calculate amount (apply course-level discount if any)
        const originalPrice = course.price;
        let discountAmount = 0;
        if (course.discount) {
            discountAmount = Math.round((originalPrice * course.discount) / 100);
        }
        let finalAmount = originalPrice - discountAmount;

        // Validate coupon if provided
        let appliedCoupon: any = null;
        if (couponCode) {
            const found = await Coupon.findOne({ code: couponCode.toUpperCase(), course: course._id, isActive: true });
            if (!found) {
                return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 400 });
            }

            const now = new Date();
            if (found.expiresAt && found.expiresAt < now) {
                return NextResponse.json({ error: 'Coupon expired' }, { status: 400 });
            }

            if (found.usageLimit && found.usedCount >= found.usageLimit) {
                return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
            }

            // compute coupon discount on the current finalAmount
            if (found.discountPercent) {
                const cDiscount = Math.round((finalAmount * found.discountPercent) / 100);
                discountAmount += cDiscount;
                finalAmount = Math.max(0, finalAmount - cDiscount);
            } else if (found.amountOff) {
                const cDiscount = Math.round(found.amountOff);
                discountAmount += cDiscount;
                finalAmount = Math.max(0, finalAmount - cDiscount);
            }

            appliedCoupon = found;
        }

        if (finalAmount <= 0) {
            return NextResponse.json(
                { error: 'Invalid course price' },
                { status: 400 }
            );
        }

        // Create Razorpay order
        const razorpayOrder = await createRazorpayOrder(finalAmount, 'INR', {
            courseId: course._id.toString(),
            userId: user.userId,
            courseName: course.title,
        });

        // Create order in database
        const order = await Order.create({
            user: user.userId,
            course: course._id,
            amount: finalAmount,
            originalPrice,
            discountAmount,
            couponCode: appliedCoupon ? appliedCoupon.code : undefined,
            paymentType: paymentType || 'full',
            paymentStatus: 'pending',
            razorpayOrderId: razorpayOrder.id,
        });

        return NextResponse.json({
            success: true,
            orderId: razorpayOrder.id,
            amount: finalAmount,
            currency: 'INR',
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            orderDbId: order._id,
        });
    } catch (error: any) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create order' },
            { status: 500 }
        );
    }
}
