// Script to add courseType to existing courses
import mongoose from 'mongoose';
import connectDB from '../lib/db';
import Course from '../models/Course';

// Distribution: 7 Masterclasses, 8 Recorded, 5 Live
const courseTypes: Record<string, 'masterclass' | 'recorded' | ' live'> = {
    'Complete Web Development Bootcamp 2024': 'masterclass',
    'Python for Data Science & Machine Learning': 'masterclass',
    'Artificial Intelligence & Deep Learning': 'masterclass',
    'AWS Cloud Practitioner Complete Guide': 'masterclass',
    'Blockchain & Cryptocurrency Development': 'masterclass',
    'DevOps Engineering Complete Course': 'masterclass',
    'Mobile App Development with React Native': 'masterclass',

    'UI/UX Design Masterclass': 'recorded',
    'Node.js & Express Backend Development': 'recorded',
    'Graphic Design with Adobe Creative Suite': 'recorded',
    'Cybersecurity Fundamentals': 'recorded',
    'Flutter App Development': 'recorded',
    'Video Editing with Adobe Premiere Pro': 'recorded',
    'SQL & Database Management': 'recorded',
    'Digital Illustration with Procreate': 'recorded',

    'Digital Marketing Complete Course': 'live',
    'Business Analytics with Excel & Power BI': 'live',
    'Content Writing & Copywriting Mastery': 'live',
    'Project Management Professional (PMP)': 'live',
    'E-Commerce Business Master Course': 'live',
};

async function updateCourseTypes() {
    try {
        await connectDB();
        console.log('📦 Connected to MongoDB');

        const courses = await Course.find({});
        console.log(`Found ${courses.length} courses to update`);

        let updated = 0;
        const now = new Date();

        for (const course of courses) {
            const courseType = courseTypes[course.title] || 'recorded';

            // For live courses, set schedule date (future dates)
            const liveScheduledDate = courseType === 'live'
                ? new Date(now.getTime() + (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000) // 1-30 days from now
                : undefined;

            await Course.findByIdAndUpdate(course._id, {
                courseType,
                liveScheduledDate
            });

            console.log(`✅ Updated: ${course.title} -> ${courseType}`);
            updated++;
        }

        console.log(`\n🎉 Successfully updated ${updated} courses!`);
        console.log('\n📊 Distribution:');
        console.log('   - Master Classes: 7');
        console.log('   - Recorded Classes: 8');
        console.log('   - Live Classes: 5');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateCourseTypes();
