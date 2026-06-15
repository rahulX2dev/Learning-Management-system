import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssignment extends Document {
    title: string;
    description: string;
    courseId: mongoose.Types.ObjectId;
    moduleId: string; // Stored as string to match module _id in Course
    dueDate?: Date;
    maxPoints: number;
    submissionType: 'text' | 'file' | 'link';
    createdAt: Date;
    updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>({
    title: {
        type: String,
        required: [true, 'Assignment title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Assignment description is required'],
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    moduleId: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
    },
    maxPoints: {
        type: Number,
        default: 100,
    },
    submissionType: {
        type: String,
        enum: ['text', 'file', 'link'],
        default: 'text',
    },
}, {
    timestamps: true,
});

const Assignment: Model<IAssignment> = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);

export default Assignment;
