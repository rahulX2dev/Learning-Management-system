'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaClock, FaUsers, FaStar, FaPlay, FaCheckCircle, FaBook } from 'react-icons/fa';
import PaymentModal from '@/components/PaymentModal';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [enrolled, setEnrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);

    useEffect(() => {
        fetchCourse();
        fetchCoupons();
        checkAuth();
    }, [params.id]);

    const fetchCoupons = async () => {
        try {
            const res = await axios.get(`/api/coupons?courseId=${params.id}`);
            if (res.data.success) {
                // filter active and not expired
                const now = new Date();
                const active = (res.data.coupons || []).filter((c: any) => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > now));
                setCoupons(active);
            }
        } catch (err) {
            console.error('Failed to fetch coupons', err);
        }
    };

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            if (response.data.success) {
                setUser(response.data.user);
                // mark enrolled state if user's enrolledCourses contains this course
                if (response.data.user.enrolledCourses?.includes(params.id)) {
                    setEnrolled(true);
                }
            }
        } catch (error) {
            console.error('Error checking auth:', error);
        }
    };

    const fetchCourse = async () => {
        try {
            const response = await axios.get(`/api/courses/${params.id}`);
            if (response.data.success) {
                setCourse(response.data.course);
            }
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = () => {
        if (!user) {
            router.push('/user/login');
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = () => {
        setEnrolled(true);
        fetchCourse();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl text-slate-400">Course not found</h2>
            </div>
        );
    }

    const totalDuration = course.modules?.reduce((acc: number, mod: any) => acc + mod.duration, 0) || 120;

    return (
        <div className="py-12">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-8 mb-8"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.level === 'beginner' ? 'bg-green-500' :
                                course.level === 'intermediate' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                }`}>
                                {course.level}
                            </span>
                            <span className="text-slate-400">{course.category}</span>
                        </div>

                        <h1 className="text-4xl font-bold gradient-text mb-4">
                            {course.title}
                        </h1>

                        <p className="text-slate-300 text-lg mb-6">
                            {course.description}
                        </p>

                        {/* Instructor */}
                        {course.instructor && (
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl">
                                    {course.instructor.name?.charAt(0).toUpperCase() || 'I'}
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Instructor</p>
                                    <p className="text-white font-semibold">{course.instructor.name || course.instructorName}</p>
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                                <FaClock className="text-primary-400 text-2xl mx-auto mb-2" />
                                <p className="text-slate-400 text-sm">Duration</p>
                                <p className="text-white font-semibold">{totalDuration} min</p>
                            </div>

                            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                                <FaUsers className="text-secondary-400 text-2xl mx-auto mb-2" />
                                <p className="text-slate-400 text-sm">Students</p>
                                <p className="text-white font-semibold">{course.enrolledStudents}</p>
                            </div>

                            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                                <FaStar className="text-yellow-400 text-2xl mx-auto mb-2" />
                                <p className="text-slate-400 text-sm">Rating</p>
                                <p className="text-white font-semibold">{course.rating.toFixed(1)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Enroll Card */}
                    <div className="flex items-center justify-center">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="glass p-8 rounded-xl w-full max-w-sm"
                        >
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center opacity-80">
                                    <FaPlay className="text-4xl text-white" />
                                </div>

                                {course.price === 0 ? (
                                    <p className="text-3xl font-bold text-green-400 mb-2">Free Course</p>
                                ) : (
                                    <p className="text-3xl font-bold gradient-text mb-2">₹{course.price}</p>
                                )}
                                {/* Coupon Ads */}
                                {coupons.length > 0 && (
                                    <div className="mt-4 bg-amber-900/20 border border-amber-700 rounded-lg p-3 text-left">
                                        <p className="text-sm text-amber-200 font-semibold">Active Offers</p>
                                        <div className="mt-2 space-y-2">
                                            {coupons.map((c: any) => (
                                                <div key={c._id} className="flex items-center justify-between bg-amber-900/10 p-2 rounded">
                                                    <div>
                                                        <p className="text-sm text-white font-semibold">{c.code} • {c.discountPercent ? `${c.discountPercent}% off` : c.amountOff ? `₹${c.amountOff} off` : ''}</p>
                                                        <p className="text-xs text-amber-200">Valid till {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <button onClick={() => { setSelectedCoupon(c.code); setShowPaymentModal(true); }} className="px-3 py-1 bg-amber-600 text-black rounded">Use</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {user?.role === 'admin' || user?.role === 'instructor' ? (
                                <div className="text-center">
                                    <div className="bg-slate-800/50 p-4 rounded-lg mb-4 border border-slate-700">
                                        <p className="text-slate-300 font-medium">Admin/Instructor View</p>
                                        <p className="text-xs text-slate-500 mt-1">You have full access to manage this course.</p>
                                    </div>
                                    <button
                                        onClick={() => router.push('/admin')}
                                        className="btn-secondary w-full"
                                    >
                                        Go to Dashboard
                                    </button>
                                </div>
                            ) : enrolled ? (
                                <div className="text-center">
                                    <FaCheckCircle className="text-green-400 text-5xl mx-auto mb-4" />
                                    <p className="text-green-400 font-semibold mb-4">You're enrolled!</p>
                                    <button className="btn-secondary w-full">
                                        Continue Learning
                                    </button>
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleEnroll}
                                    className="btn-primary w-full"
                                >
                                    Enroll Now
                                </motion.button>
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Course Modules */}
            {course.modules && course.modules.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center">
                        <FaBook className="mr-3" />
                        Course Curriculum
                    </h2>

                    <div className="space-y-4">
                        {course.modules.map((module: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-800/50 p-5 rounded-lg hover:bg-slate-800/70 transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                                            <p className="text-slate-400 text-sm">{module.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 text-sm flex items-center">
                                            <FaClock className="mr-1" />
                                            {module.duration} min
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                course={course}
                onSuccess={handlePaymentSuccess}
                initialCoupon={selectedCoupon || undefined}
            />
        </div>
    );
}
