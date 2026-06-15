'use client';

import { motion } from 'framer-motion';
import { FaSearch, FaPlayCircle, FaCode, FaCertificate } from 'react-icons/fa';

const steps = [
    {
        id: 1,
        icon: <FaSearch />,
        title: 'Discover',
        description: 'Browse our catalog of world-class courses and find your path.',
        color: 'bg-blue-500'
    },
    {
        id: 2,
        icon: <FaPlayCircle />,
        title: 'Learn',
        description: 'Watch high-quality video lectures and follow along with experts.',
        color: 'bg-purple-500'
    },
    {
        id: 3,
        icon: <FaCode />,
        title: 'Practice',
        description: 'Solve real-world challenges in our interactive coding labs.',
        color: 'bg-pink-500'
    },
    {
        id: 4,
        icon: <FaCertificate />,
        title: 'Succeed',
        description: 'Earn certificates and build a portfolio to land your dream job.',
        color: 'bg-green-500'
    }
];

export default function HowItWorksSection() {
    return (
        <section className="py-24 bg-[#020617] relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Works</span>
                    </motion.h2>
                    <p className="text-slate-400 text-lg">Your journey to mastery in 4 simple steps</p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative flex flex-col items-center text-center"
                            >
                                <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center text-white text-3xl shadow-xl mb-6 border-4 border-[#020617] relative z-10`}>
                                    {step.icon}
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-sm font-bold border-2 border-[#020617]">
                                        {step.id}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-slate-400">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
