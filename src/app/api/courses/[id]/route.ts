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

// GET single course
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await connectDB();

        const course = await Course.findById(params.id).populate('instructor', 'name email avatar');
        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // If course is inactive, hide it from public/students. Allow admins, the instructor owner, and enrolled students.
        if (!course.isActive) {
            try {
                const token = request.cookies.get('token')?.value;
                if (!token) {
                    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
                }
                const payload = verifyToken(token) as any;
                // allow admins
                if (payload?.role === 'admin') {
                    return NextResponse.json({ success: true, course });
                }
                // allow instructor owner
                if (payload?.userId && course.instructor && String(course.instructor._id || course.instructor) === String(payload.userId)) {
                    return NextResponse.json({ success: true, course });
                }
                // allow enrolled students
                if (payload?.userId) {
                    const User = (await import('@/models/User')).default;
                    const user = await User.findById(payload.userId);
                    if (user && (user.enrolledCourses || []).map(String).includes(String(course._id))) {
                        return NextResponse.json({ success: true, course });
                    }
                }
            } catch (e) {
                // token invalid or other error -> hide
                console.warn('Course access check failed', e);
                return NextResponse.json({ error: 'Course not found' }, { status: 404 });
            }

            // If none of the allowed roles matched, return not found to hide from public
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, course });
    } catch (error: any) {
        console.error('Get course error:', error);
        return NextResponse.json(
            { error: 'Server error while fetching course' },
            { status: 500 }
        );
    }
}

// PUT - Update course
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

        // Check if user is the course instructor or admin
        if (course.instructor.toString() !== payload.userId && payload.role !== 'admin') {
            return NextResponse.json(
                { error: 'You do not have permission to update this course' },
                { status: 403 }
            );
        }

        const updateData = await request.json();

        // Build explicit update object to avoid accidental type issues
        const updateFields: any = {};
        if (Object.prototype.hasOwnProperty.call(updateData, 'title')) updateFields.title = updateData.title;
        if (Object.prototype.hasOwnProperty.call(updateData, 'description')) updateFields.description = updateData.description;
        if (Object.prototype.hasOwnProperty.call(updateData, 'category')) updateFields.category = updateData.category;
        if (Object.prototype.hasOwnProperty.call(updateData, 'level')) updateFields.level = updateData.level;
        if (Object.prototype.hasOwnProperty.call(updateData, 'price')) updateFields.price = updateData.price;
        if (Object.prototype.hasOwnProperty.call(updateData, 'discount')) updateFields.discount = updateData.discount;
        if (Object.prototype.hasOwnProperty.call(updateData, 'courseType')) updateFields.courseType = updateData.courseType;
        if (Object.prototype.hasOwnProperty.call(updateData, 'modules')) updateFields.modules = updateData.modules;

        // Handle isActive toggle explicitly
        if (Object.prototype.hasOwnProperty.call(updateData, 'isActive')) {
            const isActive = !!updateData.isActive;
            updateFields.isActive = isActive;

            try {
                const token2 = request.cookies.get('token')?.value;
                const payload2 = token2 ? verifyToken(token2) as any : null;
                if (payload2?.role === 'admin') {
                    if (isActive) {
                        updateFields.isPublished = true;
                        updateFields.isApproved = true;
                        updateFields.status = 'approved';
                    } else {
                        // when deactivating, hide from public
                        updateFields.isPublished = false;
                    }
                }
            } catch (e) {
                // ignore token verification errors here
            }
        }

        // Handle approval fields explicitly (for admin approval action)
        if (Object.prototype.hasOwnProperty.call(updateData, 'status')) updateFields.status = updateData.status;
        if (Object.prototype.hasOwnProperty.call(updateData, 'isApproved')) updateFields.isApproved = updateData.isApproved;
        if (Object.prototype.hasOwnProperty.call(updateData, 'isPublished')) updateFields.isPublished = updateData.isPublished;

        const updatedCourse = await Course.findByIdAndUpdate(
            params.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Course updated successfully',
            course: updatedCourse,
        });
    } catch (error: any) {
        console.error('Update course error:', error);
        return NextResponse.json(
            { error: 'Server error while updating course' },
            { status: 500 }
        );
    }
}

// DELETE course
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json(
                { error: 'Only admins can delete courses' },
                { status: 403 }
            );
        }

        await connectDB();

        const course = await Course.findByIdAndDelete(params.id);

        if (!course) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Course deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete course error:', error);
        return NextResponse.json(
            { error: 'Server error while deleting course' },
            { status: 500 }
        );
    }
}
