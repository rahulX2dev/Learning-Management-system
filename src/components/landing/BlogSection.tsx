'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight, FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';
import axios from 'axios';

interface Blog {
    _id: string;
    title: string;
    excerpt: string;
    coverImage: string;
    author: {
        name: string;
    };
    tags: string[];
    createdAt: string;
}

export default function BlogSection() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('/api/blogs');
                if (response.data.success) {
                    // Get only the latest 3 blogs
                    setBlogs(response.data.blogs.slice(0, 3));
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-[#020617] relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (blogs.length === 0) return null;

    return (
        <section className="py-24 bg-[#020617] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary-400 font-semibold tracking-wider uppercase text-sm"
                    >
                        Latest Updates
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4"
                    >
                        From Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400">Blog</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 max-w-2xl mx-auto"
                    >
                        Stay updated with the latest trends in technology, coding tutorials, and platform news.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={blog._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={blog.coverImage || 'https://via.placeholder.com/800x400'}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                    {blog.tags.slice(0, 2).map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-primary-500/20 backdrop-blur-md text-primary-300 text-xs font-medium rounded-full border border-primary-500/20">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <FaCalendarAlt className="text-primary-400" />
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaUser className="text-primary-400" />
                                        {blog.author?.name || 'Admin'}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors">
                                    {blog.title}
                                </h3>
                                <p className="text-slate-400 text-sm mb-6 line-clamp-3">
                                    {blog.excerpt}
                                </p>

                                <Link href={`/blogs/${blog._id}`} className="inline-flex items-center text-primary-400 font-semibold text-sm group-hover:gap-2 transition-all">
                                    Read More <FaArrowRight className="ml-1" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/blogs">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-full transition-colors border border-slate-700"
                        >
                            View All Posts
                        </motion.button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
