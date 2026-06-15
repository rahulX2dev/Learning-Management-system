'use client';

import { motion } from 'framer-motion';
// Link removed: navigation handled via router to respect user role
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClock, FaUsers, FaStar, FaBookmark, FaCheckCircle } from 'react-icons/fa';

interface CourseCardProps {
    course: {
        _id: string;
        title: string;
        description: string;
        thumbnail: string;
        category: string;
        level: string;
        price: number;
        enrolledStudents: number;
        rating: number;
        modules?: any[];
        instructorName?: string;
    };
    isPurchased?: boolean;
    progress?: number;
}

export default function CourseCard({ course, isPurchased = false, progress }: CourseCardProps) {
    const totalDuration = course.modules?.reduce((acc, mod) => acc + mod.duration, 0) || 120;

    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await axios.get('/api/auth/me');
                if (mounted && res.data.success && res.data.user) setUserRole(res.data.user.role);
            } catch (err) {
                // ignore
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Determine link destination
    // If purchased and has modules, go to first module. Otherwise go to course detail.
    const linkHref = isPurchased && course.modules && course.modules.length > 0
        ? `/courses/${course._id}/module/${course.modules[0]._id}`
        : `/courses/${course._id}`;

    const handleCardClick = async (e?: any) => {
        // If admin or instructor, send them to the admin manage page instead of student course view
        if (userRole === 'admin' || userRole === 'instructor') {
            router.push(`/admin/courses/${course._id}/manage`);
            return;
        }
        router.push(linkHref);
    };

    return (
        <div onClick={handleCardClick}>
            <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="card-hover h-full cursor-pointer overflow-hidden relative group"
            >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-20">📚</span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                        {course.category}
                    </div>

                    {/* Level Badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.level === 'beginner' ? 'bg-green-500/80' :
                            course.level === 'intermediate' ? 'bg-yellow-500/80' :
                                'bg-red-500/80'
                            }`}>
                            {course.level}
                        </span>
                    </div>

                    {/* Purchased Badge Overlay */}
                    {isPurchased && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                                <FaCheckCircle className="text-green-400" />
                                <span className="font-bold text-white">Continue Learning</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {course.title}
                    </h3>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {course.description}
                    </p>

                    {/* Instructor */}
                    {course.instructorName && (
                        <p className="text-xs text-slate-500 mb-3">
                            By {course.instructorName}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                        <div className="flex items-center space-x-1">
                            <FaClock className="text-primary-400" />
                            <span>{totalDuration} min</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <FaUsers className="text-secondary-400" />
                            <span>{course.enrolledStudents}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                            <FaStar className="text-yellow-400" />
                            <span>{course.rating.toFixed(1)}</span>
                        </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                        <div className="w-full">
                            {isPurchased ? (
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-green-400 flex items-center gap-2">
                                            <FaCheckCircle /> Purchased
                                        </span>
                                        {progress !== undefined && (
                                            <span className="text-xs text-slate-400">{progress}% Complete</span>
                                        )}
                                    </div>
                                    {progress !== undefined && (
                                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // If current user is admin or instructor, hide price and show manage action
                                (userRole === 'admin' || userRole === 'instructor') ? (
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-medium text-slate-400">Admin/Instructor View</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); router.push(`/admin/courses/${course._id}/manage`) }}
                                            className="mt-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs"
                                        >
                                            Manage Course
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        {course.price === 0 ? (
                                            <span className="text-xl font-bold text-green-400">Free</span>
                                        ) : (
                                            <span className="text-xl font-bold gradient-text">
                                                ₹{course.price}
                                            </span>
                                        )}
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className="text-primary-400 hover:text-primary-300 transition-colors"
                                        >
                                            <FaBookmark className="text-xl" />
                                        </motion.div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
