import mongoose, { Document, Schema } from 'mongoose';

export interface ICodeChallenge extends Document {
    title: string;
    problemNumber: number;
    level: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    description: string;
    starterCode: string;
    solution: string;
    testCases: {
        input: string;
        expectedOutput: string;
    }[];
    hints: string[];
    timeComplexity?: string;
    spaceComplexity?: string;
    tags: string[];
}

const CodeChallengeSchema = new Schema<ICodeChallenge>({
    title: { type: String, required: true },
    problemNumber: { type: Number, required: true, unique: true },
    level: { type: Number, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    starterCode: { type: String, required: true },
    solution: { type: String, required: true },
    testCases: [{
        input: String,
        expectedOutput: String
    }],
    hints: [String],
    timeComplexity: String,
    spaceComplexity: String,
    tags: [String]
}, {
    timestamps: true
});

// Index for faster queries
CodeChallengeSchema.index({ level: 1, problemNumber: 1 });
CodeChallengeSchema.index({ difficulty: 1 });
CodeChallengeSchema.index({ category: 1 });

const CodeChallenge = mongoose.models.CodeChallenge || mongoose.model<ICodeChallenge>('CodeChallenge', CodeChallengeSchema);

export default CodeChallenge;
