'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { FaPlay, FaRedo, FaCode, FaChevronLeft, FaChevronRight, FaFilter, FaLightbulb, FaTrophy, FaFire, FaStar, FaChevronDown, FaCheck, FaSearch, FaLaptopCode, FaTerminal, FaExpand, FaCompress, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Challenge {
    _id: string;
    title: string;
    problemNumber: number;
    level: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    description: string;
    starterCode: string;
    tags: string[];
    hints?: string[];
    testCases?: {
        input: string;
        expectedOutput: string;
        explanation?: string;
    }[];
}

type LanguageType = 'javascript' | 'python' | 'java' | 'c' | 'cpp';

const Dropdown = ({
    options,
    value,
    onChange,
    label,
    icon: Icon,
    className = ''
}: {
    options: { value: string; label: string }[],
    value: string,
    onChange: (val: string) => void,
    label?: string,
    icon?: any,
    className?: string
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                const target = event.target as HTMLElement;
                if (!target.closest('.dropdown-portal-content')) {
                    setIsOpen(false);
                }
            }
        };

        if (isOpen) {
            updateCoords();
            window.addEventListener('resize', updateCoords);
            window.addEventListener('scroll', updateCoords, true);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            window.removeEventListener('resize', updateCoords);
            window.removeEventListener('scroll', updateCoords, true);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const updateCoords = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 8,
                left: rect.left,
                width: rect.width
            });
        }
    };

    const selectedLabel = options.find(opt => opt.value === value)?.label || value;

    return (
        <div className={`relative ${className}`}>
            {label && <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">{label}</label>}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3.5 rounded-2xl flex items-center justify-between transition-all duration-300 border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] group shadow-lg shadow-black/20 backdrop-blur-sm`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {Icon && <Icon className="text-primary-400 text-lg flex-shrink-0" />}
                    <span className="font-medium text-slate-200 truncate group-hover:text-white transition-colors">{selectedLabel}</span>
                </div>
                <div className={`w-6 h-6 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-180 bg-primary-500/20 text-primary-400' : 'text-slate-400 group-hover:text-white'}`}>
                    <FaChevronDown className="text-[10px]" />
                </div>
            </button>

            {mounted && isOpen && createPortal(
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{
                            position: 'fixed',
                            top: coords.top,
                            left: coords.left,
                            width: coords.width,
                            zIndex: 9999
                        }}
                        className="dropdown-portal-content overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a]/95 backdrop-blur-xl shadow-2xl ring-1 ring-white/5"
                    >
                        <div className="max-h-64 overflow-y-auto no-scrollbar p-2 space-y-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 rounded-xl text-left text-sm flex items-center justify-between transition-all duration-200 group/item ${value === option.value
                                        ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-white font-medium border border-primary-500/20'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                                        }`}
                                >
                                    <span className="truncate mr-2">{option.label}</span>
                                    {value === option.value && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30"
                                        >
                                            <FaCheck className="text-[10px] text-white" />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default function CodingLabPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState<LanguageType>('javascript');
    const [loading, setLoading] = useState(true);
    const [selectedLevel, setSelectedLevel] = useState<number>(1);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hintsExpanded, setHintsExpanded] = useState(false);
    const [testCasesExpanded, setTestCasesExpanded] = useState(false);

    const categories = ['all', 'Arrays', 'Strings', 'Linked Lists', 'Stacks & Queues', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting & Searching', 'Math', 'Bit Manipulation'];

    useEffect(() => {
        fetchChallenges();
    }, [selectedLevel, selectedDifficulty, selectedCategory, page]);

    const fetchChallenges = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                level: selectedLevel.toString(),
                page: page.toString(),
                limit: '50'
            });

            if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
            if (selectedCategory !== 'all') params.append('category', selectedCategory);

            const response = await axios.get(`/api/challenges?${params}`);
            if (response.data.success) {
                setChallenges(response.data.challenges);
                setTotalPages(response.data.pagination.totalPages);

                if (response.data.challenges.length > 0 && !selectedChallenge) {
                    handleChallengeSelect(response.data.challenges[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching challenges:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStarterCodeForLanguage = (challenge: Challenge, lang: LanguageType): string => {
        const title = challenge.title;

        switch (lang) {
            case 'javascript':
                return `// ${title}\n\nfunction solution() {\n    // Your code here\n    \n}\n\nconsole.log(solution());`;
            case 'python':
                return `# ${title}\n\ndef solution():\n    # Your code here\n    pass\n\nprint(solution())`;
            case 'java':
                return `// ${title}\n\npublic class Solution {\n    public static void solution() {\n        // Your code here\n    }\n    \n    public static void main(String[] args) {\n        solution();\n    }\n}`;
            case 'c':
                return `// ${title}\n\n#include <stdio.h>\n\nvoid solution() {\n    // Your code here\n}\n\nint main() {\n    solution();\n    return 0;\n}`;
            case 'cpp':
                return `// ${title}\n\n#include <iostream>\nusing namespace std;\n\nvoid solution() {\n    // Your code here\n}\n\nint main() {\n    solution();\n    return 0;\n}`;
            default:
                return challenge.starterCode;
        }
    };

    const handleChallengeSelect = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setCode(getStarterCodeForLanguage(challenge, language));
        setOutput('');
        setHintsExpanded(false);
        setTestCasesExpanded(false);
    };

    const handleNextChallenge = () => {
        if (!selectedChallenge || challenges.length === 0) return;
        const currentIndex = challenges.findIndex(c => c._id === selectedChallenge._id);
        const nextIndex = (currentIndex + 1) % challenges.length;
        handleChallengeSelect(challenges[nextIndex]);
    };

    const handlePrevChallenge = () => {
        if (!selectedChallenge || challenges.length === 0) return;
        const currentIndex = challenges.findIndex(c => c._id === selectedChallenge._id);
        const prevIndex = (currentIndex - 1 + challenges.length) % challenges.length;
        handleChallengeSelect(challenges[prevIndex]);
    };

    const handleLanguageChange = (newLang: LanguageType) => {
        setLanguage(newLang);
        if (selectedChallenge) {
            setCode(getStarterCodeForLanguage(selectedChallenge, newLang));
            setOutput('');
        }
    };

    const runCode = () => {
        if (language !== 'javascript') {
            setOutput('💡 Note: Only JavaScript can be executed in browser.\n📝 For other languages, copy code to your IDE.');
            return;
        }

        try {
            const logs: string[] = [];
            const originalLog = console.log;
            console.log = (...args) => {
                logs.push(args.map(arg => String(arg)).join(' '));
            };

            eval(code);
            console.log = originalLog;

            setOutput(logs.join('\n') || '✅ Code executed successfully!');
        } catch (error: any) {
            setOutput(`❌ Error: ${error.message}`);
        }
    };

    const resetCode = () => {
        if (selectedChallenge) {
            setCode(getStarterCodeForLanguage(selectedChallenge, language));
            setOutput('');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 selection:bg-primary-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col h-full p-4 lg:p-6 max-w-[1920px] mx-auto w-full">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <FaCode className="text-xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">DSA Coding Lab</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10 backdrop-blur-md">
                        {[1, 2, 3, 4, 5].map((level) => (
                            <button key={level} onClick={() => { setSelectedLevel(level); setPage(1); }}
                                className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all duration-300 relative overflow-hidden ${selectedLevel === level ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                {selectedLevel === level && (
                                    <motion.div
                                        layoutId="level-active"
                                        className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600"
                                    />
                                )}
                                <span className="relative z-10">Level {level}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Main Content - Horizontal Split */}
                <div className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100vh-140px)]">

                    {/* LEFT COLUMN: Filters & Question (40%) */}
                    <div className="w-full lg:w-[40%] flex flex-col gap-4 h-full">
                        {/* Filters Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass rounded-xl p-3 border border-white/10 relative z-30 w-full flex-shrink-0"
                        >
                            <div className="flex items-center gap-2 mb-2 text-white font-bold text-xs">
                                <FaFilter className="text-primary-400" />
                                <span>Filters</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Dropdown
                                    label="Difficulty"
                                    value={selectedDifficulty}
                                    onChange={(val) => { setSelectedDifficulty(val); setPage(1); }}
                                    icon={FaTrophy}
                                    options={[
                                        { value: 'all', label: 'All Difficulties' },
                                        { value: 'easy', label: 'Easy' },
                                        { value: 'medium', label: 'Medium' },
                                        { value: 'hard', label: 'Hard' }
                                    ]}
                                />
                                <Dropdown
                                    label="Category"
                                    value={selectedCategory}
                                    onChange={(val) => { setSelectedCategory(val); setPage(1); }}
                                    icon={FaLightbulb}
                                    options={categories.map(cat => ({ value: cat, label: cat === 'all' ? 'All Categories' : cat }))}
                                />
                            </div>
                        </motion.div>

                        {/* Question Section - Full Height Remaining */}
                        {selectedChallenge ? (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass rounded-xl border border-white/10 relative overflow-hidden flex flex-col flex-grow"
                            >
                                {/* Navigation Header */}
                                <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between flex-shrink-0">
                                    <button
                                        onClick={handlePrevChallenge}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold"
                                    >
                                        <FaArrowLeft /> Prev
                                    </button>

                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Problem</span>
                                        <span className="text-sm font-bold text-white">#{selectedChallenge.problemNumber}</span>
                                    </div>

                                    <button
                                        onClick={handleNextChallenge}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold"
                                    >
                                        Next <FaArrowRight />
                                    </button>
                                </div>

                                {/* Scrollable Content */}
                                <div className="p-6 overflow-y-auto no-scrollbar flex-grow relative">
                                    <div className="absolute top-0 right-0 p-40 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-3xl -z-10" />

                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <h2 className="text-2xl font-bold text-white leading-tight">
                                                {selectedChallenge.title}
                                            </h2>
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${selectedChallenge.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : selectedChallenge.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 'bg-rose-500/20 text-rose-400 border border-rose-500/20'}`}>
                                                {selectedChallenge.difficulty}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {selectedChallenge.tags.map((tag, idx) => (
                                                <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="h-px w-full bg-white/5 my-2" />

                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                                                {selectedChallenge.description}
                                            </p>
                                        </div>

                                        {/* Hints Section */}
                                        {selectedChallenge.hints && selectedChallenge.hints.length > 0 && (
                                            <div className="mt-6 bg-yellow-500/5 rounded-xl border border-yellow-500/10 overflow-hidden">
                                                <button
                                                    onClick={() => setHintsExpanded(!hintsExpanded)}
                                                    className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FaLightbulb className={`text-yellow-500 ${hintsExpanded ? 'text-yellow-400' : ''}`} />
                                                        <span>Hints</span>
                                                    </div>
                                                    <FaChevronDown className={`transition-transform duration-300 ${hintsExpanded ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {hintsExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-4 pt-0 border-t border-yellow-500/10">
                                                                <ul className="space-y-3">
                                                                    {selectedChallenge.hints.map((hint, i) => (
                                                                        <li key={i} className="text-xs text-slate-400 flex gap-3 leading-relaxed">
                                                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                                                                            <span className="pt-0.5">{hint}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}

                                        {/* Test Cases Section */}
                                        {selectedChallenge.testCases && selectedChallenge.testCases.length > 0 && (
                                            <div className="mt-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 overflow-hidden">
                                                <button
                                                    onClick={() => setTestCasesExpanded(!testCasesExpanded)}
                                                    className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FaCheck className={`text-emerald-500 ${testCasesExpanded ? 'text-emerald-400' : ''}`} />
                                                        <span>Test Cases</span>
                                                    </div>
                                                    <FaChevronDown className={`transition-transform duration-300 ${testCasesExpanded ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence>
                                                    {testCasesExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-4 pt-0 border-t border-emerald-500/10 space-y-3">
                                                                {selectedChallenge.testCases.map((testCase, i) => (
                                                                    <div key={i} className="bg-black/20 rounded-lg p-3 border border-white/5">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Test Case {i + 1}</span>
                                                                        </div>
                                                                        <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                                                                            <div>
                                                                                <span className="text-slate-500 block mb-1">Input:</span>
                                                                                <div className="bg-black/40 p-2 rounded text-slate-300">{testCase.input}</div>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-slate-500 block mb-1">Output:</span>
                                                                                <div className="bg-black/40 p-2 rounded text-emerald-400">{testCase.expectedOutput}</div>
                                                                            </div>
                                                                            {testCase.explanation && (
                                                                                <div>
                                                                                    <span className="text-slate-500 block mb-1">Explanation:</span>
                                                                                    <div className="text-slate-400 italic">{testCase.explanation}</div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="glass rounded-xl flex items-center justify-center flex-grow border border-white/10">
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                        <FaSearch className="text-slate-500" />
                                    </div>
                                    <p className="text-slate-400 text-sm">No challenges found</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Editor & Console (60%) */}
                    <div className="w-full lg:w-[60%] flex flex-col gap-4 h-full">
                        {/* Code Editor (Top of Right Column) */}
                        <div className="glass rounded-xl overflow-hidden border border-white/10 flex flex-col shadow-2xl flex-grow h-[60%]">
                            <div className="bg-[#0f172a] p-2 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                        <FaCode className="text-primary-400 text-xs" />
                                        <span className="text-xs font-bold text-white">Editor</span>
                                    </div>
                                    <div className="w-36">
                                        <Dropdown
                                            value={language}
                                            onChange={(val) => handleLanguageChange(val as LanguageType)}
                                            options={[
                                                { value: 'javascript', label: 'JavaScript' },
                                                { value: 'python', label: 'Python' },
                                                { value: 'java', label: 'Java' },
                                                { value: 'c', label: 'C' },
                                                { value: 'cpp', label: 'C++' }
                                            ]}
                                            className="scale-90 origin-left"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={resetCode} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95" title="Reset Code">
                                        <FaRedo className="text-xs" />
                                    </button>
                                    <button onClick={runCode} className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg flex items-center gap-2 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 hover:shadow-emerald-500/40">
                                        <FaPlay className="text-[10px]" /> Run Code
                                    </button>
                                </div>
                            </div>
                            <div className="flex-grow relative group bg-[#1e1e1e]">
                                <Editor
                                    height="100%"
                                    language={language}
                                    value={code}
                                    onChange={(value) => setCode(value || '')}
                                    theme="vs-dark"
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        lineNumbers: 'on',
                                        automaticLayout: true,
                                        scrollBeyondLastLine: false,
                                        padding: { top: 16, bottom: 16 },
                                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                        fontLigatures: true,
                                        cursorBlinking: 'smooth',
                                        smoothScrolling: true,
                                        contextmenu: true,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Console Output (Bottom of Right Column) */}
                        <div className="glass rounded-xl overflow-hidden border border-white/10 flex flex-col flex-shrink-0 h-[35%]">
                            <div className="bg-[#0f172a] p-2 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                                <span className="text-white font-bold text-xs flex items-center gap-2">
                                    <FaTerminal className="text-emerald-400" />
                                    Console Output
                                </span>
                                <button
                                    onClick={() => setOutput('')}
                                    className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-white/5"
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="flex-grow bg-black/40 p-3 overflow-y-auto no-scrollbar font-mono text-xs">
                                {output ? (
                                    <pre className="text-emerald-400 whitespace-pre-wrap">
                                        {output}
                                    </pre>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 gap-2">
                                        <p className="text-[10px] font-medium uppercase tracking-widest">Run code to see output</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
