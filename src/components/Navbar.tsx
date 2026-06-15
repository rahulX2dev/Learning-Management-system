'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaBook, FaCode, FaSignOutAlt, FaBars, FaTimes, FaChevronDown, FaBlog } from 'react-icons/fa';
import axios from 'axios';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        fetchUser();
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            setUser(null);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isHome = pathname === '/';
    const navbarClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome && !scrolled ? 'bg-transparent py-6' : 'bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800 py-4'}`;

    return (
        <nav className={navbarClass}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/">
                        <div className="flex items-center space-x-2 cursor-pointer group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg group-hover:shadow-blue-500/25 transition-all">
                                <FaGraduationCap />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">
                                Learn<span className="text-blue-400">Hub</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink href="/courses" icon={<FaBook />} label="Courses" />
                        <NavLink href="/blogs" icon={<FaBlog />} label="Blogs" />
                        <NavLink href="/coding-lab" icon={<FaCode />} label="Code Lab" />
                        {user ? (
                            <div className="flex items-center space-x-6">
                                <Link href={user.role === 'instructor' || user.role === 'admin' ? '/admin' : '/my-courses'}>
                                    <span className="text-slate-300 hover:text-white transition-colors cursor-pointer font-medium">
                                        Dashboard
                                    </span>
                                </Link>
                                <div className="relative group">
                                    <button className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                            {user.role.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                                        <FaChevronDown className="text-xs opacity-50 group-hover:rotate-180 transition-transform" />
                                    </button>
                                    {/* Dropdown */}
                                    <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
                                        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-3 text-left text-red-400 hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm font-medium"
                                            >
                                                <FaSignOutAlt /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/user/login">
                                    <button className="text-slate-300 hover:text-white font-medium transition-colors">
                                        Login
                                    </button>
                                </Link>
                                <Link href="/register">
                                    <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5">
                                        Get Started
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-300 hover:text-white text-2xl transition-colors"
                        >
                            {isMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 mt-4 rounded-xl"
                        >
                            <div className="p-4 space-y-4">
                                <Link href="/courses" onClick={() => setIsMenuOpen(false)}>
                                    <div className="flex items-center space-x-3 text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                                        <FaBook /> <span>Courses</span>
                                    </div>
                                </Link>
                                <Link href="/blogs" onClick={() => setIsMenuOpen(false)}>
                                    <div className="flex items-center space-x-3 text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                                        <FaBlog /> <span>Blogs</span>
                                    </div>
                                </Link>
                                <Link href="/coding-lab" onClick={() => setIsMenuOpen(false)}>
                                    <div className="flex items-center space-x-3 text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                                        <FaCode /> <span>Code Lab</span>
                                    </div>
                                </Link>
                                {user ? (
                                    <>
                                        <Link href={user.role === 'instructor' || user.role === 'admin' ? '/admin' : '/my-courses'} onClick={() => setIsMenuOpen(false)}>
                                            <div className="flex items-center space-x-3 text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span>Dashboard</span>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full flex items-center space-x-3 text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-slate-800 transition-colors"
                                        >
                                            <FaSignOutAlt /> <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <Link href="/user/login" onClick={() => setIsMenuOpen(false)}>
                                            <button className="w-full py-3 text-slate-300 hover:text-white bg-slate-800 rounded-lg font-medium transition-colors">
                                                Login
                                            </button>
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg transition-colors">
                                                Sign Up
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}

function NavLink({ href, icon, label }: any) {
    return (
        <Link href={href}>
            <div className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors cursor-pointer group">
                <span className="group-hover:text-blue-400 transition-colors">{icon}</span>
                <span className="font-medium">{label}</span>
            </div>
        </Link>
    );
}
