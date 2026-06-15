import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
    author: mongoose.Types.ObjectId;
    tags: string[];
    isPublished: boolean;
    isApproved: boolean;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Blog content is required'],
    },
    excerpt: {
        type: String,
        required: [true, 'Blog excerpt is required'],
    },
    coverImage: {
        type: String,
        default: 'https://via.placeholder.com/800x400',
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    isPublished: {
        type: Boolean,
        default: false,
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
}, {
    timestamps: true,
});

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
