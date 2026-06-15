'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    FaPlus, FaSave, FaTimes, FaGraduationCap, FaBlog, FaChartLine,
    FaCog, FaSignOutAlt, FaUsers, FaLayerGroup, FaVideo, FaSearch, FaTrash, FaEdit, FaCheckCircle, FaClipboardList
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InstructorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Data States
    const [stats, setStats] = useState({ batches: 0, students: 0, revenue: 0, blogs: 0 });
    const [batches, setBatches] = useState<any[]>([]);
    const [blogs, setBlogs] = useState<any[]>([]);

    // Modal States
    const [showCreateBatch, setShowCreateBatch] = useState(false);
    const [showCreateBlog, setShowCreateBlog] = useState(false);
    const [editBatchId, setEditBatchId] = useState<string | null>(null);
    const [editBlogId, setEditBlogId] = useState<string | null>(null);

    // Form States
    const [batchData, setBatchData] = useState({
        title: '',
        description: '',
        thumbnail: '',
        coverVideo: '',
        category: 'programming',
        level: 'beginner',
        price: 0,
        discount: 0,
        courseType: 'recorded',
        modules: [] as any[],
    });

    const [blogData, setBlogData] = useState({
        title: '',
        excerpt: '',
        content: '',
        tags: '',
        coverImage: '',
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                if (userData.role !== 'instructor') {
                    if (userData.role === 'admin') {
                        router.push('/admin');
                    } else {
                        router.push('/');
                    }
                } else {
                    fetchDashboardData();
                }
            } else {
                router.push('/instructor/login');
            }
        } catch (error) {
            router.push('/instructor/login');
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteBlog = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        try {
            const response = await axios.delete(`/api/blogs/${id}`);
            if (response.data.success) {
                alert('Blog deleted successfully');
                fetchDashboardData();
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to delete blog');
        }
    };

    const handleEditBlog = (blog: any) => {
        setEditBlogId(blog._id);
        setBlogData({
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            tags: blog.tags.join(', '),
            coverImage: blog.coverImage
        });
        setShowCreateBlog(true);
    };

    const fetchDashboardData = async () => {
        try {
            const [coursesRes, blogsRes] = await Promise.all([
                axios.get('/api/courses?view=instructor'),
                axios.get('/api/blogs?view=instructor')
            ]);

            setBatches(coursesRes.data.courses || []);
            setBlogs(blogsRes.data.blogs || []);

            setStats({
                batches: coursesRes.data.courses?.length || 0,
                students: 0,
                revenue: 0,
                blogs: blogsRes.data.blogs?.length || 0
            });
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
    };

    const handleCreateOrUpdateBatch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let response;
            if (editBatchId) {
                response = await axios.put(`/api/courses/${editBatchId}`, {
                    ...batchData,
                });
            } else {
                response = await axios.post('/api/courses', {
                    ...batchData,
                    isPublished: false,
                });
            }

            if (response.data.success) {
                alert(editBatchId ? 'Batch updated successfully!' : 'Batch submitted for approval!');
                closeBatchModal();
                fetchDashboardData();
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to save batch');
        }
    };

    const handleEditBatch = (batch: any) => {
        setEditBatchId(batch._id);
        setBatchData({
            title: batch.title,
            description: batch.description,
            thumbnail: batch.thumbnail || '',
            coverVideo: batch.coverVideo || '',
            category: batch.category,
            level: batch.level,
            price: batch.price,
            discount: batch.discount || 0,
            courseType: batch.courseType,
            modules: batch.modules || [],
        });
        setShowCreateBatch(true);
    };

    const closeBatchModal = () => {
        setShowCreateBatch(false);
        setEditBatchId(null);
        setBatchData({
            title: '', description: '', thumbnail: '', coverVideo: '', category: 'programming', level: 'beginner',
            price: 0, discount: 0, courseType: 'recorded', modules: []
        });
    };

    const handleCreateBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let response;
            if (editBlogId) {
                response = await axios.put(`/api/blogs/${editBlogId}`, {
                    ...blogData,
                    tags: blogData.tags.split(',').map(t => t.trim()),
                });
            } else {
                response = await axios.post('/api/blogs', {
                    ...blogData,
                    tags: blogData.tags.split(',').map(t => t.trim()),
                });
            }

            if (response.data.success) {
                alert(editBlogId ? 'Blog updated successfully! It may need re-approval.' : 'Blog submitted for approval!');
                setShowCreateBlog(false);
                fetchDashboardData();
                setBlogData({ title: '', excerpt: '', content: '', tags: '', coverImage: '' });
                setEditBlogId(null);
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to save blog');
        }
    };

    const handleDeleteBatch = async (id: string) => {
        if (!confirm('Are you sure you want to delete this batch? This action cannot be undone.')) return;
        try {
            const response = await axios.delete(`/api/courses/${id}`);
            if (response.data.success) {
                alert('Batch deleted successfully');
                fetchDashboardData();
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to delete batch');
        }
    };

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    if (loading) return <div className="flex justify-center items-center min-h-screen bg-[#020617]"><div className="spinner"></div></div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-20 bottom-0 z-40 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
            >
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    {!isSidebarCollapsed && (
                        <div className="flex items-center gap-3 text-xl font-bold gradient-text">
                            <FaGraduationCap /> Instructor
                        </div>
                    )}
                    <button onClick={toggleSidebar} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors mx-auto">
                        {isSidebarCollapsed ? <FaLayerGroup /> : <FaTimes />}
                    </button>
                </div>

                <nav className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
                    <SidebarItem icon={<FaChartLine />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={isSidebarCollapsed} />
                    <SidebarItem icon={<FaLayerGroup />} label="My Batches" active={activeTab === 'batches'} onClick={() => setActiveTab('batches')} collapsed={isSidebarCollapsed} />
                    <SidebarItem icon={<FaBlog />} label="My Blogs" active={activeTab === 'blogs'} onClick={() => setActiveTab('blogs')} collapsed={isSidebarCollapsed} />
                    <SidebarItem icon={<FaCog />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={isSidebarCollapsed} />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className={`flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors cursor-pointer ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                        <FaSignOutAlt />
                        {!isSidebarCollapsed && <span>Logout</span>}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`transition-all duration-300 p-8 ${isSidebarCollapsed ? 'ml-20' : 'md:ml-64'}`}>
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                            {activeTab === 'batches' ? 'My Batches' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                        <p className="text-slate-400">Welcome back, {user.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/courses">
                            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2">
                                <FaVideo /> Student View
                            </button>
                        </Link>
                    </div>
                </header>

                {/* Dashboard View */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard icon={<FaLayerGroup />} label="My Batches" value={stats.batches} color="from-blue-500 to-cyan-500" />
                            <StatCard icon={<FaUsers />} label="My Students" value={stats.students} color="from-purple-500 to-pink-500" />
                            <StatCard icon={<FaChartLine />} label="My Revenue" value={`₹${stats.revenue.toLocaleString()}`} color="from-emerald-500 to-teal-500" />
                            <StatCard icon={<FaBlog />} label="My Blogs" value={stats.blogs} color="from-orange-500 to-red-500" />
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => { setActiveTab('batches'); setShowCreateBatch(true); }} className="p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all flex flex-col items-center gap-2 group">
                                        <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <FaPlus />
                                        </div>
                                        <span className="font-medium">Create New Batch</span>
                                    </button>
                                    <button onClick={() => { setActiveTab('blogs'); setShowCreateBlog(true); }} className="p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all flex flex-col items-center gap-2 group">
                                        <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <FaBlog />
                                        </div>
                                        <span className="font-medium">Write New Blog</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Batches View */}
                {activeTab === 'batches' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" placeholder="Search batches..." className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500" />
                            </div>
                            <button onClick={() => setShowCreateBatch(true)} className="btn-primary flex items-center gap-2">
                                <FaPlus /> Create Batch
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {batches.map((batch: any) => (
                                <div key={batch._id} className="glass p-5 rounded-xl hover:border-primary-500/50 transition-all group relative">
                                    <div className="h-40 bg-slate-800 rounded-lg mb-4 overflow-hidden relative">
                                        <img src={batch.thumbnail || "https://via.placeholder.com/400x300"} alt={batch.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs font-bold text-white uppercase">
                                            {batch.courseType}
                                        </div>
                                        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white uppercase ${batch.status === 'approved' ? 'bg-green-500/80' :
                                            batch.status === 'rejected' ? 'bg-red-500/80' :
                                                'bg-yellow-500/80'
                                            }`}>
                                            {batch.status || 'Pending'}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{batch.title}</h3>
                                    <div className="flex justify-between items-center text-sm text-slate-400 mb-4">
                                        <span>{batch.modules?.length || 0} Modules</span>
                                        <span>{batch.enrolledStudents || 0} Students</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-slate-700 pt-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs flex items-center gap-1 ${batch.isPublished ? 'text-green-400' : 'text-slate-500'}`}>
                                                <FaCheckCircle /> {batch.isPublished ? 'Published' : 'Unpublished'}
                                            </span>
                                            <Link href={`/instructor/courses/${batch._id}/manage`}>
                                                <button className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-md text-xs font-semibold transition-colors flex items-center gap-1">
                                                    <FaClipboardList /> Manage Content
                                                </button>
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => handleEditBatch(batch)} className="text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1">
                                                <FaEdit /> Edit
                                            </button>
                                            <button onClick={() => handleDeleteBatch(batch._id)} className="text-red-400 hover:text-red-300"><FaTrash /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Blogs View */}
                {activeTab === 'blogs' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">My Blogs</h2>
                            <button onClick={() => setShowCreateBlog(true)} className="btn-primary flex items-center gap-2">
                                <FaPlus /> New Blog
                            </button>
                        </div>
                        <div className="space-y-4">
                            {blogs.map((blog: any) => (
                                <div key={blog._id} className="glass p-6 rounded-xl flex gap-6 items-center">
                                    <div className="w-24 h-24 bg-slate-800 rounded-lg flex-shrink-0 overflow-hidden">
                                        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2">{blog.title}</h3>
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-3">{blog.excerpt}</p>
                                        <div className="flex gap-2">
                                            {blog.tags?.map((tag: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEditBlog(blog)} className="text-blue-400 hover:text-blue-300 p-2"><FaEdit /></button>
                                        <button onClick={() => handleDeleteBlog(blog._id)} className="text-red-400 hover:text-red-300 p-2"><FaTrash /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Create/Edit Batch Modal */}
            <AnimatePresence>
                {showCreateBatch && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-4xl w-full my-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold text-white">{editBatchId ? 'Edit Batch' : 'Create New Batch'}</h2>
                                <button onClick={closeBatchModal} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"><FaTimes size={24} /></button>
                            </div>

                            <form onSubmit={handleCreateOrUpdateBatch} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Batch Title</label>
                                        <input
                                            type="text"
                                            value={batchData.title}
                                            onChange={e => setBatchData({ ...batchData, title: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            required
                                            placeholder="e.g., Full Stack Masterclass - June Batch"
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                        <textarea
                                            value={batchData.description}
                                            onChange={e => setBatchData({ ...batchData, description: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            rows={4}
                                            required
                                            placeholder="Describe what students will learn..."
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Cover Image URL <span className="text-red-400">*</span></label>
                                        <input
                                            type="url"
                                            value={batchData.thumbnail}
                                            onChange={e => setBatchData({ ...batchData, thumbnail: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            required
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Provide a URL to the course cover image (mandatory)</p>
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Cover Video URL <span className="text-red-400">*</span></label>
                                        <input
                                            type="url"
                                            value={batchData.coverVideo}
                                            onChange={e => setBatchData({ ...batchData, coverVideo: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            required
                                            placeholder="https://example.com/video.mp4"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Provide a URL to the course intro/cover video (mandatory)</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                                        <select
                                            value={batchData.category}
                                            onChange={e => setBatchData({ ...batchData, category: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="programming">Programming</option>
                                            <option value="design">Design</option>
                                            <option value="business">Business</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                                        <select
                                            value={batchData.courseType}
                                            onChange={e => setBatchData({ ...batchData, courseType: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="recorded">Recorded</option>
                                            <option value="live">Live Class</option>
                                            <option value="masterclass">Masterclass</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Price (₹)</label>
                                        <input
                                            type="number"
                                            value={batchData.price}
                                            onChange={e => setBatchData({ ...batchData, price: Number(e.target.value) })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Discount (%)</label>
                                        <input
                                            type="number"
                                            value={batchData.discount}
                                            onChange={e => setBatchData({ ...batchData, discount: Number(e.target.value) })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2">
                                        <FaSave /> {editBatchId ? 'Update Batch' : 'Submit for Approval'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Blog Modal */}
            <AnimatePresence>
                {showCreateBlog && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-3xl w-full my-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>

                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold text-white">Write New Blog</h2>
                                <button onClick={() => setShowCreateBlog(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"><FaTimes size={24} /></button>
                            </div>
                            <form onSubmit={handleCreateBlog} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Blog Title</label>
                                    <input
                                        type="text"
                                        value={blogData.title}
                                        onChange={e => setBlogData({ ...blogData, title: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                        required
                                        placeholder="Enter an engaging title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Excerpt (Short Summary)</label>
                                    <textarea
                                        value={blogData.excerpt}
                                        onChange={e => setBlogData({ ...blogData, excerpt: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                        rows={2}
                                        required
                                        placeholder="Brief overview of the blog post..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Content (Markdown supported)</label>
                                    <textarea
                                        value={blogData.content}
                                        onChange={e => setBlogData({ ...blogData, content: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                        rows={10}
                                        required
                                        placeholder="# Write your content here..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={blogData.tags}
                                        onChange={e => setBlogData({ ...blogData, tags: e.target.value })}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                        placeholder="tech, learning, news"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2">
                                        <FaSave /> Publish Blog
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SidebarItem({ icon, label, active, onClick, collapsed }: any) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${active ? 'bg-primary-500/20 text-white border border-primary-500/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'} ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? label : ''}
        >
            <span className="text-xl">{icon}</span>
            {!collapsed && <span className="font-medium">{label}</span>}
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    return (
        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-xl mb-4 shadow-lg`}>
                    {icon}
                </div>
                <p className="text-slate-400 text-sm mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
        </div>
    );
}
