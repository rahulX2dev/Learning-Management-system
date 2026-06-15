'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaCalendarAlt, FaUser, FaSearch, FaTag, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const [allTags, setAllTags] = useState<string[]>(['All']);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('/api/blogs');
                if (response.data.success) {
                    setBlogs(response.data.blogs);
                    setFilteredBlogs(response.data.blogs);

                    // Extract unique tags
                    const tags = new Set<string>(['All']);
                    response.data.blogs.forEach((blog: Blog) => {
                        blog.tags.forEach(tag => tags.add(tag));
                    });
                    setAllTags(Array.from(tags));
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    useEffect(() => {
        let result = blogs;

        // Filter by search query
        if (searchQuery) {
            result = result.filter(blog =>
                blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by tag
        if (selectedTag !== 'All') {
            result = result.filter(blog => blog.tags.includes(selectedTag));
        }

        setFilteredBlogs(result);
    }, [searchQuery, selectedTag, blogs]);

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <Navbar />

            {/* Header Section */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px]" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400">Blog</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg max-w-2xl mx-auto mb-12"
                    >
                        Insights, tutorials, and updates from the world of technology and education.
                    </motion.p>

                    {/* Search and Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedTag === tag
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                                                : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="pb-24">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredBlogs.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBlogs.map((blog, index) => (
                                <motion.div
                                    key={blog._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 flex flex-col h-full"
                                >
                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={blog.coverImage || 'https://via.placeholder.com/800x400'}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                            {blog.tags.slice(0, 3).map((tag, i) => (
                                                <span key={i} className="px-3 py-1 bg-primary-500/20 backdrop-blur-md text-primary-300 text-xs font-medium rounded-full border border-primary-500/20">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
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
                                        <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
                                            {blog.excerpt}
                                        </p>

                                        <Link href={`/blogs/${blog._id}`} className="inline-flex items-center text-primary-400 font-semibold text-sm group-hover:gap-2 transition-all mt-auto">
                                            Read Full Article <FaArrowRight className="ml-1" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
                            <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
