color: 'from-blue-500 to-cyan-500',
        },
{
    icon: <FaChartLine className="text-4xl" />,
        title: 'Track Progress',
            description: 'Monitor your learning journey with detailed analytics',
                color: 'from-purple-500 to-pink-500',
        },
{
    icon: <FaCertificate className="text-4xl" />,
        title: 'Earn Certificates',
            description: 'Get recognized for your achievements with official certificates',
                color: 'from-orange-500 to-red-500',
        },
{
    icon: <FaTrophy className="text-4xl" />,
        title: 'Interactive Quizzes',
            description: 'Test your knowledge with engaging quizzes and assessments',
                color: 'from-green-500 to-teal-500',
        },
    ];

const stats = [
    { label: 'Active Students', value: '10,000+', icon: <FaUsers /> },
    { label: 'Courses Available', value: '500+', icon: <FaBook /> },
    { label: 'Success Rate', value: '95%', icon: <FaTrophy /> },
    { label: 'Expert Instructors', value: '150+', icon: <FaGraduationCap /> },
];

return (
    <div>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-6xl md:text-7xl font-bold gradient-text mb-6">
                            Transform Your Future
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 mb-8">
                            Master new skills with our world-class learning platform. Join thousands of learners advancing their careers.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link href="/courses">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
                            >
                                <span>Explore Courses</span>
                                <FaArrowRight />
                            </motion.button>
                        </Link>

                        <Link href="/register">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-secondary text-lg px-8 py-4"
                            >
                                Get Started Free
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Floating Icon */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="mt-16"
                    >
                        <FaRocket className="text-8xl mx-auto gradient-text opacity-50" />
                    </motion.div>
                </div>
            </div>
        </section>

        {/* Live Classes Section */}
        <section className="py-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        Live Classes
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Join interactive live sessions with expert instructors. Ask questions, collaborate with peers, and learn in real-time.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            title: 'Web Development Bootcamp',
                            instructor: 'John Doe',
                            date: 'Today, 6:00 PM',
                            students: 45,
                            duration: '2 hours',
                            color: 'from-blue-500 to-cyan-500'
                        },
                        {
                            title: 'Data Science Masterclass',
                            instructor: 'Jane Smith',
                            date: 'Tomorrow, 4:00 PM',
                            students: 32,
                            duration: '1.5 hours',
                            color: 'from-purple-500 to-pink-500'
                        },
                        {
                            title: 'UI/UX Design Workshop',
                            instructor: 'Mike Johnson',
                            date: 'Dec 2, 5:00 PM',
                            students: 28,
                            duration: '3 hours',
                            color: 'from-orange-500 to-red-500'
                        }
                    ].map((liveClass, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="glass rounded-xl p-6 cursor-pointer relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${liveClass.color} opacity-20 rounded-bl-full`} />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full animate-pulse">
                                        LIVE
                                    </span>
                                    <span className="text-slate-400 text-sm">{liveClass.duration}</span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">
                                    {liveClass.title}
                                </h3>

                                <p className="text-slate-400 text-sm mb-4">
                                    by {liveClass.instructor}
                                </p>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2 text-slate-400">
                                        <FaUsers />
                                        <span>{liveClass.students} students</span>
                                    </div>
                                    <span className="text-slate-500">{liveClass.date}</span>
                                </div>

                                <button className="w-full mt-4 btn-primary text-sm py-2">
                                    Join Live Class
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Recorded Classes Section */}
        <section className="py-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        Recorded Classes
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Learn at your own pace with our extensive library of recorded courses. Watch anytime, anywhere.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        {
                            title: 'React.js Complete Guide',
                            instructor: 'Sarah Wilson',
                            videos: 45,
                            duration: '12 hours',
                            rating: 4.8,
                            students: 1250,
                            color: 'from-cyan-500 to-blue-500'
                        },
                        {
                            title: 'Python for Beginners',
                            instructor: 'Tom Anderson',
                            videos: 38,
                            duration: '10 hours',
                            rating: 4.9,
                            students: 2100,
                            color: 'from-green-500 to-emerald-500'
                        },
                        {
                            title: 'Digital Marketing Pro',
                            instructor: 'Emily Chen',
                            videos: 52,
                            duration: '15 hours',
                            rating: 4.7,
                            students: 980,
                            color: 'from-pink-500 to-rose-500'
                        },
                        {
                            title: 'Machine Learning A-Z',
                            instructor: 'David Lee',
                            videos: 68,
                            duration: '20 hours',
                            rating: 4.9,
                            students: 1650,
                            color: 'from-purple-500 to-indigo-500'
                        }
                    ].map((course, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -10 }}
                            className="glass rounded-xl overflow-hidden cursor-pointer"
                        >
                            <div className={`h-40 bg-gradient-to-br ${course.color} flex items-center justify-center relative`}>
                                <FaBook className="text-white text-6xl opacity-50" />
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {course.duration}
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {course.title}
                                </h3>

                                <p className="text-slate-400 text-sm mb-3">
                                    {course.instructor}
                                </p>

                                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                                    <span>{course.videos} videos</span>
                                    <div className="flex items-center space-x-1">
                                        <FaTrophy className="text-yellow-500" />
                                        <span>{course.rating}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 text-xs text-slate-500 mb-3">
                                    <FaUsers />
                                    <span>{course.students.toLocaleString()} students</span>
                                </div>

                                <button className="w-full btn-secondary text-sm py-2">
                                    Start Learning
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="glass rounded-xl p-6 text-center"
                        >
                            <div className="text-4xl gradient-text mb-2">
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-slate-400 text-sm">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        Why Choose LearnHub?
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Experience the future of online learning with our cutting-edge platform
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -10 }}
                            className="card-hover p-6"
                        >
                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 pulse-glow`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass rounded-2xl p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                            Ready to Start Learning?
                        </h2>
                        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                            Join our community of learners and unlock your potential today
                        </p>
                        <Link href="/register">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary text-lg px-10 py-4"
                            >
                                Start Learning Now
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    </div>
);
}
