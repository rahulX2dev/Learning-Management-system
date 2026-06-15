'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import CourseCard from '@/components/CourseCard';
import { FaGraduationCap, FaVideo, FaBroadcastTower, FaSearch, FaFilter } from 'react-icons/fa';

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('all');
    const [category, setCategory] = useState('all');
    const [level, setLevel] = useState('all');
    const [search, setSearch] = useState('');
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

    useEffect(() => {
        fetchCourses();
        fetchUserEnrollments();
    }, [category, level, search]);

    const fetchUserEnrollments = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            if (response.data.success) {
                setEnrolledCourseIds(response.data.user.enrolledCourses || []);
            }
        } catch (error) {
            // User might not be logged in, ignore error
            console.log('User not logged in or error fetching enrollments');
        }
    };

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (category !== 'all') params.append('category', category);
            if (level !== 'all') params.append('level', level);
            if (search) params.append('search', search);

            const response = await axios.get(`/api/courses?${params}`);
            if (response.data.success) {
                setCourses(response.data.courses);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter courses by type
    const masterclasses = courses.filter((c: any) => c.courseType === 'masterclass');
    const recordedClasses = courses.filter((c: any) => c.courseType === 'recorded' || !c.courseType);
    const liveClasses = courses.filter((c: any) => c.courseType === 'live');

    const categories = ['all', 'programming', 'design', 'business', 'marketing', 'data-science', 'other'];
    const levels = ['all', 'beginner', 'intermediate', 'advanced'];

    const renderCourseSection = (title: string, description: string, courses: any[], icon: any, iconColor: string) => {
        if (courses.length === 0) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${iconColor} flex items-center justify-center mr-4`}>
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold gradient-text">{title}</h2>
                        <p className="text-slate-400 text-sm">{description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course: any, index: number) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <CourseCard
                                course={course}
                                isPurchased={enrolledCourseIds.includes(course._id)}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    };

    return (
        <div className="py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-bold gradient-text mb-4">
                    Explore Courses
                </h1>
                <p className="text-slate-400 text-lg">
                    Discover amazing courses to enhance your skills
                </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-xl p-6 mb-12"
            >
                {/* Search Bar */}
                <div className="relative mb-6">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Course Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                            <FaFilter className="mr-2" />
                            Course Type
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                            <option value="all">All Types</option>
                            <option value="masterclass">Master Classes</option>
                            <option value="recorded">Recorded Classes</option>
                            <option value="live">Live Classes</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                            <FaFilter className="mr-2" />
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Level */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                            <FaFilter className="mr-2" />
                            Difficulty
                        </label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        >
                            {levels.map((lvl) => (
                                <option key={lvl} value={lvl}>
                                    {lvl === 'all' ? 'All Levels' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    {/* Course Sections */}
                    {(selectedType === 'all' || selectedType === 'masterclass') && renderCourseSection(
                        'Master Classes',
                        'Premium comprehensive courses with in-depth content',
                        masterclasses,
                        <FaGraduationCap className="text-white text-2xl" />,
                        'from-purple-500 to-pink-500'
                    )}

                    {(selectedType === 'all' || selectedType === 'recorded') && renderCourseSection(
                        'Recorded Classes',
                        'Learn at your own pace with pre-recorded sessions',
                        recordedClasses,
                        <FaVideo className="text-white text-2xl" />,
                        'from-blue-500 to-cyan-500'
                    )}

                    {(selectedType === 'all' || selectedType === 'live') && renderCourseSection(
                        'Upcoming Live Classes',
                        'Join interactive live sessions with expert instructors',
                        liveClasses,
                        <FaBroadcastTower className="text-white text-2xl" />,
                        'from-orange-500 to-red-500'
                    )}

                    {/* No Results */}
                    {courses.length === 0 && (
                        <div className="text-center py-20">
                            <h3 className="text-2xl text-slate-400 mb-4">No courses found</h3>
                            <p className="text-slate-500">Try adjusting your search or filters</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
