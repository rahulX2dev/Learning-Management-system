import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // index of correct option
    points: number;
    explanation?: string;
}

export interface IQuiz extends Document {
    courseId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    questions: IQuestion[];
    duration: number; // in minutes
    passingScore: number; // percentage
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: (v: string[]) => v.length >= 2 && v.length <= 6,
            message: 'Quiz must have between 2 and 6 options',
        },
    },
    correctAnswer: {
        type: Number,
        required: true,
    },
    points: {
        type: Number,
        default: 1,
    },
    explanation: String,
});

const QuizSchema = new Schema<IQuiz>({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Quiz title is required'],
    },
    description: {
        type: String,
        required: true,
    },
    questions: {
        type: [QuestionSchema],
        required: true,
        validate: {
            validator: (v: IQuestion[]) => v.length > 0,
            message: 'Quiz must have at least one question',
        },
    },
    duration: {
        type: Number,
        required: true,
        min: 1,
    },
    passingScore: {
        type: Number,
        default: 70,
        min: 0,
        max: 100,
    },
}, {
    timestamps: true,
});

const Quiz: Model<IQuiz> = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);

export default Quiz;
