import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificate extends Document {
    course: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    templateData?: any; // JSON template fields
    issuer: mongoose.Types.ObjectId; // instructor who created
    isPublished: boolean; // admin may publish
    createdAt: Date;
    updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>({
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    templateData: { type: Schema.Types.Mixed },
    issuer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false },
}, { timestamps: true });

const Certificate: Model<ICertificate> = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);

export default Certificate;
