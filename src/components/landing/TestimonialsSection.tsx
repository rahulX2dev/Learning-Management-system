'use client';

import { motion } from 'framer-motion';
import { FaQuoteRight, FaStar } from 'react-icons/fa';

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Frontend Developer at Google",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        content: "The curriculum is perfectly structured. I went from knowing nothing about React to building complex applications in just 3 months. The mentorship was a game-changer.",
        rating: 5
    },
    {
        name: "Michael Chen",
        role: "Full Stack Engineer at Amazon",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        content: "I've taken many online courses, but LearnHub stands out because of its focus on real-world projects. The code reviews helped me write clean, production-ready code.",
        rating: 5
    },
    {
        name: "Emily Davis",
        role: "Freelance Developer",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        content: "The community here is amazing. Whenever I got stuck, there was always someone to help. I landed my first freelance client thanks to the portfolio I built here.",
        rating: 5
    }
];

export default function TestimonialsSection() {
    return (
        <section className="py-24 bg-[#020617] relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-blue-500/5 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Developers</span>
                    </h2>
                    <p className="text-slate-400">See what our students have to say about their learning experience</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl relative"
                        >
                            <FaQuoteRight className="absolute top-8 right-8 text-slate-700 text-4xl opacity-50" />

                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-14 h-14 rounded-full border-2 border-blue-500"
                                />
                                <div>
                                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                                    <p className="text-slate-400 text-sm">{testimonial.role}</p>
                                </div>
                            </div>

                            <div className="flex text-yellow-400 mb-4 text-sm">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <FaStar key={i} />
                                ))}
                            </div>

                            <p className="text-slate-300 leading-relaxed">
                                "{testimonial.content}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
