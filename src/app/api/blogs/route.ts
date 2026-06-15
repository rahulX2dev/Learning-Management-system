import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { getDataFromToken } from '@/lib/auth';
import User from '@/models/User';

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const view = searchParams.get('view');

        let query: any = {};

        if (view === 'instructor') {
            // For instructor dashboard: only show their own blogs
            const userId = await getDataFromToken(request);
            if (userId) {
                query = { author: userId };
            } else {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        } else if (view === 'admin') {
            // For admin dashboard: show all blogs
            // No filter needed, maybe sort by status?
            query = {};
        } else {
            // Public view: only show published and approved blogs
            query = { isPublished: true, status: 'approved' };
        }

        const blogs = await Blog.find(query).sort({ createdAt: -1 }).populate('author', 'name');
        return NextResponse.json({ success: true, blogs });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const userId = await getDataFromToken(request);
        const user = await User.findById(userId);

        if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const reqBody = await request.json();
        const { title, content, excerpt, coverImage, tags } = reqBody;

        // Admins can publish immediately, instructors need approval
        const isAdmin = user.role === 'admin';

        const newBlog = new Blog({
            title,
            content,
            excerpt,
            coverImage,
            tags,
            author: userId,
            isPublished: isAdmin,
            isApproved: isAdmin,
            status: isAdmin ? 'approved' : 'pending',
        });

        const savedBlog = await newBlog.save();

        return NextResponse.json({
            success: true,
            message: isAdmin ? 'Blog published successfully' : 'Blog submitted for approval',
            blog: savedBlog,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
