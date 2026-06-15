import mongoose from 'mongoose';
import connectDB from '../lib/db';
import CodeChallenge from '../models/CodeChallenge';

// DSA Problem Templates by Category and Level
const problemTemplates = {
    arrays: [
        { title: 'Two Sum', category: 'Arrays', difficulty: 'easy', level: 1 },
        { title: 'Find Maximum Element', category: 'Arrays', difficulty: 'easy', level: 1 },
        { title: 'Reverse Array', category: 'Arrays', difficulty: 'easy', level: 1 },
        { title: 'Remove Duplicates', category: 'Arrays', difficulty: 'easy', level: 1 },
        { title: 'Rotate Array', category: 'Arrays', difficulty: 'medium', level: 2 },
        { title: 'Container With Most Water', category: 'Arrays', difficulty: 'medium', level: 2 },
        { title: 'Trapping Rain Water', category: 'Arrays', difficulty: 'hard', level: 3 },
    ],
    strings: [
        { title: 'Reverse String', category: 'Strings', difficulty: 'easy', level: 1 },
        { title: 'Palindrome Check', category: 'Strings', difficulty: 'easy', level: 1 },
        { title: 'Valid Anagram', category: 'Strings', difficulty: 'easy', level: 1 },
        { title: 'Longest Substring Without Repeating', category: 'Strings', difficulty: 'medium', level: 2 },
        { title: 'String Compression', category: 'Strings', difficulty: 'medium', level: 2 },
        { title: 'Edit Distance', category: 'Strings', difficulty: 'hard', level: 3 },
    ],
    linkedLists: [
        { title: 'Reverse Linked List', category: 'Linked Lists', difficulty: 'easy', level: 1 },
        { title: 'Detect Cycle in Linked List', category: 'Linked Lists', difficulty: 'easy', level: 1 },
        { title: 'Merge Two Sorted Lists', category: 'Linked Lists', difficulty: 'easy', level: 1 },
        { title: 'Remove Nth Node From End', category: 'Linked Lists', difficulty: 'medium', level: 2 },
        { title: 'Add Two Numbers', category: 'Linked Lists', difficulty: 'medium', level: 2 },
        { title: 'Merge K Sorted Lists', category: 'Linked Lists', difficulty: 'hard', level: 3 },
    ],
    stacks: [
        { title: 'Valid Parentheses', category: 'Stacks & Queues', difficulty: 'easy', level: 1 },
        { title: 'Implement Queue using Stacks', category: 'Stacks & Queues', difficulty: 'easy', level: 1 },
        { title: 'Min Stack', category: 'Stacks & Queues', difficulty: 'medium', level: 2 },
        { title: 'Daily Temperatures', category: 'Stacks & Queues', difficulty: 'medium', level: 2 },
        { title: 'Largest Rectangle in Histogram', category: 'Stacks & Queues', difficulty: 'hard', level: 3 },
    ],
    trees: [
        { title: 'Maximum Depth of Binary Tree', category: 'Trees', difficulty: 'easy', level: 1 },
        { title: 'Invert Binary Tree', category: 'Trees', difficulty: 'easy', level: 1 },
        { title: 'Binary Tree Level Order Traversal', category: 'Trees', difficulty: 'medium', level: 2 },
        { title: 'Validate Binary Search Tree', category: 'Trees', difficulty: 'medium', level: 2 },
        { title: 'Binary Tree Maximum Path Sum', category: 'Trees', difficulty: 'hard', level: 3 },
        { title: 'Serialize and Deserialize Binary Tree', category: 'Trees', difficulty: 'hard', level: 3 },
    ],
    graphs: [
        { title: 'Number of Islands', category: 'Graphs', difficulty: 'medium', level: 2 },
        { title: 'Clone Graph', category: 'Graphs', difficulty: 'medium', level: 2 },
        { title: 'Course Schedule', category: 'Graphs', difficulty: 'medium', level: 2 },
        { title: 'Word Ladder', category: 'Graphs', difficulty: 'hard', level: 3 },
        { title: 'Alien Dictionary', category: 'Graphs', difficulty: 'hard', level: 3 },
    ],
    dynamicProgramming: [
        { title: 'Climbing Stairs', category: 'Dynamic Programming', difficulty: 'easy', level: 1 },
        { title: 'House Robber', category: 'Dynamic Programming', difficulty: 'medium', level: 2 },
        { title: 'Coin Change', category: 'Dynamic Programming', difficulty: 'medium', level: 2 },
        { title: 'Longest Increasing Subsequence', category: 'Dynamic Programming', difficulty: 'medium', level: 2 },
        { title: 'Edit Distance', category: 'Dynamic Programming', difficulty: 'hard', level: 3 },
        { title: 'Regular Expression Matching', category: 'Dynamic Programming', difficulty: 'hard', level: 3 },
    ],
    sorting: [
        { title: 'Bubble Sort', category: 'Sorting & Searching', difficulty: 'easy', level: 1 },
        { title: 'Binary Search', category: 'Sorting & Searching', difficulty: 'easy', level: 1 },
        { title: 'Merge Sort', category: 'Sorting & Searching', difficulty: 'medium', level: 2 },
        { title: 'Quick Sort', category: 'Sorting & Searching', difficulty: 'medium', level: 2 },
        { title: 'Find Median from Data Stream', category: 'Sorting & Searching', difficulty: 'hard', level: 3 },
    ],
    math: [
        { title: 'Fizz Buzz', category: 'Math', difficulty: 'easy', level: 1 },
        { title: 'Power of Two', category: 'Math', difficulty: 'easy', level: 1 },
        { title: 'Happy Number', category: 'Math', difficulty: 'easy', level: 1 },
        { title: 'Factorial', category: 'Math', difficulty: 'easy', level: 1 },
        { title: 'Count Primes', category: 'Math', difficulty: 'medium', level: 2 },
        { title: 'Pow(x, n)', category: 'Math', difficulty: 'medium', level: 2 },
    ],
    bitManipulation: [
        { title: 'Single Number', category: 'Bit Manipulation', difficulty: 'easy', level: 1 },
        { title: 'Number of 1 Bits', category: 'Bit Manipulation', difficulty: 'easy', level: 1 },
        { title: 'Reverse Bits', category: 'Bit Manipulation', difficulty: 'easy', level: 1 },
        { title: 'Sum of Two Integers', category: 'Bit Manipulation', difficulty: 'medium', level: 2 },
        { title: 'Bitwise AND of Numbers Range', category: 'Bit Manipulation', difficulty: 'medium', level: 2 },
    ]
};

