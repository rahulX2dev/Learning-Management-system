import mongoose from 'mongoose';
import connectDB from '../lib/db';
import Course from '../models/Course';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const demoCourses = [
    // MASTER CLASSES (Premium, comprehensive)
    {
        title: 'Complete Web Development Bootcamp 2024',
        description: 'Master HTML, CSS, JavaScript, React, Node.js, and become a full-stack web developer. Build 15+ real-world projects.',
        category: 'programming',
        level: 'beginner',
        courseType: 'masterclass' as const,
        price: 99.99,
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        rating: 4.8,
        reviews: 1250,
        enrolledStudents: 3420,
        modules: [
            {
                title: 'HTML & CSS Fundamentals',
                description: 'Learn the building blocks of web development',
                videoUrl: 'https://www.youtube.com/watch?v=mU6anWqZJcc',
                duration: 120,
                resources: [{ title: 'HTML Cheatsheet', url: '#' }],
                order: 1
            },
            {
                title: 'JavaScript Essentials',
                description: 'Master JavaScript programming from coding practices to advanced',
                videoUrl: 'https://www.youtube.com/watch?v=W6NZfY996PY',
                duration: 180,
                resources: [{ title: 'JS Guide', url: '#' }],
                order: 2
            },
            {
                title: 'React.js Development',
                description: 'Build modern web apps with React',
                videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
                duration: 150,
                resources: [{ title: 'React Docs', url: '#' }],
                order: 3
            }
        ]
    },
    {
        title: 'Python for Data Science & Machine Learning',
        description: 'Learn Python, NumPy, Pandas, Matplotlib, Scikit-Learn, and build ML models from scratch.',
        category: 'data-science',
        level: 'intermediate',
        courseType: 'masterclass' as const,
        price: 129.99,
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
        rating: 4.9,
        reviews: 890,
        enrolledStudents: 2100,
        modules: [
            {
                title: 'Python Programming Coding Practices',
                description: 'Introduction to Python syntax and concepts',
                videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
                duration: 90,
                resources: [{ title: 'Python Setup', url: '#' }],
                order: 1
            },
            {
                title: 'Data Analysis with Pandas',
                description: 'Master data manipulation and analysis',
                videoUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
                duration: 120,
                resources: [{ title: 'Pandas Cheatsheet', url: '#' }],
                order: 2
            },
            {
                title: 'Machine Learning Algorithms',
                description: 'Build predictive models with scikit-learn',
                videoUrl: 'https://www.youtube.com/watch?v=7eh4d6sabA0',
                duration: 200,
                resources: [{ title: 'ML Guide', url: '#' }],
                order: 3
            }
        ]
    },
    {
        title: 'UI/UX Design Masterclass',
        description: 'Learn user interface and user experience design. Master Figma, Adobe XD, and design thinking principles.',
        category: 'design',
        level: 'beginner',
        price: 79.99,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        rating: 4.7,
        reviews: 650,
        enrolledStudents: 1850,
        modules: [
            {
                title: 'Design Fundamentals',
                description: 'Learn color theory, typography, and composition',
                videoUrl: 'https://www.youtube.com/watch?v=YqQx75OPRa0',
                duration: 100,
                resources: [{ title: 'Design Principles', url: '#' }],
                order: 1
            },
            {
                title: 'Figma Mastery',
                description: 'Complete guide to Figma design tool',
                videoUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
                duration: 140,
                resources: [{ title: 'Figma Resources', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'Digital Marketing Complete Course',
        description: 'Master SEO, social media marketing, email marketing, Google Ads, and build successful campaigns.',
        category: 'marketing',
        level: 'beginner',
        price: 89.99,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        rating: 4.6,
        reviews: 420,
        enrolledStudents: 1200,
        modules: [
            {
                title: 'SEO Fundamentals',
                description: 'Search engine optimization coding practices',
                videoUrl: 'https://www.youtube.com/watch?v=DvwS7cV9GmQ',
                duration: 110,
                resources: [{ title: 'SEO Checklist', url: '#' }],
                order: 1
            },
            {
                title: 'Social Media Marketing',
                description: 'Master Facebook, Instagram, and LinkedIn ads',
                videoUrl: 'https://www.youtube.com/watch?v=BARAcaL_sxk',
                duration: 130,
                resources: [{ title: 'Social Templates', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'Node.js & Express Backend Development',
        description: 'Build scalable REST APIs with Node.js, Express, MongoDB. Learn authentication, security, and deployment.',
        category: 'programming',
        level: 'intermediate',
        price: 94.99,
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
        rating: 4.8,
        reviews: 780,
        enrolledStudents: 1650,
        modules: [
            {
                title: 'Node.js Coding Practices',
                description: 'Introduction to Node.js runtime',
                videoUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
                duration: 100,
                resources: [{ title: 'Node Docs', url: '#' }],
                order: 1
            },
            {
                title: 'Express Framework',
                description: 'Build web servers with Express',
                videoUrl: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
                duration: 120,
                resources: [{ title: 'Express Guide', url: '#' }],
                order: 2
            },
            {
                title: 'MongoDB Integration',
                description: 'Database integration and CRUD operations',
                videoUrl: 'https://www.youtube.com/watch?v=ofme2o29ngU',
                duration: 140,
                resources: [{ title: 'MongoDB Atlas', url: '#' }],
                order: 3
            }
        ]
    },
    {
        title: 'Mobile App Development with React Native',
        description: 'Build iOS and Android apps with React Native. Learn navigation, state management, and app deployment.',
        category: 'programming',
        level: 'intermediate',
        price: 109.99,
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
        rating: 4.7,
        reviews: 560,
        enrolledStudents: 1340,
        modules: [
            {
                title: 'React Native Setup',
                description: 'Environment setup and first app',
                videoUrl: 'https://www.youtube.com/watch?v=0-S5a0eXPoc',
                duration: 90,
                resources: [{ title: 'Setup Guide', url: '#' }],
                order: 1
            },
            {
                title: 'Building UI Components',
                description: 'Create reusable mobile components',
                videoUrl: 'https://www.youtube.com/watch?v=ur6I5m2nTvk',
                duration: 150,
                resources: [{ title: 'Component Library', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'AWS Cloud Practitioner Complete Guide',
        description: 'Master Amazon Web Services. Learn EC2, S3, Lambda, RDS, and prepare for AWS certification.',
        category: 'programming',
        level: 'advanced',
        price: 119.99,
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        rating: 4.9,
        reviews: 920,
        enrolledStudents: 2450,
        modules: [
            {
                title: 'AWS Fundamentals',
                description: 'Introduction to cloud computing and AWS',
                videoUrl: 'https://www.youtube.com/watch?v=ulprqHHWlng',
                duration: 100,
                resources: [{ title: 'AWS Free Tier', url: '#' }],
                order: 1
            },
            {
                title: 'EC2 & S3 Services',
                description: 'Compute and storage services',
                videoUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s',
                duration: 130,
                resources: [{ title: 'AWS Console Guide', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'Graphic Design with Adobe Creative Suite',
        description: 'Master Photoshop, Illustrator, and InDesign. Create stunning graphics, logos, and marketing materials.',
        category: 'design',
        level: 'beginner',
        price: 84.99,
        thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
        rating: 4.6,
        reviews: 510,
        enrolledStudents: 1420,
        modules: [
            {
                title: 'Photoshop Essentials',
                description: 'Photo editing and manipulation',
                videoUrl: 'https://www.youtube.com/watch?v=IyR_uYsRdPs',
                duration: 140,
                resources: [{ title: 'PS Shortcuts', url: '#' }],
                order: 1
            },
            {
                title: 'Illustrator for Logos',
                description: 'Vector graphics and logo design',
                videoUrl: 'https://www.youtube.com/watch?v=Ib8UBwu3yGA',
                duration: 120,
                resources: [{ title: 'Logo Templates', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'Cybersecurity Fundamentals',
        description: 'Learn ethical hacking, network security, cryptography, and protect systems from cyber threats.',
        category: 'programming',
        level: 'intermediate',
        price: 99.99,
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
        rating: 4.8,
        reviews: 670,
        enrolledStudents: 1590,
        modules: [
            {
                title: 'Network Security Coding Practices',
                description: 'Understanding network protocols and security',
                videoUrl: 'https://www.youtube.com/watch?v=qiQR5rTSshw',
                duration: 110,
                resources: [{ title: 'Security Tools', url: '#' }],
                order: 1
            },
            {
                title: 'Ethical Hacking',
                description: 'Penetration testing fundamentals',
                videoUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
                duration: 160,
                resources: [{ title: 'Hacking Lab', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'Business Analytics with Excel & Power BI',
        description: 'Master data analysis, visualization, and business intelligence with Excel and Microsoft Power BI.',
        category: 'business',
        level: 'beginner',
        price: 74.99,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        rating: 4.7,
        reviews: 490,
        enrolledStudents: 1280,
        modules: [
            {
                title: 'Excel Advanced Functions',
                description: 'Formulas, pivot tables, and macros',
                videoUrl: 'https://www.youtube.com/watch?v=rwbho0CgEAE',
                duration: 100,
                resources: [{ title: 'Excel Templates', url: '#' }],
                order: 1
            },
            {
                title: 'Power BI Dashboards',
                description: 'Create interactive business dashboards',
                videoUrl: 'https://www.youtube.com/watch?v=TmhQCQr_DCA',
                duration: 130,
                resources: [{ title: 'BI Reports', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'Flutter App Development',
        description: 'Build beautiful cross-platform mobile apps with Flutter and Dart. Deploy to iOS and Android.',
        category: 'programming',
        level: 'intermediate',
        price: 104.99,
        thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
        rating: 4.8,
        reviews: 620,
        enrolledStudents: 1470,
        modules: [
            {
                title: 'Dart Programming',
                description: 'Learn Dart language fundamentals',
                videoUrl: 'https://www.youtube.com/watch?v=Ej_Pcr4uC2Q',
                duration: 80,
                resources: [{ title: 'Dart Guide', url: '#' }],
                order: 1
            },
            {
                title: 'Flutter Widgets',
                description: 'Build UI with Flutter widgets',
                videoUrl: 'https://www.youtube.com/watch?v=1gDhl4leEzA',
                duration: 140,
                resources: [{ title: 'Widget Catalog', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'Content Writing & Copywriting Mastery',
        description: 'Learn to write compelling content, sales copy, blog posts, and become a professional content writer.',
        category: 'marketing',
        level: 'beginner',
        price: 64.99,
        thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
        rating: 4.5,
        reviews: 380,
        enrolledStudents: 980,
        modules: [
            {
                title: 'Writing Fundamentals',
                description: 'Grammar, style, and tone',
                videoUrl: 'https://www.youtube.com/watch?v=eNaVfYF0VBw',
                duration: 90,
                resources: [{ title: 'Writing Guide', url: '#' }],
                order: 1
            },
            {
                title: 'Copywriting Techniques',
                description: 'Write persuasive sales copy',
                videoUrl: 'https://www.youtube.com/watch?v=SMWJqQy_i18',
                duration: 110,
                resources: [{ title: 'Copy Templates', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'Blockchain & Cryptocurrency Development',
        description: 'Learn blockchain technology, smart contracts, Solidity, and build DeFi applications.',
        category: 'programming',
        level: 'advanced',
        price: 139.99,
        thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
        rating: 4.9,
        reviews: 540,
        enrolledStudents: 1120,
        modules: [
            {
                title: 'Blockchain Coding Practices',
                description: 'Understanding blockchain technology',
                videoUrl: 'https://www.youtube.com/watch?v=qOVAbKKSH10',
                duration: 120,
                resources: [{ title: 'Blockchain White paper', url: '#' }],
                order: 1
            },
            {
                title: 'Smart Contracts with Solidity',
                description: 'Write and deploy smart contracts',
                videoUrl: 'https://www.youtube.com/watch?v=M576WGiDBdQ',
                duration: 180,
                resources: [{ title: 'Solidity Docs', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'Video Editing with Adobe Premiere Pro',
        description: 'Master video editing, color grading, transitions, effects, and create professional videos.',
        category: 'design',
        level: 'beginner',
        price: 79.99,
        thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
        rating: 4.7,
        reviews: 450,
        enrolledStudents: 1230,
        modules: [
            {
                title: 'Premiere Pro Interface',
                description: 'Learn the editing workspace',
                videoUrl: 'https://www.youtube.com/watch?v=Hls3Tp7JS8E',
                duration: 70,
                resources: [{ title: 'Shortcuts Guide', url: '#' }],
                order: 1
            },
            {
                title: 'Advanced Editing Techniques',
                description: 'Color grading and effects',
                videoUrl: 'https://www.youtube.com/watch?v=2uqD3BPHJoI',
                duration: 130,
                resources: [{ title: 'LUT Pack', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'DevOps Engineering Complete Course',
        description: 'Master Docker, Kubernetes, Jenkins, CI/CD pipelines, and modern DevOps practices.',
        category: 'programming',
        level: 'advanced',
        price: 124.99,
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
        rating: 4.9,
        reviews: 710,
        enrolledStudents: 1780,
        modules: [
            {
                title: 'Docker Containerization',
                description: 'Create and manage Docker containers',
                videoUrl: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
                duration: 140,
                resources: [{ title: 'Docker Cheatsheet', url: '#' }],
                order: 1
            },
            {
                title: 'Kubernetes Orchestration',
                description: 'Deploy apps with Kubernetes',
                videoUrl: 'https://www.youtube.com/watch?v=X48VuDVv0do',
                duration: 170,
                resources: [{ title: 'K8s Guide', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'Project Management Professional (PMP)',
        description: 'Prepare for PMP certification. Learn agile, scrum, project planning, and management best practices.',
        category: 'business',
        level: 'intermediate',
        price: 94.99,
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
        rating: 4.6,
        reviews: 410,
        enrolledStudents: 1050,
        modules: [
            {
                title: 'Project Management Fundamentals',
                description: 'PMBOK Guide overview',
                videoUrl: 'https://www.youtube.com/watch?v=uhI7gShmj0s',
                duration: 110,
                resources: [{ title: 'PMBOK PDF', url: '#' }],
                order: 1
            },
            {
                title: 'Agile & Scrum',
                description: 'Modern project management methodologies',
                videoUrl: 'https://www.youtube.com/watch?v=XU0llRltyFM',
                duration: 100,
                resources: [{ title: 'Agile Guide', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'SQL & Database Management',
        description: 'Master SQL queries, database design, normalization, indexes, and work with MySQL, PostgreSQL.',
        category: 'programming',
        level: 'beginner',
        price: 69.99,
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
        rating: 4.7,
        reviews: 820,
        enrolledStudents: 2240,
        modules: [
            {
                title: 'SQL Coding Practices',
                description: 'SELECT, INSERT, UPDATE, DELETE queries',
                videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
                duration: 100,
                resources: [{ title: 'SQL Cheatsheet', url: '#' }],
                order: 1
            },
            {
                title: 'Database Design',
                description: 'ERD, normalization, and relationships',
                videoUrl: 'https://www.youtube.com/watch?v=ztHopE5Wnpc',
                duration: 120,
                resources: [{ title: 'Design Patterns', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'Digital Illustration with Procreate',
        description: 'Create stunning digital art on iPad. Learn brushes, layers, blending, and professional illustration techniques.',
        category: 'design',
        level: 'beginner',
        price: 59.99,
        thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
        rating: 4.8,
        reviews: 390,
        enrolledStudents: 960,
        modules: [
            {
                title: 'Procreate Coding Practices',
                description: 'Interface and brush fundamentals',
                videoUrl: 'https://www.youtube.com/watch?v=K5lSgiExuwY',
                duration: 80,
                resources: [{ title: 'Brush Pack', url: '#' }],
                order: 1
            },
            {
                title: 'Character Illustration',
                description: 'Draw and color characters',
                videoUrl: 'https://www.youtube.com/watch?v=HaQvgCAQPL0',
                duration: 140,
                resources: [{ title: 'Color Palettes', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'Artificial Intelligence & Deep Learning',
        description: 'Build neural networks, CNNs, RNNs with TensorFlow and PyTorch. Complete AI masterclass.',
        category: 'data-science',
        level: 'advanced',
        price: 149.99,
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        rating: 4.9,
        reviews: 980,
        enrolledStudents: 2650,
        modules: [
            {
                title: 'Neural Networks Fundamentals',
                description: 'Understanding deep learning coding practices',
                videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
                duration: 150,
                resources: [{ title: 'NN Theory', url: '#' }],
                order: 1
            },
            {
                title: 'TensorFlow & Keras',
                description: 'Build deep learning models',
                videoUrl: 'https://www.youtube.com/watch?v=tPYj3fFJGjk',
                duration: 200,
                resources: [{ title: 'TF Documentation', url: '#' }],
                order: 2
            }
        ]
    },
    {
        title: 'E-Commerce Business Master Course',
        description: 'Start and scale your online store. Learn Shopify, dropshipping, product research, and Facebook ads.',
        category: 'business',
        level: 'beginner',
        price: 89.99,
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        rating: 4.6,
        reviews: 530,
        enrolledStudents: 1450,
        modules: [
            {
                title: 'E-Commerce Fundamentals',
                description: 'Choose niche and products',
                videoUrl: 'https://www.youtube.com/watch?v=bZzXzyQsCF0',
                duration: 90,
                resources: [{ title: 'Product Research', url: '#' }],
                order: 1
            },
            {
                title: 'Shopify Store Setup',
                description: 'Build professional online store',
                videoUrl: 'https://www.youtube.com/watch?v=KU_rLdB7sNo',
                duration: 130,
                resources: [{ title: 'Store Templates', url: '#' }],
                order: 2
            }
        ]
    }
];

async function seedCourses() {
    try {
        // Connect to database
        await connectDB();
        console.log('📦 Connected to MongoDB');

        // Create demo instructor user
        const hashedPassword = await bcrypt.hash('instructor123', 10);

        let instructor = await User.findOne({ email: 'instructor@lms.com' });

        if (!instructor) {
            instructor = await User.create({
                name: 'Demo Instructor',
                email: 'instructor@lms.com',
                password: hashedPassword,
                role: 'instructor',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
            });
            console.log('✅ Created demo instructor: instructor@lms.com / instructor123');
        } else {
            console.log('ℹ️  Instructor already exists');
        }

        // Clear existing courses
        await Course.deleteMany({});
        console.log('🗑️  Cleared existing courses');

        // Create courses
        const coursesWithInstructor = demoCourses.map(course => ({
            ...course,
            instructor: instructor._id,
            instructorName: instructor.name,
            isPublished: true
        }));

        const createdCourses = await Course.insertMany(coursesWithInstructor);
        console.log(`✅ Created ${createdCourses.length} courses successfully!`);

        console.log('\n📚 Course Summary:');
        createdCourses.forEach((course, index) => {
            console.log(`${index + 1}. ${course.title} - $${course.price}`);
        });

        console.log('\n🎉 Database seeding completed!');
        console.log('\n👤 Demo Credentials:');
        console.log('   Email: instructor@lms.com');
        console.log('   Password: instructor123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedCourses();
