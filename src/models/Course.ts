import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IModule {
    title: string;
    description: string;
    videoUrl?: string;
    duration: number; // in minutes
    resources: {
        title: string;
        url: string;
    }[];
    order: number;
    isFree: boolean;
    assignments: mongoose.Types.ObjectId[];
    quizzes: mongoose.Types.ObjectId[];
    assignmentId?: mongoose.Types.ObjectId;
    quizId?: mongoose.Types.ObjectId;
}

export interface ICourse extends Document {
    title: string;
    description: string;
    thumbnail: string;
    coverVideo: string;
    instructor: mongoose.Types.ObjectId;
    instructorName?: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    courseType: 'masterclass' | 'recorded' | 'live';
    price: number;
    discount: number;
    modules: IModule[];
    enrolledStudents: number;
    rating: number;
    reviews: number;
    isActive: boolean;
    isPublished: boolean;
    isApproved: boolean;
    status: 'pending' | 'approved' | 'rejected';
    liveScheduledDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    videoUrl: String,
    duration: {
        type: Number,
        required: true,
    },
    resources: [{
        title: String,
        url: String,
    }],
    order: {
        type: Number,
        required: true,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
    assignments: [{
        type: Schema.Types.ObjectId,
        ref: 'Assignment',
    }],
    quizzes: [{
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
    }],
    assignmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Assignment',
    },
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
    },
});

const CourseSchema = new Schema<ICourse>({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
    },
    thumbnail: {
        type: String,
        required: [true, 'Cover image is required'],
    },
    coverVideo: {
        type: String,
        required: [true, 'Cover video is required'],
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    instructorName: String,
    category: {
        type: String,
        required: true,
        enum: ['programming', 'design', 'business', 'marketing', 'data-science', 'other'],
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
    },
    courseType: {
        type: String,
        enum: ['masterclass', 'recorded', 'live'],
        default: 'recorded',
        required: true,
    },
    liveScheduledDate: {
        type: Date,
    },
    price: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    modules: [ModuleSchema],
    enrolledStudents: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
