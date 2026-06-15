'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
    icon: ReactNode;
    color: 'blue' | 'purple' | 'slate';
    testimonial?: {
        quote: string;
        author: string;
        role: string;
    };
}

export default function AuthLayout({ children, title, subtitle, icon, color, testimonial }: AuthLayoutProps) {
    const colorThemes = {
        blue: {
            gradient: 'from-blue-600 to-cyan-500',
            bgGradient: 'from-blue-600/20',
            text: 'text-blue-400',
            blob: 'bg-blue-500/10',
            iconBg: 'from-blue-500 to-cyan-500',
            shadow: 'shadow-blue-500/20'
        },
        purple: {
            gradient: 'from-purple-600 to-pink-500',
            bgGradient: 'from-purple-600/20',
            text: 'text-purple-400',
            blob: 'bg-purple-500/10',
            iconBg: 'from-purple-500 to-pink-500',
            shadow: 'shadow-purple-500/20'
        },
        slate: {
            gradient: 'from-slate-600 to-slate-500',
            bgGradient: 'from-slate-600/20',
            text: 'text-slate-400',
            blob: 'bg-slate-500/10',
            iconBg: 'from-slate-600 to-slate-500',
            shadow: 'shadow-slate-500/20'
        }
    };

    const theme = colorThemes[color];

    return (
        <div className="min-h-screen flex bg-[#020617] overflow-hidden">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 relative z-10">
                <div className="mb-8">
                    <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group">
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Portals
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
                            <p className="text-slate-400 text-lg">{subtitle}</p>
                        </div>

                        {children}
                    </motion.div>
                </div>

                <div className="mt-8 text-center text-slate-500 text-xs">
                    &copy; {new Date().getFullYear()} LearnHub. All rights reserved.
                </div>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:flex w-1/2 bg-[#020617] relative overflow-hidden items-center justify-center border-l border-slate-800">
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} via-transparent to-transparent opacity-40`}></div>
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 text-center p-12 max-w-lg"
                >
                    <div className={`w-24 h-24 bg-gradient-to-tr ${theme.iconBg} rounded-2xl mx-auto mb-8 shadow-2xl ${theme.shadow} flex items-center justify-center transform rotate-12`}>
                        <div className="text-4xl text-white transform -rotate-12">
                            {icon}
                        </div>
                    </div>

                    {testimonial && (
                        <blockquote className="relative">
                            <p className="text-xl font-medium text-white mb-4 leading-relaxed">
                                "{testimonial.quote}"
                            </p>
                            <footer className="text-slate-400">
                                <div className="font-bold text-white">{testimonial.author}</div>
                                <div className="text-sm">{testimonial.role}</div>
                            </footer>
                        </blockquote>
                    )}
                </motion.div>

                {/* Animated Blobs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={`absolute top-1/4 right-1/4 w-96 h-96 ${theme.blob} rounded-full blur-[100px]`}
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className={`absolute bottom-1/4 left-1/4 w-80 h-80 ${theme.blob} rounded-full blur-[80px] opacity-60`}
                />
            </div>
        </div>
    );
}
