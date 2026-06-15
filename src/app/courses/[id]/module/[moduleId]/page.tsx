
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPlay, FaCheckCircle, FaArrowLeft, FaArrowRight, FaList, FaClipboardList, FaQuestionCircle } from 'react-icons/fa';

export default function ModuleViewerPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [currentModule, setCurrentModule] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'content' | 'assignment' | 'quiz'>('content');

    useEffect(() => {
        if (params.id && params.moduleId) {
            fetchCourseAndModule();
        }
    }, [params.id, params.moduleId]);

    const fetchCourseAndModule = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/courses/${params.id}`);
            if (response.data.success) {
                setCourse(response.data.course);
                const module = response.data.course.modules.find((m: any) => m._id === params.moduleId);
                if (module) {
                    setCurrentModule(module);
                } else {
                    // If module not found, redirect to first module or course page
                    if (response.data.course.modules.length > 0) {
                        router.push(`/courses/${params.id}/module/${response.data.course.modules[0]._id}`);
                    } else {
                        router.push(`/courses/${params.id}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModuleChange = (moduleId: string) => {
        router.push(`/courses/${params.id}/module/${moduleId}`);
        setActiveTab('content'); // Reset tab on module change
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#020617]">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!course || !currentModule) return null;

    const currentIndex = course.modules.findIndex((m: any) => m._id === currentModule._id);
    const prevModule = currentIndex > 0 ? course.modules[currentIndex - 1] : null;
    const nextModule = currentIndex < course.modules.length - 1 ? course.modules[currentIndex + 1] : null;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex">
            {/* Sidebar - Module List */}
            <div className="w-80 border-r border-white/10 bg-[#0f172a] hidden lg:flex flex-col h-screen sticky top-0">
                <div className="p-6 border-b border-white/10">
                    <h2 className="font-bold text-white mb-2 line-clamp-1">{course.title}</h2>
                    <div className="flex items-center text-xs text-slate-400">
                        <span className="bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded mr-2">
                            {course.modules.length} Modules
                        </span>
                        <span>{course.category}</span>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto no-scrollbar p-4 space-y-2">
                    {course.modules.map((module: any, index: number) => (
                        <button
                            key={module._id}
                            onClick={() => handleModuleChange(module._id)}
                            className={`w-full text-left p-3 rounded-lg transition-all flex items-start gap-3 ${module._id === currentModule._id
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                                : 'hover:bg-white/5 text-slate-400 hover:text-white'
                                }`}
                        >
                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${module._id === currentModule._id ? 'bg-white text-primary-600' : 'bg-white/10'
                                }`}>
                                {index + 1}
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="text-sm font-medium line-clamp-2 mb-1">
                                    {module.title}
                                </div>
                                <div className="flex items-center gap-2">
                                    {module.assignmentId && (
                                        <span className="flex items-center gap-1 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300" title="Assignment">
                                            <FaClipboardList /> Assign
                                        </span>
                                    )}
                                    {module.quizId && (
                                        <span className="flex items-center gap-1 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300" title="Quiz">
                                            <FaQuestionCircle /> Quiz
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col h-screen overflow-y-auto no-scrollbar">
                {/* Mobile Header */}
                <div className="lg:hidden p-4 border-b border-white/10 bg-[#0f172a] flex items-center justify-between sticky top-0 z-20">
                    <h2 className="font-bold text-white truncate mr-4">{currentModule.title}</h2>
                    <button className="p-2 bg-white/5 rounded-lg">
                        <FaList />
                    </button>
                </div>

                <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full">
                    {/* Video Player Placeholder */}
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8 relative group">
                        {currentModule.videoUrl ? (
                            <iframe
                                src={currentModule.videoUrl.replace('watch?v=', 'embed/')}
                                className="w-full h-full"
                                allowFullScreen
                                title={currentModule.title}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <FaPlay className="text-slate-500 text-xl ml-1" />
                                    </div>
                                    <p className="text-slate-500">No video content available</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => prevModule && handleModuleChange(prevModule._id)}
                            disabled={!prevModule}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${prevModule ? 'bg-white/5 hover:bg-white/10 text-white' : 'opacity-50 cursor-not-allowed text-slate-500'
                                }`}
                        >
                            <FaArrowLeft /> Previous
                        </button>

                        <button
                            onClick={() => nextModule && handleModuleChange(nextModule._id)}
                            disabled={!nextModule}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${nextModule ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'opacity-50 cursor-not-allowed text-slate-500'
                                }`}
                        >
                            Next <FaArrowRight />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-4 mb-6 border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`pb-2 px-1 font-medium transition-all ${activeTab === 'content' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-slate-400 hover:text-white'}`}
                        >
                            Content
                        </button>
                        {currentModule.assignmentId && (
                            <button
                                onClick={() => setActiveTab('assignment')}
                                className={`pb-2 px-1 font-medium transition-all ${activeTab === 'assignment' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-slate-400 hover:text-white'}`}
                            >
                                Assignment
                            </button>
                        )}
                        {currentModule.quizId && (
                            <button
                                onClick={() => setActiveTab('quiz')}
                                className={`pb-2 px-1 font-medium transition-all ${activeTab === 'quiz' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-slate-400 hover:text-white'}`}
                            >
                                Quiz
                            </button>
                        )}
                    </div>

                    {/* Content Tab */}
                    {activeTab === 'content' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="prose prose-invert max-w-none"
                        >
                            <h1 className="text-3xl font-bold text-white mb-4">{currentModule.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-8 pb-8 border-b border-white/10">
                                <span className="flex items-center gap-2">
                                    <FaPlay className="text-primary-400" /> {currentModule.duration} min
                                </span>
                                <span className="flex items-center gap-2">
                                    <FaCheckCircle className="text-emerald-400" /> Not Completed
                                </span>
                            </div>

                            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {currentModule.description}
                            </div>
                            <div className="mt-8">
                                <button
                                    onClick={async () => {
                                        try {
                                            // increment progress by 1 module worth
                                            const total = course.modules.length || 1;
                                            const step = Math.ceil(100 / total);
                                            await axios.post(`/api/courses/${params.id}/progress`, { increment: step });
                                            // optimistic UI: no action required here; polling in MyCourses will pick it up
                                            alert('Marked module complete. Progress updated.');
                                        } catch (err: any) {
                                            alert(err.response?.data?.error || 'Failed to update progress');
                                        }
                                    }}
                                    className="mt-4 btn-primary"
                                >
                                    Mark Module Complete
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Assignment Tab */}
                    {activeTab === 'assignment' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass rounded-xl p-8"
                        >
                            <h2 className="text-2xl font-bold text-white mb-4">Module Assignment</h2>
                            <p className="text-slate-400 mb-6">Complete the assignment to reinforce your learning.</p>
                            <button className="btn-primary">
                                View Assignment Details
                            </button>
                        </motion.div>
                    )}

                    {/* Quiz Tab */}
                    {activeTab === 'quiz' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass rounded-xl p-8"
                        >
                            <h2 className="text-2xl font-bold text-white mb-4">Module Quiz</h2>
                            <p className="text-slate-400 mb-6">Take the quiz to test your knowledge.</p>
                            <button className="btn-primary">
                                Start Quiz
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
