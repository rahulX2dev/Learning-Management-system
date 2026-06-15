'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaCalendarAlt, FaUser, FaTag, FaArrowLeft, FaShareAlt } from 'react-icons/fa';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Blog {
    _id: string;
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
    author: {
        name: string;
    };
    tags: string[];
    createdAt: string;
}

export default function BlogPostPage() {
    const params = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                // Note: We might need to update the API to support fetching a single blog by ID if not already supported
                // Assuming the API structure is /api/blogs/[id] or we filter from all blogs for now
                // Let's check if we have a specific endpoint or need to fetch all

                // Trying specific endpoint first
                try {
                    const response = await axios.get(`/api/blogs/${params.id}`);
                    if (response.data.success) {
                        setBlog(response.data.blog);
                    }
                } catch (err) {
                    // Fallback: fetch all and find (less efficient but works if no specific endpoint yet)
                    const response = await axios.get('/api/blogs');
                    if (response.data.success) {
                        const foundBlog = response.data.blogs.find((b: Blog) => b._id === params.id);
                        setBlog(foundBlog || null);
                    }
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchBlog();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
                <Link href="/blogs" className="text-primary-400 hover:text-primary-300 flex items-center gap-2">
                    <FaArrowLeft /> Back to Blogs
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <Navbar />

            {/* Hero Image */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617] z-10" />
                <img
                    src={blog.coverImage || 'https://via.placeholder.com/1200x600'}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />

                <div className="absolute bottom-0 left-0 w-full z-20 pb-16 pt-32 bg-gradient-to-t from-[#020617] to-transparent">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto"
                        >
                            <Link href="/blogs" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
                                <FaArrowLeft className="mr-2" /> Back to Blogs
                            </Link>

                            <div className="flex flex-wrap gap-3 mb-6">
                                {blog.tags.map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-primary-500/20 backdrop-blur-md text-primary-300 text-sm font-medium rounded-full border border-primary-500/20">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                {blog.title}
                            </h1>

                            <div className="flex items-center gap-6 text-slate-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white">
                                        <FaUser />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Written by</p>
                                        <p className="text-white font-medium">{blog.author?.name || 'Admin'}</p>
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-slate-700" />
                                <div>
                                    <p className="text-sm text-slate-500">Published on</p>
                                    <p className="text-white font-medium">{new Date(blog.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="prose prose-lg prose-invert max-w-none"
                        >
                            <ReactMarkdown>{blog.content}</ReactMarkdown>
                        </motion.div>

                        {/* Share & Tags Footer */}
                        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4">
                                <span className="text-slate-400 font-medium">Share this article:</span>
                                <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition-colors">
                                    <FaShareAlt />
                                </button>
                                {/* Add more social share buttons as needed */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
