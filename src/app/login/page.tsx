'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaChalkboardTeacher, FaArrowRight, FaShieldAlt } from 'react-icons/fa';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden p-4">
            {/* Dynamic Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 via-[#020617] to-[#020617]" />
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 left-[20%] w-[30%] h-[30%] bg-cyan-600/10 rounded-full blur-[80px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-6xl relative z-10"
            >
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">LearnHub</span>
                        </h1>
                        <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                            Your gateway to knowledge. Choose your portal to get started.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 px-4">
                    {/* Student Portal */}
                    <LoginCard
                        href="/user/login"
                        icon={<FaUserGraduate />}
                        title="Student Portal"
                        description="Access your enrolled courses, track progress, and complete assignments."
                        color="blue"
                        delay={0.3}
                    />

                    {/* Instructor Portal */}
                    <LoginCard
                        href="/instructor/login"
                        icon={<FaChalkboardTeacher />}
                        title="Instructor Portal"
                        description="Create courses, manage content, and track student performance."
                        color="purple"
                        delay={0.4}
                    />

                    {/* Admin Portal */}
                    <LoginCard
                        href="/admin/login"
                        icon={<FaShieldAlt />}
                        title="Admin Portal"
                        description="Manage users, approve courses, and oversee platform operations."
                        color="slate"
                        delay={0.5}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} LearnHub. All rights reserved.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}

function LoginCard({ href, icon, title, description, color, delay }: any) {
    const colorClasses: any = {
        blue: {
            border: "group-hover:border-blue-500/50",
            shadow: "group-hover:shadow-blue-500/20",
            text: "text-blue-400",
            bg: "bg-blue-500/10",
            iconBg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
            button: "text-blue-400 group-hover:translate-x-1"
        },
        purple: {
            border: "group-hover:border-purple-500/50",
            shadow: "group-hover:shadow-purple-500/20",
            text: "text-purple-400",
            bg: "bg-purple-500/10",
            iconBg: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
            button: "text-purple-400 group-hover:translate-x-1"
        },
        slate: {
            border: "group-hover:border-slate-500/50",
            shadow: "group-hover:shadow-slate-500/20",
            text: "text-slate-400",
            bg: "bg-slate-500/10",
            iconBg: "bg-gradient-to-br from-slate-500/20 to-gray-500/20",
            button: "text-slate-400 group-hover:translate-x-1"
        }
    };

    const theme = colorClasses[color];

    return (
        <Link href={href} className="block h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`h-full bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl cursor-pointer group transition-all duration-300 hover:shadow-2xl ${theme.border} ${theme.shadow}`}
            >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${theme.iconBg} ${theme.text} ring-1 ring-white/10`}>
                    {icon}
                </div>

                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                    {title}
                </h2>

                <p className="text-slate-400 mb-8 leading-relaxed h-20">
                    {description}
                </p>

                <div className={`flex items-center font-bold text-sm uppercase tracking-wider transition-all ${theme.button}`}>
                    Enter Portal <FaArrowRight className="ml-2" />
                </div>
            </motion.div>
        </Link>
    );
}
