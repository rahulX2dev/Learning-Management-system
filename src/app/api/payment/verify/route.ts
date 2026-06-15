import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Course from '@/models/Course';
import Coupon from '@/models/Coupon';
import { verifyToken } from '@/lib/auth';
import { verifyPaymentSignature } from '@/lib/razorpay';

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

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            paymentMethod,
        } = await request.json();

        // Verify payment signature
        const isValid = verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Find and update order
        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Update order status
        order.paymentStatus = 'completed';
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.paymentMethod = paymentMethod;
        await order.save();

        // Enroll student in course
        const student = await User.findById(user.userId);
        const course = await Course.findById(order.course);

        if (!student || !course) {
            return NextResponse.json(
                { error: 'Student or course not found' },
                { status: 404 }
            );
        }

        // Check if already enrolled
        if (!student.enrolledCourses.includes(order.course)) {
            student.enrolledCourses.push(order.course);
            // initialize enrolledProgress entry
            const existingProgress = (student.enrolledProgress || []).find((p: any) => String(p.course) === String(order.course));
            if (!existingProgress) {
                student.enrolledProgress = student.enrolledProgress || [];
                student.enrolledProgress.push({ course: order.course, progress: 0 });
            }
            await student.save();

            // Increment enrolled students count
            course.enrolledStudents += 1;
            await course.save();

            // If a coupon was used, increment its usedCount
            if (order.couponCode) {
                const coupon = await Coupon.findOne({ code: order.couponCode, course: course._id });
                if (coupon) {
                    coupon.usedCount = (coupon.usedCount || 0) + 1;
                    await coupon.save();
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified and enrollment successful',
            orderId: order._id,
        });
    } catch (error: any) {
        console.error('Verify payment error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to verify payment' },
            { status: 500 }
        );
    }
}