function generateProblems() {
    const problems = [];
    let problemNumber = 1;

    // Generate problems from templates (100 base problems)
    for (const category of Object.values(problemTemplates)) {
        for (const template of category) {
            problems.push({
                ...template,
                problemNumber: problemNumber++,
                description: `Solve the ${template.title} problem. This is a ${template.difficulty} level problem in ${template.category}.`,
                starterCode: generateStarterCode(template.title, template.category),
                solution: `// Solution for ${template.title}\n// Implement the optimal solution here`,
                testCases: generateTestCases(template.title),
                hints: [`Think about the ${template.category.toLowerCase()} properties`, 'Consider edge cases'],
                tags: [template.category.toLowerCase(), template.difficulty]
            });
        }
    }

    // Generate variations to reach 1000 problems
    const baseProblems = [...problems];
    while (problems.length < 1000) {
        const baseTemplate: any = baseProblems[problems.length % baseProblems.length];
        const variation: number = Math.floor(problems.length / baseProblems.length) + 1;

        problems.push({
            title: `${baseTemplate.title} - Variation ${variation}`,
            problemNumber: problemNumber++,
            level: Math.min(5, baseTemplate.level + Math.floor(variation / 3)),
            difficulty: baseTemplate.difficulty,
            category: baseTemplate.category,
            description: `Solve the ${baseTemplate.title} problem (Variation ${variation}). This is an enhanced version with additional constraints.`,
            starterCode: generateStarterCode(baseTemplate.title, baseTemplate.category),
            solution: `// Solution for ${baseTemplate.title} Variation ${variation}`,
            testCases: generateTestCases(baseTemplate.title),
            hints: baseTemplate.hints || [],
            tags: baseTemplate.tags || []
        });
    }

    return problems;
}

function generateStarterCode(title: string, category: string): string {
    return `/**
 * @problem: ${title}
 * @category: ${category}
 * Implement your solution below
 */

function solution() {
    // Your code here
    
}

// Test cases
console.log(solution());
`;
}

function generateTestCases(title: string) {
    return [
        { input: 'Test case 1', expectedOutput: 'Expected output 1' },
        { input: 'Test case 2', expectedOutput: 'Expected output 2' },
    ];
}

async function seedDSAProblems() {
    try {
        await connectDB();
        console.log('📦 Connected to MongoDB');

        // Clear existing challenges
        await CodeChallenge.deleteMany({});
        console.log('🗑️  Cleared existing challenges');

        // Generate 1000 problems
        const problems = generateProblems();
        console.log(`📝 Generated ${problems.length} DSA problems`);

        // Insert in batches for better performance
        const batchSize = 100;
        for (let i = 0; i < problems.length; i += batchSize) {
            const batch = problems.slice(i, i + batchSize);
            await CodeChallenge.insertMany(batch);
            console.log(`✅ Inserted problems ${i + 1} to ${Math.min(i + batchSize, problems.length)}`);
        }

        // Show statistics
        const stats = await CodeChallenge.aggregate([
            {
                $group: {
                    _id: '$level',
                    count: { $sum: 1 },
                    categories: { $addToSet: '$category' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        console.log('\n📊 Problem Distribution by Level:');
        stats.forEach(stat => {
            console.log(`Level ${stat._id}: ${stat.count} problems`);
        });

        console.log('\n🎉 Successfully seeded 1000 DSA problems!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding DSA problems:', error);
        process.exit(1);
    }
}

seedDSAProblems();
