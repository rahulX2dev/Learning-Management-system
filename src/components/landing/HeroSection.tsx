'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight, FaRocket, FaPlay, FaCode, FaLaptopCode, FaStar } from 'react-icons/fa';

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#020617]">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -top-[20%] left-[10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        className="absolute top-[10%] -right-[10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"
                    />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8 backdrop-blur-sm hover:bg-blue-500/20 transition-colors cursor-default"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                #1 Learning Platform for Developers
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                                Master the Art of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                                    Modern Coding
                                </span>
                            </h1>

                            <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Unlock your potential with expert-led courses, real-time mentorship, and hands-on projects. Join a community of <span className="text-white font-semibold">10,000+ developers</span> building the future.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
                                <Link href="/courses">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center gap-3 transition-all overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        Explore Courses <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </Link>
                                <Link href="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:border-slate-600 backdrop-blur-sm flex items-center gap-2 transition-all"
                                    >
                                        <FaPlay className="text-xs" /> Watch Demo
                                    </motion.button>
                                </Link>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start gap-8 text-slate-500 text-sm font-medium border-t border-slate-800/50 pt-8">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#020617] overflow-hidden relative">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 5}`} alt="User" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#020617] flex items-center justify-center text-xs text-white font-bold">
                                            +2k
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <div className="flex text-yellow-400 text-xs mb-0.5">
                                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                        </div>
                                        <span className="text-slate-400">Trusted by 10k+ students</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Image/Visual */}
                    <div className="flex-1 relative hidden lg:block perspective-1000 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, rotateY: -10, rotateX: 5, scale: 0.9 }}
                            animate={{ opacity: 1, rotateY: -5, rotateX: 2, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative z-10 transform-style-3d"
                        >
                            <div className="relative w-full aspect-[4/3] mx-auto">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-3xl opacity-20 blur-3xl animate-pulse"></div>

                                {/* Main Card */}
                                <div className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                                    {/* Window Controls */}
                                    <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                        </div>
                                        <div className="px-3 py-1 bg-slate-800/50 rounded-md text-xs text-slate-400 font-mono flex items-center gap-2">
                                            <FaLaptopCode /> learning-platform.tsx
                                        </div>
                                    </div>

                                    {/* Code Content */}
                                    <div className="p-8 font-mono text-sm leading-relaxed overflow-hidden relative flex-1 text-left flex items-center">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f172a]/20 pointer-events-none" />

                                        <div className="grid grid-cols-2 gap-8 w-full items-center">
                                            <div className="space-y-1">
                                                <div className="text-purple-400">import <span className="text-white">React</span>, {'{'} <span className="text-yellow-300">useState</span> {'}'} from <span className="text-green-400">'react'</span>;</div>
                                                <div className="text-purple-400">import <span className="text-white">Confetti</span> from <span className="text-green-400">'canvas-confetti'</span>;</div>
                                                <br />
                                                <div className="text-purple-400">function <span className="text-blue-400">LevelUp</span>() {'{'}</div>
                                                <div className="pl-4 text-purple-400">const <span className="text-white">[xp, setXp]</span> = <span className="text-yellow-300">useState</span>(<span className="text-orange-400">0</span>);</div>
                                                <br />
                                                <div className="pl-4 text-purple-400">return (</div>
                                                <div className="pl-8 text-white">
                                                    &lt;<span className="text-red-400">div</span> className=<span className="text-green-400">"success-card"</span>&gt;
                                                </div>
                                                <div className="pl-12 text-white">
                                                    &lt;<span className="text-red-400">h1</span>&gt;You Mastered React!&lt;/<span className="text-red-400">h1</span>&gt;
                                                </div>
                                                <div className="pl-12 text-white">
                                                    &lt;<span className="text-red-400">p</span>&gt;XP Gained: {'{'}xp{'}'}&lt;/<span className="text-red-400">p</span>&gt;
                                                </div>
                                                <div className="pl-12 text-white">
                                                    &lt;<span className="text-red-400">Button</span> onClick={'() =>'} <span className="text-yellow-300">celebrate</span>()&gt;
                                                </div>
                                                <div className="pl-16 text-white">Claim Certificate</div>
                                                <div className="pl-12 text-white">&lt;/<span className="text-red-400">Button</span>&gt;</div>
                                                <div className="pl-8 text-white">&lt;/<span className="text-red-400">div</span>&gt;</div>
                                                <div className="pl-4 text-white">);</div>
                                                <div className="text-purple-400">{'}'}</div>
                                            </div>

                                            {/* Visual representation of code output */}
                                            <div className="flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800 p-8 aspect-square">
                                                <div className="text-center">
                                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                                        <FaRocket className="text-3xl text-white" />
                                                    </div>
                                                    <h3 className="text-white font-bold text-xl mb-2">Level Up!</h3>
                                                    <p className="text-slate-400 text-sm">You earned 500 XP</p>
                                                    <button className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-400 text-white text-sm font-bold rounded-lg transition-colors">
                                                        Claim Reward
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-6 -right-6 bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl z-20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                                            <FaRocket size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Daily Streak</div>
                                            <div className="font-bold text-white text-lg">14 Days 🔥</div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 15, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -bottom-8 -left-8 bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-2xl z-20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                            <FaCode size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Courses Completed</div>
                                            <div className="font-bold text-white text-lg">12 / 15 🎓</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
