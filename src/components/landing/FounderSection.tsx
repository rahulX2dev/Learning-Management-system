'use client';

import { motion } from 'framer-motion';
import { FaQuoteLeft, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

export default function FounderSection() {
    return (
        <section className="py-24 bg-[#020617] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 relative"
                    >
                        <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                            {/* Placeholder for Founder Image - Replace with actual image */}
                            <img
                                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop"
                                alt="Founder"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />

                            <div className="absolute bottom-0 left-0 w-full p-8">
                                <h3 className="text-2xl font-bold text-white">Rahul Sharma</h3>
                                <p className="text-blue-400 font-medium">Founder & Lead Instructor</p>
                            </div>
                        </div>

                        {/* Floating Quote Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="absolute -bottom-8 -right-8 md:right-0 bg-slate-900/90 backdrop-blur-xl p-6 rounded-xl border border-slate-700 shadow-xl max-w-xs hidden md:block"
                        >
                            <FaQuoteLeft className="text-3xl text-blue-500 mb-4 opacity-50" />
                            <p className="text-slate-300 italic mb-4">
                                "My mission is to bridge the gap between academic learning and industry requirements. We don't just teach code; we build careers."
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-slate-400 hover:text-white transition-colors"><FaLinkedin size={20} /></a>
                                <a href="#" className="text-slate-400 hover:text-white transition-colors"><FaTwitter size={20} /></a>
                                <a href="#" className="text-slate-400 hover:text-white transition-colors"><FaGithub size={20} /></a>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Content Side */}
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Visionary</span>
                            </h2>

                            <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                                <p>
                                    Hello! I'm Rahul, a Senior Full Stack Developer with over 10 years of experience building scalable applications for top tech companies.
                                </p>
                                <p>
                                    I started LearnHub because I saw a disconnect in how programming is taught. Most courses focus on syntax, but real-world development is about problem-solving, architecture, and best practices.
                                </p>
                                <p>
                                    At LearnHub, we've curated a curriculum that mimics a real job environment. You won't just watch videos; you'll build production-ready apps, review code, and deploy to the cloud.
                                </p>
                            </div>

                            <div className="mt-10 grid grid-cols-2 gap-6">
                                <div>
                                    <div className="text-3xl font-bold text-white mb-1">10+</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-wider">Years Experience</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white mb-1">50k+</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-wider">Students Mentored</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white mb-1">100+</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-wider">Projects Built</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white mb-1">4.9</div>
                                    <div className="text-sm text-slate-500 uppercase tracking-wider">Instructor Rating</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
