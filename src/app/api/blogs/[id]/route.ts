import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { getDataFromToken } from '@/lib/auth';
import User from '@/models/User';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const blog = await Blog.findById(params.id).populate('author', 'name');
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, blog });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = await getDataFromToken(request);
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const blog = await Blog.findById(params.id);
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // Check permissions: Admin can edit any, Instructor can edit own
        if (user.role !== 'admin' && blog.author.toString() !== userId) {
            return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }

        const reqBody = await request.json();

        // If instructor edits, it might need re-approval? 
        // For now, let's keep it simple. If admin edits, status stays approved.
        // If instructor edits, maybe reset to pending? User didn't specify, but it's safer.
        // However, user said "whatever blog create instructor after approval that blog can delete".
        // Let's just update the fields for now.

        const updatedBlog = await Blog.findByIdAndUpdate(
            params.id,
            { ...reqBody },
            { new: true }
        );

        return NextResponse.json({ success: true, blog: updatedBlog });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = await getDataFromToken(request);
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const blog = await Blog.findById(params.id);
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // Check permissions: Admin can delete any, Instructor can delete own
        if (user.role !== 'admin' && blog.author.toString() !== userId) {
            return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
        }

        await Blog.findByIdAndDelete(params.id);

        return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
