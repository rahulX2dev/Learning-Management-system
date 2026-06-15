'use client';

import { motion } from 'framer-motion';
import { FaLaptopCode, FaCertificate, FaChalkboardTeacher, FaProjectDiagram, FaRocket, FaUserShield } from 'react-icons/fa';

const features = [
    {
        icon: <FaLaptopCode />,
        title: 'Interactive Coding Labs',
        description: 'Practice what you learn with our built-in browser IDE. No setup required.',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: <FaChalkboardTeacher />,
        title: 'Expert Mentorship',
        description: 'Get 1-on-1 guidance from industry professionals who have worked at top tech companies.',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: <FaProjectDiagram />,
        title: 'Real-World Projects',
        description: 'Build a portfolio of production-ready applications to showcase to recruiters.',
        color: 'from-orange-500 to-red-500'
    },
    {
        icon: <FaCertificate />,
        title: 'Verified Certificates',
        description: 'Earn recognized certificates upon completion to boost your LinkedIn profile.',
        color: 'from-green-500 to-emerald-500'
    },
    {
        icon: <FaRocket />,
        title: 'Career Support',
        description: 'Resume reviews, mock interviews, and job referrals to help you get hired.',
        color: 'from-yellow-500 to-orange-500'
    },
    {
        icon: <FaUserShield />,
        title: 'Lifetime Access',
        description: 'Pay once and get lifetime access to course materials and future updates.',
        color: 'from-indigo-500 to-blue-500'
    }
];

export default function FeatureSection() {
    return (
        <section className="py-24 bg-[#020617] relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 rounded-full blur-[100px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">LearnHub?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-lg"
                    >
                        We provide everything you need to go from beginner to pro. Our platform is designed to make learning efficient, engaging, and effective.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
