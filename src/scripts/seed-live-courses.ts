import mongoose from 'mongoose';
import connectDB from '../lib/db';
import Course from '../models/Course';
import User from '../models/User';

const liveCourses = [
    {
        title: 'Full-Stack Web Development Masterclass - Live',
        description: 'Build complete web applications from scratch. Learn React, Node.js, MongoDB, and deployment strategies in this intensive live bootcamp.',
        category: 'programming',
        level: 'intermediate',
        courseType: 'live',
        price: 4999,
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        rating: 4.9,
        reviews: 0,
        enrolledStudents: 0,
        liveScheduledDate: new Date('2025-12-05T18:00:00'),
        modules: [
            {
                title: 'Live Session 1: Frontend Fundamentals',
                description: 'Interactive session on React and modern JavaScript',
                videoUrl: 'https://www.youtube.com/watch?v=live1',
                duration: 120,
                resources: [{ title: 'Session Notes', url: '#' }],
                order: 1
            },
            {
                title: 'Live Session 2: Backend Development',
                description: 'Building REST APIs with Node.js and Express',
                videoUrl: 'https://www.youtube.com/watch?v=live2',
                duration: 120,
                resources: [{ title: 'API Documentation', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'Data Science with Python - Live Workshop',
        description: 'Master data analysis, visualization, and machine learning with Python. Live coding sessions with real-world datasets.',
        category: 'data-science',
        level: 'intermediate',
        courseType: 'live',
        price: 5999,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        rating: 4.8,
        reviews: 0,
        enrolledStudents: 0,
        liveScheduledDate: new Date('2025-12-06T16:00:00'),
        modules: [
            {
                title: 'Live: Python for Data Analysis',
                description: 'Hands-on with Pandas and NumPy',
                videoUrl: 'https://www.youtube.com/watch?v=live3',
                duration: 150,
                resources: [{ title: 'Dataset', url: '#' }],
                order: 1
            }
        ]
    },
    {
        title: 'UI/UX Design Intensive - Live Sessions',
        description: 'Design beautiful and functional user interfaces. Live critique sessions, portfolio building, and industry insights.',
        category: 'design',
        level: 'beginner',
        courseType: 'live',
        price: 3999,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        rating: 4.7,
        reviews: 0,
        enrolledStudents: 0,
        liveScheduledDate: new Date('2025-12-07T17:30:00'),
        modules: [
            {
                title: 'Live: Design Principles',
                description: 'Interactive session on design fundamentals',
                videoUrl: 'https://www.youtube.com/watch?v=live4',
                duration: 90,
                resources: [{ title: 'Design Resources', url: '#' }],
                order: 1
            }
        ]
    },
    {
        title: 'Digital Marketing Strategy - Live Bootcamp',
        description: 'Master SEO, social media marketing, and paid advertising. Live Q&A with marketing experts.',
        category: 'marketing',
        level: 'beginner',
        courseType: 'live',
        price: 4499,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        rating: 4.6,
        reviews: 0,
        enrolledStudents: 0,
        liveScheduledDate: new Date('2025-12-08T15:00:00'),
        modules: [
            {
                title: 'Live: SEO Masterclass',
                description: 'Search engine optimization strategies',
                videoUrl: 'https://www.youtube.com/watch?v=live5',
                duration: 100,
                resources: [{ title: 'SEO Toolkit', url: '#' }],
                order: 1
            }
        ]
    },
    {
        title: 'Cloud Computing with AWS - Live Training',
        description: 'Learn AWS services, deployment, and cloud architecture. Live labs and certification preparation.',
        category: 'programming',
        level: 'advanced',
        courseType: 'live',
        price: 6999,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        rating: 4.9,
        reviews: 0,
        enrolledStudents: 0,
        liveScheduledDate: new Date('2025-12-09T19:00:00'),
        modules: [
            {
                title: 'Live: AWS EC2 & S3',
                description: 'Hands-on with core AWS services',
                videoUrl: 'https://www.youtube.com/watch?v=live6',
                duration: 130,
                resources: [{ title: 'AWS Lab Guide', url: '#' }],
                order: 1
            }
        ]
    },
    {
        title: 'Mobile App Development - Live Course',
        description: 'Build iOS and Android apps with React Native. Live coding and deployment sessions.',
        category: 'programming',
        level: 'intermediate',
        courseType: 'live',
        price: 5499,
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
        rating: 4.8,
        reviews: 0,
        enrolledStudents: 0,
        liveScheduledDate: new Date('2025-12-10T18:30:00'),
        modules: [
            {
                title: 'Live: React Native Coding Practices',
                description: 'Build your first mobile app',
                videoUrl: 'https://www.youtube.com/watch?v=live7',
                duration: 110,
                resources: [{ title: 'Project Template', url: '#' }],
                order: 1
            }
        ]
    },
    {
        title: 'Business Analytics Masterclass - Live',
        description: 'Master Excel, Power BI, and data-driven decision making. Live case studies and projects.',
        category: 'business',
        level: 'beginner',
        courseType: 'live',
        price: 3499,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        rating: 4.7,
        reviews: 0,
        enrolledStudents: 0,
        liveScheduledDate: new Date('2025-12-11T16:30:00'),
        modules: [
            {
                title: 'Live: Excel Advanced Functions',
                description: 'Power Query and Pivot Tables',
                videoUrl: 'https://www.youtube.com/watch?v=live8',
                duration: 95,
                resources: [{ title: 'Excel Templates', url: '#' }],
                order: 1
            }
        ]
    },
    {
        title: 'Cybersecurity Fundamentals - Live Workshop',
        description: 'Learn ethical hacking, network security, and penetration testing. Live demos and hands-on labs.',
        category: 'programming',
        level: 'intermediate',
        courseType: 'live',
        price: 5999,
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
        rating: 4.9,
        reviews: 0,
        enrolledStudents: 0,
        liveScheduledDate: new Date('2025-12-12T19:30:00'),
        modules: [
            {
                title: 'Live: Network Security',
                description: 'Secure your infrastructure',
                videoUrl: 'https://www.youtube.com/watch?v=live9',
                duration: 140,
                resources: [{ title: 'Security Tools', url: '#' }],
                order: 1
            }
        ]
    },
    {
        title: 'Content Writing & Copywriting - Live Sessions',
        description: 'Write compelling content that converts. Live feedback on your writing with industry professionals.',
        category: 'marketing',
        level: 'beginner',
        courseType: 'live',
        price: 2999,
        thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
        rating: 4.6,
        reviews: 0,
        enrolledStudents: 0,
        liveScheduledDate: new Date('2025-12-13T17:00:00'),
        modules: [
            {
                title: 'Live: Writing Essentials',
                description: 'Craft engaging content',
                videoUrl: 'https://www.youtube.com/watch?v=live10',
                duration: 85,
                resources: [{ title: 'Writing Templates', url: '#' }],
                order: 1
            }
        ]
    },
    {
        title: 'Blockchain Development - Live Bootcamp',
        description: 'Build decentralized applications with Solidity and Web3. Live smart contract development.',
        category: 'programming',
        level: 'advanced',
        courseType: 'live',
        price: 7999,
        thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
        rating: 4.9,
        reviews: 0,
        enrolledStudents: 0,
        liveScheduledDate: new Date('2025-12-14T20:00:00'),
        modules: [
            {
                title: 'Live: Smart Contracts',
                description: 'Build and deploy on Ethereum',
                videoUrl: 'https://www.youtube.com/watch?v=live11',
                duration: 150,
                resources: [{ title: 'Solidity Guide', url: '#' }],
                order: 1
            }
        ]
    }
];

async function seedLiveCourses() {
    try {
        await connectDB();
        console.log('📦 Connected to MongoDB');

        // Get instructor
        const instructor = await User.findOne({ email: 'instructor@lms.com' });
        if (!instructor) {
            console.error('❌ Instructor not found. Please run seed-courses.ts first');
            process.exit(1);
        }

        // Add live courses
        const coursesWithInstructor = liveCourses.map(course => ({
            ...course,
            instructor: instructor._id,
            instructorName: instructor.name,
            isPublished: true
        }));

        const createdCourses = await Course.insertMany(coursesWithInstructor);
        console.log(`✅ Created ${createdCourses.length} live courses successfully!`);

        console.log('\n📚 Live Courses Schedule:');
        createdCourses.forEach((course, index) => {
            const date = new Date(course.liveScheduledDate);
            console.log(`${index + 1}. ${course.title}`);
            console.log(`   📅 ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`);
            console.log(`   💰 ₹${course.price}`);
        });

        console.log('\n🎉 Live courses seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding live courses:', error);
        process.exit(1);
    }
}

seedLiveCourses();
