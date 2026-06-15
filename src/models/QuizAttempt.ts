import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnswer {
    questionIndex: number;
    selectedAnswer: number;
}

export interface IQuizAttempt extends Document {
    _id: string;
    userId: mongoose.Types.ObjectId;
    quizId: mongoose.Types.ObjectId;
    answers: IAnswer[];
    score: number;
    totalPoints: number;
    percentage: number;
    passed: boolean;
    startedAt: Date;
    completedAt?: Date;
}

const AnswerSchema = new Schema<IAnswer>({
    questionIndex: {
        type: Number,
        required: true,
    },
    selectedAnswer: {
        type: Number,
        required: true,
    },
});

const QuizAttemptSchema = new Schema<IQuizAttempt>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    answers: [AnswerSchema],
    score: {
        type: Number,
        default: 0,
    },
    totalPoints: {
        type: Number,
        required: true,
    },
    percentage: {
        type: Number,
        default: 0,
    },
    passed: {
        type: Boolean,
        default: false,
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    completedAt: Date,
}, {
    timestamps: true,
});

const QuizAttempt: Model<IQuizAttempt> = mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);

export default QuizAttempt;
