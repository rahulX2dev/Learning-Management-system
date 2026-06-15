'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaEnvelope, FaLock, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import AuthLayout from '@/components/auth/AuthLayout';

export default function AdminLoginPage() {
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
                if (response.data.user.role === 'admin') {
                    router.push('/admin');
                } else if (response.data.user.role === 'instructor') {
                    setError('Access denied. Instructors should use the Instructor Portal.');
                } else {
                    setError('Access denied. This portal is for administrators only.');
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
            title="Admin Login"
            subtitle="Secure access for platform administrators."
            icon={<FaShieldAlt />}
            color="slate"
            testimonial={{
                quote: "The admin dashboard gives us complete control over our educational ecosystem. It's powerful and intuitive.",
                author: "James Wilson",
                role: "Platform Manager"
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
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-300 transition-colors">
                                <FaEnvelope />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-300 transition-colors">
                                <FaLock />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent text-white placeholder-slate-500 transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-slate-600 focus:ring-slate-500 mr-2" />
                        Remember me
                    </label>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-bold rounded-xl shadow-lg shadow-slate-500/25 hover:shadow-slate-500/40 transform transition-all duration-300 flex items-center justify-center gap-2 text-lg"
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

            {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs text-slate-400 text-center">
                    <p className="font-semibold mb-1 text-slate-300">Demo Credentials:</p>
                    <code className="bg-slate-900 px-2 py-0.5 rounded text-slate-300">admin@example.com</code> / <code className="bg-slate-900 px-2 py-0.5 rounded text-slate-300">admin123</code>
                </div>
            )}
        </AuthLayout>
    );
}
