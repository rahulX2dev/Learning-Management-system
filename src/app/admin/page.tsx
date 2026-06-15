'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    FaPlus, FaSave, FaTimes, FaGraduationCap, FaBlog, FaChartLine,
    FaCog, FaSignOutAlt, FaUsers, FaLayerGroup, FaVideo, FaSearch, FaTrash, FaEdit, FaCheckCircle, FaClipboardList, FaTag
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Data States
    const [stats, setStats] = useState({ batches: 0, students: 0, revenue: 0, blogs: 0 });
    const [batches, setBatches] = useState<any[]>([]);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [dsaChallenges, setDsaChallenges] = useState<any[]>([]);
    const [dsaTotal, setDsaTotal] = useState<number>(0);

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
        isActive: true,
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

    // Coupons state
    const [showCreateCoupon, setShowCreateCoupon] = useState(false);
    const [editCouponId, setEditCouponId] = useState<string | null>(null);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [couponForm, setCouponForm] = useState<any>({
        code: '',
        course: '',
        discountPercent: 0,
        amountOff: 0,
        expiresAt: '',
        usageLimit: 0,
        isActive: true,
    });

    // DSA modal & form state
    const [showCreateDsa, setShowCreateDsa] = useState(false);
    const [editDsaId, setEditDsaId] = useState<string | null>(null);
    const [dsaForm, setDsaForm] = useState<any>({
        title: '',
        problemNumber: 0,
        level: 1,
        difficulty: 'easy',
        category: 'arrays',
        description: '',
        starterCode: '',
        solution: '',
        testCases: [{ input: '', expectedOutput: '' }, { input: '', expectedOutput: '' }, { input: '', expectedOutput: '' }],
        hints: ['']
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
                if (userData.role !== 'admin') {
                    if (userData.role === 'instructor') {
                        router.push('/instructor');
                    } else {
                        router.push('/');
                    }
                } else {
                    fetchDashboardData();
                }
            } else {
                router.push('/admin/login');
            }
        } catch (error) {
            router.push('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    // DSA handlers
    const openCreateDsa = () => {
        setEditDsaId(null);
        setDsaForm({
            title: '', problemNumber: 0, level: 1, difficulty: 'easy', category: 'arrays', description: '', starterCode: '', solution: '',
            testCases: [{ input: '', expectedOutput: '' }, { input: '', expectedOutput: '' }, { input: '', expectedOutput: '' }],
            hints: ['']
        });
        setShowCreateDsa(true);
    };

    const handleSaveDsa = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editDsaId) {
                const response = await axios.put('/api/challenges', { _id: editDsaId, ...dsaForm }, { withCredentials: true });
                if (response.data.success) {
                    alert('Challenge updated');
                    setShowCreateDsa(false);
                    fetchDashboardData();
                }
            } else {
                const response = await axios.post('/api/challenges', dsaForm, { withCredentials: true });
                if (response.data.success) {
                    alert('Challenge created');
                    setShowCreateDsa(false);
                    fetchDashboardData();
                }
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to save challenge');
        }
    };

    const handleEditDsa = (c: any) => {
        setEditDsaId(c._id);
        setDsaForm({
            title: c.title,
            problemNumber: c.problemNumber,
            level: c.level,
            difficulty: c.difficulty,
            category: c.category,
            description: c.description,
            starterCode: c.starterCode,
            solution: c.solution,
            testCases: c.testCases?.length ? c.testCases : [{ input: '', expectedOutput: '' }, { input: '', expectedOutput: '' }, { input: '', expectedOutput: '' }],
            hints: c.hints?.length ? c.hints : ['']
        });
        setShowCreateDsa(true);
    };

    const handleDeleteDsa = async (id: string) => {
        if (!confirm('Delete this challenge?')) return;
        try {
            const response = await axios.delete(`/api/challenges?id=${id}`);
            if (response.data.success) {
                alert('Deleted');
                fetchDashboardData();
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to delete');
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

    const handleApproveBlog = async (blog: any) => {
        try {
            const response = await axios.put(`/api/blogs/${blog._id}`, {
                status: 'approved',
                isApproved: true,
                isPublished: true
            });
            if (response.data.success) {
                alert('Blog approved successfully');
                fetchDashboardData();
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to approve blog');
        }
    };

    const handleRejectBlog = async (blog: any) => {
        if (!confirm('Are you sure you want to reject this blog?')) return;
        try {
            const response = await axios.put(`/api/blogs/${blog._id}`, {
                status: 'rejected',
                isApproved: false,
                isPublished: false
            });
            if (response.data.success) {
                alert('Blog rejected');
                fetchDashboardData();
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to reject blog');
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
                axios.get('/api/courses?view=admin', { withCredentials: true }),
                axios.get('/api/blogs?view=admin')
            ]);

            // fetch dsa challenges for admin/instructor
            try {
                const dsaRes = await axios.get('/api/challenges?limit=100');
                setDsaChallenges(dsaRes.data.challenges || []);
                // API returns pagination.total when available
                const total = dsaRes.data?.pagination?.total ?? (dsaRes.data?.challenges?.length ?? 0);
                setDsaTotal(Number(total || 0));
            } catch (e) {
                console.warn('Failed to fetch DSA challenges', e);
            }

            setBatches(coursesRes.data.courses || []);
            setBlogs(blogsRes.data.blogs || []);

            // fetch coupons for admin view
            try {
                const couponsRes = await axios.get('/api/coupons', { withCredentials: true });
                setCoupons(couponsRes.data.coupons || []);
            } catch (e) {
                console.warn('Failed to fetch coupons', e);
            }

            setStats({
                batches: coursesRes.data.courses?.length || 0,
                students: 1250, // Mock data for now
                revenue: 45000, // Mock data
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
                // Update existing batch
                response = await axios.put(`/api/courses/${editBatchId}`, {
                    ...batchData,
                }, { withCredentials: true });
            } else {
                // Create new batch
                response = await axios.post('/api/courses', {
                    ...batchData,
                    isPublished: true,
                }, { withCredentials: true });
            }

            if (response.data.success) {
                alert(editBatchId ? 'Batch updated successfully!' : 'Batch created successfully!');
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
            isActive: typeof batch.isActive === 'boolean' ? batch.isActive : true,
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
            price: 0, discount: 0, isActive: true, courseType: 'recorded', modules: []
        });
    };

    const handleCreateBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/blogs', {
                ...blogData,
                tags: blogData.tags.split(',').map(t => t.trim()),
            });
            if (response.data.success) {
                alert('Blog published successfully!');
                setShowCreateBlog(false);
                fetchDashboardData();
                setBlogData({ title: '', excerpt: '', content: '', tags: '', coverImage: '' });
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to create blog');
        }
    };

    // Coupons handlers
    const handleOpenCreateCoupon = () => {
        setEditCouponId(null);
        setCouponForm({ code: '', course: '', discountPercent: 0, amountOff: 0, expiresAt: '', usageLimit: 0, isActive: true });
        setShowCreateCoupon(true);
    };

    const handleSaveCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editCouponId) {
                const payload = { id: editCouponId, ...couponForm };
                const res = await axios.put('/api/coupons', payload, { withCredentials: true });
                if (res.data.success) {
                    alert('Coupon updated');
                    setShowCreateCoupon(false);
                    fetchDashboardData();
                }
            } else {
                const res = await axios.post('/api/coupons', couponForm, { withCredentials: true });
                if (res.data.success) {
                    alert('Coupon created');
                    setShowCreateCoupon(false);
                    fetchDashboardData();
                }
            }
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to save coupon');
        }
    };

    const handleEditCoupon = (c: any) => {
        setEditCouponId(c._id);
        setCouponForm({
            code: c.code,
            course: c.course,
            discountPercent: c.discountPercent || 0,
            amountOff: c.amountOff || 0,
            expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 10) : '',
            usageLimit: c.usageLimit || 0,
            isActive: c.isActive,
        });
        setShowCreateCoupon(true);
    };

    const handleDeleteCoupon = async (id: string) => {
        if (!confirm('Delete this coupon?')) return;
        try {
            const res = await axios.delete(`/api/coupons?id=${id}`, { withCredentials: true });
            if (res.data.success) {
                alert('Coupon deleted');
                fetchDashboardData();
            }
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete coupon');
        }
    };

    const handleToggleCouponActive = async (c: any) => {
        try {
            const res = await axios.put('/api/coupons', { id: c._id, isActive: !c.isActive }, { withCredentials: true });
            if (res.data.success) {
                fetchDashboardData();
            }
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to update coupon');
        }
    };

    const handleDeleteBatch = async (id: string) => {
        if (!confirm('Are you sure you want to delete this batch? This action cannot be undone.')) return;
        try {
            const response = await axios.delete(`/api/courses/${id}`, { withCredentials: true });
            if (response.data.success) {
                alert('Batch deleted successfully');
                fetchDashboardData();
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to delete batch');
        }
    };

    const handleToggleStatus = async (batch: any) => {
        try {
            // Optimistic UI update
            const original = batches.map(b => ({ ...b }));
            const newStatus = !batch.isPublished;

            setBatches(prev => prev.map(p => p._id === batch._id ? {
                ...p,
                isActive: newStatus,
                isPublished: newStatus
            } : p));

            const response = await axios.put(`/api/courses/${batch._id}`, { isActive: newStatus }, { withCredentials: true });
            if (response.data.success) {
                fetchDashboardData();
            } else {
                // revert on failure
                setBatches(original);
                alert(response.data.error || 'Failed to update status');
            }
        } catch (error: any) {
            // revert on error
            fetchDashboardData();
            alert(error.response?.data?.error || 'Failed to update status');
        }
    };

    const handleApproveBatch = async (batch: any) => {
        try {
            const response = await axios.put(`/api/courses/${batch._id}`, {
                status: 'approved',
                isApproved: true,
                isPublished: true,
                isActive: true
            }, { withCredentials: true });
            if (response.data.success) {
                alert('Batch approved successfully');
                fetchDashboardData();
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to approve batch');
        }
    };

    const handleRejectBatch = async (batch: any) => {
        if (!confirm('Are you sure you want to reject this batch?')) return;
        try {
            const response = await axios.put(`/api/courses/${batch._id}`, {
                status: 'rejected',
                isApproved: false,
                isPublished: false
            }, { withCredentials: true });
            if (response.data.success) {
                alert('Batch rejected');
                fetchDashboardData();
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to reject batch');
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
                            <FaGraduationCap /> Admin
                        </div>
                    )}
                    <button onClick={toggleSidebar} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors mx-auto">
                        {isSidebarCollapsed ? <FaLayerGroup /> : <FaTimes />}
                    </button>
                </div>

                <nav className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
                    <SidebarItem icon={<FaChartLine />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} collapsed={isSidebarCollapsed} />
                    <SidebarItem icon={<FaLayerGroup />} label="Batches" active={activeTab === 'batches'} onClick={() => setActiveTab('batches')} collapsed={isSidebarCollapsed} />
                    <SidebarItem icon={<FaBlog />} label="Blogs" active={activeTab === 'blogs'} onClick={() => setActiveTab('blogs')} collapsed={isSidebarCollapsed} />
                    <SidebarItem icon={<FaClipboardList />} label="DSA" active={activeTab === 'dsa'} onClick={() => setActiveTab('dsa')} collapsed={isSidebarCollapsed} />
                    <SidebarItem icon={<FaUsers />} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} collapsed={isSidebarCollapsed} />
                    <SidebarItem icon={<FaTag />} label="Coupons" active={activeTab === 'coupons'} onClick={() => setActiveTab('coupons')} collapsed={isSidebarCollapsed} />
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
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
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
                            <StatCard icon={<FaLayerGroup />} label="Total Batches" value={stats.batches} color="from-blue-500 to-cyan-500" />
                            <StatCard icon={<FaUsers />} label="Active Students" value={stats.students} color="from-purple-500 to-pink-500" />
                            <StatCard icon={<FaChartLine />} label="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} color="from-emerald-500 to-teal-500" />
                            <StatCard icon={<FaBlog />} label="Published Blogs" value={stats.blogs} color="from-orange-500 to-red-500" />
                        </div>

                        {/* Recent Activity / Quick Actions */}
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
                                        {/* Status Badge */}
                                        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white uppercase ${batch.status === 'approved' ? 'bg-green-500/80' :
                                            batch.status === 'rejected' ? 'bg-red-500/80' :
                                                'bg-yellow-500/80'
                                            }`}>
                                            {batch.status || 'Pending'}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{batch.title}</h3>
                                    <p className="text-xs text-slate-400 mb-2">Instructor: {batch.instructorName || 'Unknown'}</p>
                                    <div className="flex justify-between items-center text-sm text-slate-400 mb-4">
                                        <span>{batch.modules?.length || 0} Modules</span>
                                        <span>{batch.enrolledStudents || 0} Students</span>
                                    </div>

                                    {/* Approval Actions */}
                                    {batch.status === 'pending' && (
                                        <div className="flex gap-2 mb-4">
                                            <button onClick={() => handleApproveBatch(batch)} className="flex-1 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm font-semibold transition-colors">
                                                Approve
                                            </button>
                                            <button onClick={() => handleRejectBatch(batch)} className="flex-1 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-semibold transition-colors">
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center border-t border-slate-700 pt-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(batch)}
                                                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${batch.isPublished ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                                            >
                                                {batch.isPublished ? 'Active' : 'Inactive'}
                                            </button>
                                            <Link href={`/admin/courses/${batch._id}/manage`}>
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
                            <h2 className="text-xl font-bold text-white">All Blogs</h2>
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
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{blog.title}</h3>
                                                <p className="text-sm text-slate-400">By {blog.author?.name || 'Unknown'} • {new Date(blog.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${blog.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                                blog.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {blog.status}
                                            </div>
                                        </div>
                                        <p className="text-slate-300 mb-4 line-clamp-2">{blog.excerpt}</p>
                                        <div className="flex items-center gap-4">
                                            {blog.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleApproveBlog(blog._id)} className="text-green-400 hover:text-green-300 text-sm font-semibold">Approve</button>
                                                    <button onClick={() => handleRejectBlog(blog._id)} className="text-red-400 hover:text-red-300 text-sm font-semibold">Reject</button>
                                                </>
                                            )}
                                            <button onClick={() => handleEditBlog(blog)} className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-1"><FaEdit /> Edit</button>
                                            <button onClick={() => handleDeleteBlog(blog._id)} className="text-red-400 hover:text-red-300 text-sm font-semibold flex items-center gap-1"><FaTrash /> Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Coupons View */}
                {activeTab === 'coupons' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Coupons</h2>
                            <button onClick={handleOpenCreateCoupon} className="btn-primary flex items-center gap-2">
                                <FaPlus /> New Coupon
                            </button>
                        </div>

                        <div className="space-y-4">
                            {coupons.map((c: any) => (
                                <div key={c._id} className="glass p-4 rounded-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-semibold">{c.code} {c.discountPercent ? `• ${c.discountPercent}%` : c.amountOff ? `• ₹${c.amountOff} off` : ''}</p>
                                        <p className="text-sm text-slate-400">Course: {c.course?.title || c.course} • Used: {c.usedCount || 0}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEditCoupon(c)} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded">Edit</button>
                                        <button onClick={() => handleDeleteCoupon(c._id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded">Delete</button>
                                        <button onClick={() => handleToggleCouponActive(c)} className={`px-3 py-1 rounded ${c.isActive ? 'bg-emerald-600 text-black' : 'bg-slate-700 text-white'}`}>
                                            {c.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Create/Edit Coupon Modal */}
                        {showCreateCoupon && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                <form onSubmit={handleSaveCoupon} className="w-full max-w-lg bg-slate-900 p-6 rounded-2xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold">{editCouponId ? 'Edit' : 'Create'} Coupon</h3>
                                        <button type="button" onClick={() => setShowCreateCoupon(false)} className="text-slate-400">Close</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input required placeholder="Code" value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} className="p-2 bg-slate-800 rounded" />
                                        <select required value={couponForm.course} onChange={e => setCouponForm({ ...couponForm, course: e.target.value })} className="p-2 bg-slate-800 rounded">
                                            <option value="">Select Course</option>
                                            {batches.map(b => <option key={b._id} value={b._id}>{b.title}</option>)}
                                        </select>
                                        <input type="number" min="0" max="100" placeholder="Discount Percent" value={couponForm.discountPercent} onChange={e => setCouponForm({ ...couponForm, discountPercent: Number(e.target.value) })} className="p-2 bg-slate-800 rounded" />
                                        <input type="number" min="0" placeholder="Amount Off (₹)" value={couponForm.amountOff} onChange={e => setCouponForm({ ...couponForm, amountOff: Number(e.target.value) })} className="p-2 bg-slate-800 rounded" />
                                        <input type="date" placeholder="Expires At" value={couponForm.expiresAt} onChange={e => setCouponForm({ ...couponForm, expiresAt: e.target.value })} className="p-2 bg-slate-800 rounded" />
                                        <input type="number" min="0" placeholder="Usage Limit" value={couponForm.usageLimit} onChange={e => setCouponForm({ ...couponForm, usageLimit: Number(e.target.value) })} className="p-2 bg-slate-800 rounded" />
                                    </div>

                                    <div className="flex items-center gap-3 mt-4">
                                        <label className="flex items-center gap-2 text-sm text-slate-300">
                                            <input type="checkbox" checked={couponForm.isActive} onChange={e => setCouponForm({ ...couponForm, isActive: e.target.checked })} /> Active
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4">
                                        <button type="button" onClick={() => setShowCreateCoupon(false)} className="px-4 py-2 bg-slate-700 rounded">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-green-600 rounded">Save Coupon</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* DSA View */}
                {activeTab === 'dsa' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">DSA Challenges <span className="text-sm text-slate-400 ml-2">(Total: {dsaTotal})</span></h2>
                            <div className="flex items-center gap-2">
                                <button onClick={openCreateDsa} className="btn-primary flex items-center gap-2"><FaPlus /> New DSA</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dsaChallenges.map((c: any) => (
                                <div key={c._id} className="glass p-5 rounded-xl">
                                    <h3 className="text-lg font-bold text-white mb-2">{c.title}</h3>
                                    <p className="text-sm text-slate-400 mb-2">#{c.problemNumber} • {c.difficulty} • {c.category}</p>
                                    <p className="text-slate-300 text-sm line-clamp-3 mb-4">{c.description}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditDsa(c)} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs">Edit</button>
                                            <button onClick={() => handleDeleteDsa(c._id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-md text-xs">Delete</button>
                                        </div>
                                        <div className="text-xs text-slate-400">Tests: {c.testCases?.length || 0} • Hints: {c.hints?.length || 0}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Create/Edit Modal */}
                        {showCreateDsa && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                <form onSubmit={handleSaveDsa} className="w-full max-w-2xl bg-slate-900 p-6 rounded-2xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold">{editDsaId ? 'Edit' : 'Create'} DSA Challenge</h3>
                                        <button type="button" onClick={() => setShowCreateDsa(false)} className="text-slate-400">Close</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input required placeholder="Title" value={dsaForm.title} onChange={e => setDsaForm({ ...dsaForm, title: e.target.value })} className="p-2 bg-slate-800 rounded" />
                                        <input required type="number" placeholder="Problem Number" value={dsaForm.problemNumber} onChange={e => setDsaForm({ ...dsaForm, problemNumber: Number(e.target.value) })} className="p-2 bg-slate-800 rounded" />
                                        <select value={dsaForm.difficulty} onChange={e => setDsaForm({ ...dsaForm, difficulty: e.target.value })} className="p-2 bg-slate-800 rounded">
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                        <input placeholder="Category" value={dsaForm.category} onChange={e => setDsaForm({ ...dsaForm, category: e.target.value })} className="p-2 bg-slate-800 rounded" />
                                    </div>

                                    <textarea placeholder="Description" value={dsaForm.description} onChange={e => setDsaForm({ ...dsaForm, description: e.target.value })} className="w-full mt-3 p-3 bg-slate-800 rounded h-28" />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                                        {dsaForm.testCases.map((t: any, idx: number) => (
                                            <div key={idx} className="flex flex-col">
                                                <input placeholder={`Test ${idx + 1} input`} value={t.input} onChange={e => {
                                                    const arr = [...dsaForm.testCases]; arr[idx].input = e.target.value; setDsaForm({ ...dsaForm, testCases: arr });
                                                }} className="p-2 bg-slate-800 rounded mb-1" />
                                                <input placeholder={`Test ${idx + 1} expected`} value={t.expectedOutput} onChange={e => {
                                                    const arr = [...dsaForm.testCases]; arr[idx].expectedOutput = e.target.value; setDsaForm({ ...dsaForm, testCases: arr });
                                                }} className="p-2 bg-slate-800 rounded" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-3">
                                        <label className="text-sm text-slate-400">Hints (one per line)</label>
                                        <textarea placeholder="Hint per line" value={(dsaForm.hints || []).join('\n')} onChange={e => setDsaForm({ ...dsaForm, hints: e.target.value.split('\n') })} className="w-full mt-1 p-2 bg-slate-800 rounded h-24" />
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4">
                                        <button type="button" onClick={() => setShowCreateDsa(false)} className="px-4 py-2 bg-slate-700 rounded">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-green-600 rounded">Save</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Create/Edit Batch Modal */}
            <AnimatePresence>
                {showCreateBatch && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-4xl w-full my-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                            {/* Decorative background gradient */}
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
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Visibility</label>
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => setBatchData({ ...batchData, isActive: true })} className={`px-4 py-2 rounded-lg ${batchData.isActive ? 'bg-green-500 text-black' : 'bg-slate-800 text-slate-300'}`}>Active</button>
                                            <button type="button" onClick={() => setBatchData({ ...batchData, isActive: false })} className={`px-4 py-2 rounded-lg ${batchData.isActive ? 'bg-slate-800 text-slate-300' : 'bg-red-500 text-black'}`}>Inactive</button>
                                            <p className="text-sm text-slate-400 ml-2 self-center">Active = visible to public & students. Inactive = hidden.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2">
                                        <FaSave /> {editBatchId ? 'Update Batch' : 'Create Batch'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )
                }
            </AnimatePresence >

            {/* Create Blog Modal */}
            <AnimatePresence>
                {
                    showCreateBlog && (
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
                    )
                }
            </AnimatePresence >
        </div >
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
