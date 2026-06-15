import connectDB from '../lib/db';
import CodeChallenge from '../models/CodeChallenge';

async function run() {
    try {
        await connectDB();

        // We'll generate: 25 level-1, 5 level-2, 5 level-3
        const items: any[] = [];

        const categories = ['Arrays', 'Strings', 'Linked Lists', 'Stacks & Queues', 'Trees'];

        // Helper to create a challenge
        const make = (title: string, category: string, difficulty: 'easy' | 'medium' | 'hard', level: number, problemNumber: number) => ({
            title,
            problemNumber,
            level,
            difficulty,
            category,
            description: `${title} - Solve the problem as described.`,
            starterCode: '// write your solution here',
            solution: '// reference solution',
            testCases: [
                { input: '1', expectedOutput: '1' },
                { input: '2', expectedOutput: '2' },
                { input: '3', expectedOutput: '3' }
            ],
            hints: [
                'Think about edge cases',
                'Consider time and space complexity',
                'Start with a brute-force solution then optimize'
            ],
            timeComplexity: 'TBD',
            spaceComplexity: 'TBD',
            tags: [category.toLowerCase().replace(/\s+/g, '-')]
        });

        let pn = 1;

        // 25 level-1 (easy)
        for (let i = 0; i < 25; i++) {
            const cat = categories[i % categories.length];
            const title = `${cat} Practice ${i + 1}`;
            items.push(make(title, cat, 'easy', 1, pn++));
        }

        // 5 level-2 (medium)
        for (let i = 0; i < 5; i++) {
            const cat = categories[(i + 1) % categories.length];
            const title = `${cat} Challenge M${i + 1}`;
            const item = make(title, cat, 'medium', 2, pn++);
            // better testcases for medium
            item.testCases = [
                { input: '1 2', expectedOutput: '3' },
                { input: '5 7', expectedOutput: '12' },
                { input: '10 20', expectedOutput: '30' }
            ];
            item.hints = [
                'Use two-pointer or sliding window as applicable',
                'Consider sorting or hashing',
                'Think about in-place or extra space tradeoffs'
            ];
            items.push(item);
        }

        // 5 level-3 (hard)
        for (let i = 0; i < 5; i++) {
            const cat = categories[(i + 2) % categories.length];
            const title = `${cat} Challenge H${i + 1}`;
            const item = make(title, cat, 'hard', 3, pn++);
            item.testCases = [
                { input: '100 200', expectedOutput: '300' },
                { input: '999 1', expectedOutput: '1000' },
                { input: '123 456', expectedOutput: '579' }
            ];
            item.hints = [
                'Think about advanced data structures',
                'Consider divide-and-conquer or dynamic programming',
                'Optimize both time and space; consider edge cases'
            ];
            items.push(item);
        }

        // Insert into DB
        for (const it of items) {
            await CodeChallenge.create(it);
        }

        console.log(`Inserted ${items.length} new DSA challenges.`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding custom DSA problems:', err);
        process.exit(1);
    }
}

run();
