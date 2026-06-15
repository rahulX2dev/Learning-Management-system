'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';

const faqs = [
    {
        question: "Is this platform suitable for beginners?",
        answer: "Absolutely! We have dedicated learning paths for absolute beginners that start from the very coding practices of programming and gradually move to advanced concepts."
    },
    {
        question: "Do I get a certificate after completion?",
        answer: "Yes, upon successfully completing a course and its projects, you will receive a verified certificate that you can share on LinkedIn and your resume."
    },
    {
        question: "How does the mentorship work?",
        answer: "Premium members get access to our mentorship program where you can schedule 1-on-1 calls with industry experts for code reviews, career advice, and doubt clearing."
    },
    {
        question: "Can I access the courses on mobile?",
        answer: "Yes, our platform is fully responsive. You can watch lectures and read materials on any device. However, for coding exercises, we recommend using a desktop or laptop."
    },
    {
        question: "What if I'm not satisfied with a course?",
        answer: "We offer a 7-day money-back guarantee for all our paid courses. If you're not happy with the content, simply reach out to support for a full refund."
    }
];

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-[#020617]">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                    <p className="text-slate-400">Everything you need to know about the platform</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/30"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                            >
                                <span className="text-lg font-medium text-white">{faq.question}</span>
                                <span className="text-blue-400">
                                    {activeIndex === index ? <FaMinus /> : <FaPlus />}
                                </span>
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-slate-800/50">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
