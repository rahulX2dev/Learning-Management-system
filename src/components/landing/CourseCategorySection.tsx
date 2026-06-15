'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaStar, FaUsers, FaClock, FaArrowRight, FaChalkboardTeacher } from 'react-icons/fa';

interface Course {
    _id: string;
    title: string;
    thumbnail: string;
    instructorName?: string;
    rating?: number;
    enrolledStudents?: number;
    duration?: string;
    price: number;
    originalPrice?: number;
    courseType: string;
}

interface CourseCategorySectionProps {
    title: string;
    subtitle?: string;
    courses: Course[];
    theme: 'purple' | 'red' | 'blue'; // purple=master, red=live, blue=recorded
    id: string;
}

export default function CourseCategorySection({ title, subtitle, courses, theme, id }: CourseCategorySectionProps) {
    if (!courses || courses.length === 0) return null;

    const themeColors = {
        purple: {
            badge: 'bg-purple-500',
            text: 'text-purple-400',
            gradient: 'from-purple-400 to-pink-400',
            border: 'hover:border-purple-500/50',
            shadow: 'hover:shadow-purple-500/10',
            button: 'text-purple-400 hover:bg-purple-500 hover:text-white',
        },
        red: {
            badge: 'bg-red-500',
            text: 'text-red-400',
            gradient: 'from-red-400 to-orange-400',
            border: 'hover:border-red-500/50',
            shadow: 'hover:shadow-red-500/10',
            button: 'text-red-400 hover:bg-red-500 hover:text-white',
        },
        blue: {
            badge: 'bg-blue-500',
            text: 'text-blue-400',
            gradient: 'from-blue-400 to-cyan-400',
            border: 'hover:border-blue-500/50',
            shadow: 'hover:shadow-blue-500/10',
            button: 'text-blue-400 hover:bg-blue-500 hover:text-white',
        }
    };

    const currentTheme = themeColors[theme];

    return (
        <section id={id} className="py-16 relative">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-white mb-4"
                        >
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.gradient}`}>
                                {title}
                            </span>
                        </motion.h2>
                        {subtitle && (
                            <p className="text-slate-400 text-lg">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="mt-8 md:mt-0">
                        <Link href="/courses">
                            <button className={`${currentTheme.text} font-semibold flex items-center gap-2 transition-colors hover:opacity-80`}>
                                View All <FaArrowRight />
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={`group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden ${currentTheme.border} hover:shadow-2xl ${currentTheme.shadow} transition-all duration-300`}
                        >
                            {/* Thumbnail */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={course.thumbnail || "https://via.placeholder.com/400x300"}
                                    alt={course.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Link href={`/courses/${course._id}`}>
                                        <button className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-colors">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${currentTheme.badge}`}>
                                        {course.courseType || 'Course'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <FaChalkboardTeacher className={currentTheme.text} />
                                        <span>{course.instructorName || 'Expert'}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                                        <FaStar /> <span>{course.rating || '4.8'}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                    {course.title}
                                </h3>

                                <div className="flex items-center justify-between text-sm text-slate-400 mb-6">
                                    <div className="flex items-center gap-2">
                                        <FaUsers /> <span>{course.enrolledStudents || 0} Students</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaClock /> <span>{course.duration || '10h'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                    <div>
                                        <span className="text-2xl font-bold text-white">₹{course.price}</span>
                                        {course.originalPrice && (
                                            <span className="text-sm text-slate-500 line-through ml-2">₹{course.originalPrice}</span>
                                        )}
                                    </div>
                                    <Link href={`/courses/${course._id}`}>
                                        <button className={`p-2 rounded-full bg-slate-800 ${currentTheme.button} transition-all`}>
                                            <FaArrowRight />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
