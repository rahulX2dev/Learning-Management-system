'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaEnvelope, FaLock, FaArrowRight, FaUserGraduate } from 'react-icons/fa';
import AuthLayout from '@/components/auth/AuthLayout';

export default function UserLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/api/auth/login', formData);

            if (response.data.success) {
                if (response.data.user.role === 'student' || response.data.user.role === 'user') {
                    router.push('/courses');
                } else {
                    setError('Please use the Instructor or Admin login portal.');
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Student Login"
            subtitle="Welcome back! Continue your learning journey."
            icon={<FaUserGraduate />}
            color="blue"
            testimonial={{
                quote: "This platform has completely transformed the way I learn. The courses are top-notch and the community is amazing.",
                author: "Sarah Johnson",
                role: "Full Stack Developer"
            }}
        >
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-6"
                >
                    <FaLock /> {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
                                <FaEnvelope />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                                placeholder="student@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
                                <FaLock />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 mr-2" />
                        Remember me
                    </label>
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Login <FaArrowRight className="text-sm" />
                        </>
                    )}
                </motion.button>
            </form>

            <div className="mt-8 text-center text-slate-400 text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                    Register Now
                </Link>
            </div>

            {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs text-slate-400 text-center">
                    <p className="font-semibold mb-1 text-slate-300">Demo Credentials:</p>
                    <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-300">student@example.com</code> / <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-300">student123</code>
                </div>
            )}
        </AuthLayout>
    );
}
