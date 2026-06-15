import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CodeChallenge from '@/models/CodeChallenge';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // If admin view is requested, require an admin token
        const searchParams = request.nextUrl.searchParams;
        const view = searchParams.get('view');
        if (view === 'admin') {
            const token = request.cookies.get('token')?.value;
            if (!token) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
            const user = verifyToken(token) as any;
            if (!user || user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }
        const level = searchParams.get('level');
        const difficulty = searchParams.get('difficulty');
        const category = searchParams.get('category');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        // Build query
        const query: any = {};
        if (level) query.level = parseInt(level);
        if (difficulty) query.difficulty = difficulty;
        if (category) query.category = category;

        // Get total count
        const total = await CodeChallenge.countDocuments(query);

        // Get challenges with pagination
        const challenges = await CodeChallenge.find(query)
            .sort({ problemNumber: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-solution'); // Don't send solution to frontend

        return NextResponse.json({
            success: true,
            challenges,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error('Error fetching challenges:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });

        const user = verifyToken(token) as any;
        if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();

        // Normalize testCases and hints if provided as array or single values
        const testCases = Array.isArray(body.testCases) ? body.testCases : (body.testCases ? body.testCases : []);
        const hints = Array.isArray(body.hints) ? body.hints : (body.hints ? body.hints : []);

        const challenge = await CodeChallenge.create({
            title: body.title,
            problemNumber: body.problemNumber,
            level: body.level,
            difficulty: body.difficulty,
            category: body.category,
            description: body.description,
            starterCode: body.starterCode || '',
            solution: body.solution || '',
            testCases,
            hints,
            timeComplexity: body.timeComplexity,
            spaceComplexity: body.spaceComplexity,
            tags: body.tags || []
        });

        return NextResponse.json({ success: true, challenge });
    } catch (error: any) {
        console.error('Create challenge error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });

        const user = verifyToken(token) as any;
        if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const id = body._id || body.id;
        if (!id) return NextResponse.json({ success: false, error: 'Challenge id required' }, { status: 400 });

        const update: any = { ...body };
        delete update._id;
        delete update.id;

        const updated = await CodeChallenge.findByIdAndUpdate(id, update, { new: true });
        if (!updated) return NextResponse.json({ success: false, error: 'Challenge not found' }, { status: 404 });

        return NextResponse.json({ success: true, challenge: updated });
    } catch (error: any) {
        console.error('Update challenge error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const token = request.cookies.get('token')?.value;
        if (!token) return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });

        const user = verifyToken(token) as any;
        if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        let bodyId = '';
        try { const b = await request.json(); bodyId = b.id || b._id || ''; } catch (e) { }

        const toDelete = id || bodyId;
        if (!toDelete) return NextResponse.json({ success: false, error: 'Challenge id required' }, { status: 400 });

        await CodeChallenge.findByIdAndDelete(toDelete);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete challenge error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
