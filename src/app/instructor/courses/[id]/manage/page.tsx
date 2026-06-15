'use client';

import { useParams } from 'next/navigation';
import CourseManager from '@/components/admin/CourseManager';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function InstructorManageCoursePage() {
    const params = useParams();
    const courseId = params.id as string;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <Link href="/instructor" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4">
                        <FaArrowLeft /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Manage Course Content</h1>
                    <p className="text-slate-400">Add modules, assignments, and quizzes to your course.</p>
                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-400 text-sm">
                            <strong>Note:</strong> Your course will be submitted for admin approval. It will only be published after approval.
                        </p>
                    </div>
                </div>

                <CourseManager courseId={courseId} isInstructor={true} />
            </div>
        </div>
    );
}
