import connectDB from '../lib/db';
import CodeChallenge from '../models/CodeChallenge';

async function run() {
    try {
        await connectDB();

        // Safety: require explicit env var to prevent accidental deletion
        if (process.env.FORCE_DELETE_DSA !== '1') {
            console.log('For safety, this script requires FORCE_DELETE_DSA=1 to actually delete records.');
            console.log('To delete all DSA challenges, run:');
            console.log('  FORCE_DELETE_DSA=1 npm run delete:dsa  # on Unix/macOS');
            console.log('  $env:FORCE_DELETE_DSA="1"; npm run delete:dsa  # on PowerShell');
            process.exit(0);
        }

        const res = await CodeChallenge.deleteMany({});
        // Mongoose returns a DeleteResult with deletedCount in modern versions
        const deleted = (res as any).deletedCount ?? (res as any).n ?? 0;
        console.log(`Deleted ${deleted} DSA challenges.`);
        process.exit(0);
    } catch (err) {
        console.error('Error deleting DSA challenges:', err);
        process.exit(1);
    }
}

run();
