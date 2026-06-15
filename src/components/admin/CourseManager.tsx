'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaGripVertical,
    FaFileAlt, FaClipboardList, FaQuestionCircle, FaVideo, FaChalkboardTeacher
} from 'react-icons/fa';

export default function CourseManager({ courseId, isInstructor = false }: { courseId: string; isInstructor?: boolean }) {
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeModule, setActiveModule] = useState<string | null>(null);

    // Modal States
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [moduleData, setModuleData] = useState({ title: '', description: '', videoUrl: '', duration: 0, isFree: false });
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

    useEffect(() => {
        fetchCourseData();
    }, [courseId]);

    const fetchCourseData = async () => {
        try {
            const response = await axios.get(`/api/courses/${courseId}`);
            if (response.data.success) {
                setCourse(response.data.course);
            }
        } catch (error) {
            console.error("Error fetching course:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdateModule = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let response;
            if (editingModuleId) {
                // Update existing module (logic to be implemented in API)
                response = await axios.put(`/api/courses/${courseId}/modules`, {
                    moduleId: editingModuleId,
                    ...moduleData
                });
            } else {
                // Create new module
                response = await axios.post(`/api/courses/${courseId}/modules`, moduleData);
            }

            if (response.data.success) {
                alert(editingModuleId ? 'Module updated!' : 'Module added!');
                setShowModuleModal(false);
                setModuleData({ title: '', description: '', videoUrl: '', duration: 0, isFree: false });
                setEditingModuleId(null);
                fetchCourseData();
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to save module');
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm('Are you sure? This will delete the module and all its content.')) return;
        try {
            const response = await axios.delete(`/api/courses/${courseId}/modules?moduleId=${moduleId}`);
            if (response.data.success) {
                fetchCourseData();
            }
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to delete module');
        }
    };

    const openEditModule = (module: any) => {
        setModuleData({
            title: module.title,
            description: module.description,
            videoUrl: module.videoUrl,
            duration: module.duration,
            isFree: module.isFree
        });
        setEditingModuleId(module._id);
        setShowModuleModal(true);
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading course data...</div>;
    if (!course) return <div className="p-8 text-center text-red-400">Course not found</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{course.title}</h2>
                    <p className="text-slate-400 text-sm flex items-center gap-4">
                        <span>{course.modules?.length || 0} Modules</span>
                        <span>•</span>
                        <span className="capitalize">{course.level} Level</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${course.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {course.status}
                        </span>
                    </p>
                </div>
                <button
                    onClick={() => { setEditingModuleId(null); setModuleData({ title: '', description: '', videoUrl: '', duration: 0, isFree: false }); setShowModuleModal(true); }}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                    <FaPlus /> Add Module
                </button>
            </div>

            {/* Modules List */}
            <div className="space-y-4">
                {course.modules?.map((module: any, index: number) => (
                    <div key={module._id || index} className="glass border border-slate-800 rounded-xl overflow-hidden group">
                        {/* Module Header */}
                        <div
                            className="p-4 bg-slate-800/30 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
                            onClick={() => setActiveModule(activeModule === module._id ? null : module._id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 text-slate-500 cursor-grab active:cursor-grabbing hover:text-white">
                                    <FaGripVertical />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white flex items-center gap-3">
                                        <span className="text-slate-500">#{index + 1}</span>
                                        {module.title}
                                        {module.isFree && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">Free Preview</span>}
                                    </h3>
                                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-4">
                                        <span className="flex items-center gap-1"><FaVideo className="text-xs" /> {module.duration} min</span>
                                        {/* Add assignment/quiz counts here later */}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); openEditModule(module); }} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit Module">
                                    <FaEdit />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteModule(module._id); }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete Module">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>

                        {/* Module Content (Expanded) */}
                        <AnimatePresence>
                            {activeModule === module._id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-slate-800 bg-slate-900/20"
                                >
                                    <div className="p-4 space-y-3">
                                        {/* Content Actions */}
                                        <div className="flex gap-3 mb-4">
                                            <button className="flex-1 py-2 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 text-sm">
                                                <FaClipboardList /> Add Assignment
                                            </button>
                                            <button className="flex-1 py-2 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 text-sm">
                                                <FaQuestionCircle /> Add Quiz
                                            </button>
                                            <button className="flex-1 py-2 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 text-sm">
                                                <FaFileAlt /> Add Resources
                                            </button>
                                        </div>

                                        {/* List of assignments/quizzes would go here */}
                                        <div className="text-center text-slate-500 text-sm py-4">
                                            No additional content added yet.
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                {course.modules?.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                            <FaVideo className="text-2xl" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No Modules Yet</h3>
                        <p className="text-slate-400 mb-6">Start building your course curriculum by adding modules.</p>
                        <button
                            onClick={() => { setEditingModuleId(null); setModuleData({ title: '', description: '', videoUrl: '', duration: 0, isFree: false }); setShowModuleModal(true); }}
                            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Create First Module
                        </button>
                    </div>
                )}
            </div>

            {/* Module Modal */}
            <AnimatePresence>
                {showModuleModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-6">{editingModuleId ? 'Edit Module' : 'Add New Module'}</h3>
                            <form onSubmit={handleCreateOrUpdateModule} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Module Title</label>
                                    <input
                                        type="text"
                                        value={moduleData.title}
                                        onChange={e => setModuleData({ ...moduleData, title: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                                        placeholder="e.g., Introduction to React"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                    <textarea
                                        value={moduleData.description}
                                        onChange={e => setModuleData({ ...moduleData, description: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                                        rows={3}
                                        placeholder="Brief overview of this module..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Video URL</label>
                                    <input
                                        type="url"
                                        value={moduleData.videoUrl}
                                        onChange={e => setModuleData({ ...moduleData, videoUrl: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Duration (mins)</label>
                                        <input
                                            type="number"
                                            value={moduleData.duration}
                                            onChange={e => setModuleData({ ...moduleData, duration: Number(e.target.value) })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none"
                                            min="0"
                                        />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={moduleData.isFree}
                                                onChange={e => setModuleData({ ...moduleData, isFree: e.target.checked })}
                                                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary-600 focus:ring-primary-500"
                                            />
                                            Free Preview
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-800">
                                    <button type="button" onClick={() => setShowModuleModal(false)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold transition-colors">
                                        {editingModuleId ? 'Update Module' : 'Add Module'}
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
