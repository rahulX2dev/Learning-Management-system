'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Ready to Start Your <br />
                        <span className="text-yellow-300">Coding Journey?</span>
                    </h2>
                    <p className="text-xl text-blue-100 mb-10">
                        Join 10,000+ developers who are building the future. Get unlimited access to all courses, projects, and mentorship.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-lg"
                            >
                                Get Started for Free <FaArrowRight />
                            </motion.button>
                        </Link>
                        <Link href="/courses">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-blue-700/50 text-white font-bold rounded-xl border border-blue-400/30 hover:bg-blue-700 transition-all text-lg backdrop-blur-sm"
                            >
                                View Pricing
                            </motion.button>
                        </Link>
                    </div>

                    <p className="mt-6 text-blue-200 text-sm">
                        No credit card required for free trial. Cancel anytime.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
