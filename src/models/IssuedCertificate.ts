import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IIssuedCertificate extends Document {
    template: mongoose.Types.ObjectId; // Certificate template
    course: mongoose.Types.ObjectId;
    student: mongoose.Types.ObjectId;
    issuedAt: Date;
    meta?: any;
}

const IssuedCertificateSchema = new Schema<IIssuedCertificate>({
    template: { type: Schema.Types.ObjectId, ref: 'Certificate', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    issuedAt: { type: Date, default: Date.now },
    meta: { type: Schema.Types.Mixed },
});

const IssuedCertificate: Model<IIssuedCertificate> = mongoose.models.IssuedCertificate || mongoose.model<IIssuedCertificate>('IssuedCertificate', IssuedCertificateSchema);

export default IssuedCertificate;
