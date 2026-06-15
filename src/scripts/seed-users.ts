import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../lib/db';
import User from '../models/User';

const users = [
    {
        name: 'Demo Student',
        email: 'student#@email.com',
        password: '123456',
        role: 'student' as const,
    },
    {
        name: 'Demo Instructor',
        email: 'Instructor@email.com',
        password: '123456',
        role: 'instructor' as const,
    },
    {
        name: 'Demo Admin',
        email: 'admin@email.com',
        password: '123456',
        role: 'admin' as const,
    },
];

async function seedUsers() {
    try {
        await connectDB();
        console.log('📦 Connected to MongoDB');

        // Hash passwords
        for (const user of users) {
            const hashed = await bcrypt.hash(user.password, 10);
            user.password = hashed;
        }

        // Insert or update users
        for (const user of users) {
            const existing = await User.findOne({ email: user.email });
            if (existing) {
                console.log(`ℹ️  User already exists: ${user.email}`);
                continue;
            }
            await User.create(user);
            console.log(`✅ Created user: ${user.email} / 123456`);
        }

        console.log('🎉 User seeding completed!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding users:', err);
        process.exit(1);
    }
}

seedUsers();
