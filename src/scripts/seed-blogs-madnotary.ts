import connectDB from '../lib/db';
import Blog from '../models/Blog';
import User from '../models/User';
import bcrypt from 'bcryptjs';

async function ensureAdmin() {
    // try to find existing admin user by known seed email
    const adminEmail = 'admin@email.com';
    let admin = await User.findOne({ email: adminEmail });
    if (admin) return admin;

    // create a simple admin user if not present
    const hashed = await bcrypt.hash('123456', 10);
    admin = await User.create({ name: 'Demo Admin', email: adminEmail, password: hashed, role: 'admin' });
    return admin;
}

async function seedBlogs() {
    try {
        await connectDB();
        console.log('📦 Connected to MongoDB');

        const admin = await ensureAdmin();

        // Create 5 blogs with coverImage set to 'madnotary'
        const items = [];
        for (let i = 1; i <= 5; i++) {
            items.push({
                title: `Madnotary Blog ${i}`,
                content: `This is the content for Madnotary Blog ${i}. Write engaging content here.`,
                excerpt: `Short excerpt for Madnotary Blog ${i}`,
                coverImage: 'madnotary',
                author: admin._id,
                tags: ['madnotary', 'news'],
                isPublished: true,
            });
        }

        const created = await Blog.insertMany(items);
        console.log(`✅ Inserted ${created.length} blogs with coverImage='madnotary'.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding blogs:', err);
        process.exit(1);
    }
}

seedBlogs();
