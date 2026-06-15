'use client';

import { motion } from 'framer-motion';
import { FaUsers, FaBook, FaTrophy, FaGraduationCap } from 'react-icons/fa';

const stats = [
    { label: 'Active Students', value: '10k+', icon: <FaUsers />, color: 'text-blue-400' },
    { label: 'Courses Available', value: '500+', icon: <FaBook />, color: 'text-purple-400' },
    { label: 'Success Rate', value: '95%', icon: <FaTrophy />, color: 'text-yellow-400' },
    { label: 'Expert Instructors', value: '150+', icon: <FaGraduationCap />, color: 'text-green-400' },
];

export default function StatsSection() {
    return (
        <section className="py-10 bg-[#020617] border-y border-slate-800/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className={`text-3xl mb-3 ${stat.color} flex justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                                {stat.icon}
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
