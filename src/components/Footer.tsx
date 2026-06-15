'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram, FaPaperPlane } from 'react-icons/fa';

export default function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith('/admin') || pathname?.startsWith('/instructor')) {
        return null;
    }

    return (
        <footer className="bg-[#020617] border-t border-slate-800 pt-20 pb-10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/">
                            <div className="flex items-center space-x-2 cursor-pointer">
                                <span className="text-2xl font-bold text-white tracking-tight">
                                    Learn<span className="text-blue-400">Hub</span>
                                </span>
                            </div>
                        </Link>
                        <p className="text-slate-400 leading-relaxed">
                            Empowering the next generation of developers with world‑class education and real‑world skills. Join our community today.
                        </p>
                        <div className="flex space-x-4">
                            <SocialLink icon={<FaTwitter />} href="#" />
                            <SocialLink icon={<FaGithub />} href="#" />
                            <SocialLink icon={<FaLinkedin />} href="#" />
                            <SocialLink icon={<FaInstagram />} href="#" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Platform</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/courses" label="Browse Courses" />
                            <FooterLink href="/admin/login" label="Admin Login" />
                            <FooterLink href="/instructor/login" label="Instructor Login" />
                            <FooterLink href="/help" label="Help Center" />
                            <FooterLink href="/terms" label="Terms & Privacy" />
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/blog" label="Blog" />
                            <FooterLink href="/community" label="Community" />
                            <FooterLink href="/careers" label="Careers" />
                            <FooterLink href="/help" label="Help Center" />
                            <FooterLink href="/terms" label="Terms & Privacy" />
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Stay Updated</h4>
                        <p className="text-slate-400 mb-4">
                            Subscribe to our newsletter for the latest coding tips and course updates.
                        </p>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <button className="absolute right-2 top-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                                    <FaPaperPlane size={14} />
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">By subscribing, you agree to our Privacy Policy.</p>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">© {new Date().getFullYear()} LearnHub Inc. All rights reserved.</p>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>System Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon, href }: any) {
    return (
        <a href={href} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all">
            {icon}
        </a>
    );
}

function FooterLink({ href, label }: any) {
    return (
        <li>
            <Link href={href} className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                {label}
            </Link>
        </li>
    );
}
