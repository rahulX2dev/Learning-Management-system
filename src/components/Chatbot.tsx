'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';

interface Message {
    text: string;
    isBot: boolean;
    timestamp: Date;
}

const faqResponses: Record<string, string> = {
    'hello': 'Hello! 👋 How can I help you today?',
    'hi': 'Hi there! How can I assist you with your learning journey?',
    'help': 'I can help you with:\n• Course enrollment\n• Payment issues\n• Technical support\n• Finding courses\n• Account questions\n\nJust ask me anything!',
    'course': 'You can browse all our courses at the Courses page. We offer programming, design, business, and data science courses!',
    'enroll': 'To enroll in a course:\n1. Browse courses\n2. Click on a course you like\n3. Click "Enroll Now"\n4. Complete payment if required\n\nNeed help with a specific course?',
    'payment': 'For payment issues:\n• We accept all major cards\n• Prices are in Indian Rupees (₹)\n• Contact support@lms.com for payment problems\n• Refunds available within 7 days',
    'login': 'Having trouble logging in?\n1. Check your email and password\n2. Try "Forgot Password" if needed\n3. Clear browser cache\n4. Contact support if issue persists',
    'certificate': 'Certificates are awarded after:\n• Completing all modules\n• Passing all quizzes\n• Submitting assignments\n\nYou can download from My Courses!',
    'live': 'Live classes are scheduled sessions where you can:\n• Interact with instructors\n• Ask questions in real-time\n• Collaborate with peers\n\nCheck the homepage for upcoming sessions!',
    'price': 'Course prices range from ₹2,999 to ₹7,999. We also offer:\n• Student discounts\n• EMI options\n• Special coupon codes\n\nCheck individual courses for exact pricing!',
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            text: 'Hi! I\'m your learning assistant. How can I help you today?',
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');

    const findResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase();

        // Check for keyword matches
        for (const [keyword, response] of Object.entries(faqResponses)) {
            if (lowerQuery.includes(keyword)) {
                return response;
            }
        }

        // Default response
        return 'I\'m not sure about that. Here are some things I can help with:\n• Course enrollment\n• Payment & pricing\n• Login issues\n• Certificates\n• Live classes\n\nOr contact support@lms.com for direct assistance!';
    };

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage: Message = {
            text: input,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        // Get bot response
        setTimeout(() => {
            const botResponse: Message = {
                text: findResponse(input),
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        }, 500);

        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Chat Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow"
            >
                {isOpen ? (
                    <FaTimes className="text-white text-2xl" />
                ) : (
                    <FaComments className="text-white text-2xl" />
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-96 h-[600px] glass rounded-2xl flex flex-col shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 flex items-center space-x-3">
                            <FaRobot className="text-white text-2xl" />
                            <div className="flex-grow">
                                <h3 className="text-white font-bold">Support Assistant</h3>
                                <p className="text-white/80 text-xs">Always here to help!</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${message.isBot
                                                ? 'bg-slate-700 text-white'
                                                : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                        <span className="text-xs opacity-60 mt-1 block">
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-700">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your question..."
                                    className="flex-grow px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSend}
                                    className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg text-white"
                                >
                                    <FaPaperPlane />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
