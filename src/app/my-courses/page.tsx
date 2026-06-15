'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CourseCard from '@/components/CourseCard';
import { FaGraduationCap, FaTrophy, FaFire, FaClock, FaPlay, FaCertificate, FaStar, FaRocket } from 'react-icons/fa';
import Link from 'next/link';

export default function MyCoursesPage() {
    const [user, setUser] = useState<any>(null);
    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
    const [issuing, setIssuing] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('in-progress');

    useEffect(() => {
        fetchUserAndCourses();
    }, []);

    const fetchUserAndCourses = async () => {
        try {
            // Get user data
            const userResponse = await axios.get('/api/auth/me');
            if (userResponse.data.success) {
                setUser(userResponse.data.user);

                // Get all courses
                const coursesResponse = await axios.get('/api/courses');
                if (coursesResponse.data.success) {
                    // Filter enrolled courses
                    const enrolled = coursesResponse.data.courses.filter((course: any) => userResponse.data.user.enrolledCourses.includes(course._id));

                    // Map progress from user's enrolledProgress (if present)
                    const progressMap = (userResponse.data.user.enrolledProgress || []).reduce((acc: any, p: any) => { acc[String(p.course)] = p.progress; return acc; }, {} as any);

                    const coursesWithProgress = enrolled.map((course: any) => ({
                        ...course,
                        progress: progressMap[course._id] ?? 0
                    }));

                    setEnrolledCourses(coursesWithProgress);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Poll for progress updates every 5 seconds to provide near real-time updates
    useEffect(() => {
        const iv = setInterval(async () => {
            try {
                const me = await axios.get('/api/auth/me');
                if (me.data.success) {
                    const progressMap = (me.data.user.enrolledProgress || []).reduce((acc: any, p: any) => { acc[String(p.course)] = p.progress; return acc; }, {} as any);
                    setEnrolledCourses(prev => prev.map(c => ({ ...c, progress: progressMap[c._id] ?? c.progress ?? 0 })));
                }
            } catch (e) {
                // ignore polling errors
            }
        }, 5000);
        return () => clearInterval(iv);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#020617]">
                <div className="spinner"></div>
            </div>
        );
    }

    const lastAccessedCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : null;
    const completedCourses = enrolledCourses.filter((c: any) => c.progress === 100);
    const inProgressCourses = enrolledCourses.filter((c: any) => c.progress < 100);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                                Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{user?.name?.split(' ')[0]}</span>! 👋
                            </h1>
                            <p className="text-slate-400 text-lg max-w-2xl">
                                Your learning journey is on fire! Pick up where you left off or start something new.
                            </p>
                        </div>

                        <div className="flex gap-4 flex-wrap justify-center md:justify-end">
                            <StatCard icon={<FaGraduationCap />} value={enrolledCourses.length} label="Enrolled" color="blue" />
                            <StatCard icon={<FaTrophy />} value={completedCourses.length} label="Completed" color="yellow" />
                            <StatCard icon={<FaFire />} value="5" label="Day Streak" color="orange" />
                        </div>
                    </div>

                    {/* Continue Learning Hero */}
                    {lastAccessedCourse && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative rounded-3xl overflow-hidden group cursor-pointer border border-white/10 shadow-2xl"
                        >
                            <div className="absolute inset-0">
                                <img
                                    src={lastAccessedCourse.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
                                    alt={lastAccessedCourse.title}
                                    className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                            </div>

                            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center justify-between">
                                <div className="max-w-2xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                            Continue Learning
                                        </span>
                                        <span className="text-slate-300 text-sm flex items-center gap-1 font-medium">
                                            <FaClock className="text-blue-400" /> 2h 15m remaining
                                        </span>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                                        {lastAccessedCourse.title}
                                    </h2>

                                    <p className="text-slate-300 mb-8 line-clamp-2 text-lg">
                                        {lastAccessedCourse.description || "Master the concepts and build amazing projects with this comprehensive course."}
                                    </p>

                                    <div className="space-y-3 max-w-md">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-slate-300">Course Progress</span>
                                            <span className="text-blue-400">{lastAccessedCourse.progress}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                                style={{ width: `${lastAccessedCourse.progress}%` }}
                                            >
                                                <div className="absolute right-0 top-0 bottom-0 w-full animate-pulse bg-white/20" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link href={`/courses/${lastAccessedCourse._id}`}>
                                    <button className="group/btn relative px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                        <span className="relative z-10 flex items-center gap-2">
                                            Resume Learning <FaPlay className="text-sm" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-slate-800/50 p-1 rounded-xl backdrop-blur-sm border border-slate-700/50 inline-flex">
                        <TabButton active={activeTab === 'in-progress'} onClick={() => setActiveTab('in-progress')} icon={<FaRocket />}>In Progress</TabButton>
                        <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} icon={<FaTrophy />}>Completed</TabButton>
                        <TabButton active={activeTab === 'certificates'} onClick={() => setActiveTab('certificates')} icon={<FaCertificate />}>Certificates</TabButton>
                    </div>
                </div>

                {/* Content Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: 20 }}
                        className="min-h-[400px]"
                    >
                        {activeTab === 'in-progress' && (
                            inProgressCourses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {inProgressCourses.map((course: any) => (
                                        <motion.div key={course._id} variants={itemVariants}>
                                            <CourseCard course={course} isPurchased={true} progress={course.progress} />
                                            {course.progress >= 70 && (
                                                <div className="mt-4">
                                                    <CertificateButton course={course} issuing={issuing} setIssuing={setIssuing} />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={<FaRocket />}
                                    title="No courses in progress"
                                    message="Ready to start your learning journey? Explore our catalog!"
                                    actionLink="/courses"
                                    actionText="Browse Courses"
                                />
                            )
                        )}

                        {activeTab === 'completed' && (
                            completedCourses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {completedCourses.map((course: any) => (
                                        <motion.div key={course._id} variants={itemVariants}>
                                            <CourseCard course={course} isPurchased={true} progress={100} />
                                            <div className="mt-4">
                                                <CertificateButton course={course} issuing={issuing} setIssuing={setIssuing} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={<FaTrophy />}
                                    title="No completed courses yet"
                                    message="Keep learning! Your first completion is just around the corner."
                                />
                            )
                        )}

                        {activeTab === 'certificates' && (
                            <EmptyState
                                icon={<FaCertificate />}
                                title="No certificates earned yet"
                                message="Complete a course to earn your professional certificate."
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// Sub-components for cleaner code
const StatCard = ({ icon, value, label, color }: any) => {
    const colorClasses: any = {
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    };

    return (
        <div className={`p-4 rounded-2xl border backdrop-blur-sm flex items-center gap-4 min-w-[160px] ${colorClasses[color]}`}>
            <div className={`p-3 rounded-xl bg-white/5 text-2xl`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs font-medium opacity-80 uppercase tracking-wide">{label}</p>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, children, icon }: any) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${active
                ? 'bg-slate-700 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
    >
        {icon} {children}
    </button>
);

const EmptyState = ({ icon, title, message, actionLink, actionText }: any) => (
    <div className="flex flex-col items-center justify-center py-20 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700/50">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-4xl text-slate-600 mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-center max-w-md mb-8">{message}</p>
        {actionLink && (
            <Link href={actionLink}>
                <button className="btn-primary px-8 py-3 rounded-xl">
                    {actionText}
                </button>
            </Link>
        )}
    </div>
);

const CertificateButton = ({ course, issuing, setIssuing }: any) => (
    <button
        className="w-full py-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 text-yellow-400 rounded-xl font-semibold hover:bg-yellow-500/20 transition-all flex items-center justify-center gap-2 group"
        disabled={issuing === String(course._id)}
        onClick={async () => {
            try {
                setIssuing(String(course._id));
                const res = await fetch('/api/certificates/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courseId: course._id }) });
                const j = await res.json();
                if (j.success && j.issuedId) {
                    const d = await fetch(`/api/certificates/download?issuedId=${j.issuedId}`);
                    const dd = await d.json();
                    if (dd.success) {
                        const blob = new Blob([JSON.stringify(dd.certificate, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                    } else {
                        alert(dd.error || 'Could not download certificate');
                    }
                } else {
                    alert(j.error || 'Could not generate certificate');
                }
            } catch (e) {
                console.error(e);
                alert('Error generating certificate');
            } finally {
                setIssuing(null);
            }
        }}
    >
        {issuing === String(course._id) ? (
            <>Generating...</>
        ) : (
            <>
                <FaCertificate className="group-hover:scale-110 transition-transform" />
                Download Certificate
            </>
        )}
    </button>
);
