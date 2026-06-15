import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    course: mongoose.Types.ObjectId;
    discountPercent?: number; // percent discount (0-100)
    amountOff?: number; // fixed amount off
    expiresAt?: Date;
    usageLimit?: number; // max usages
    usedCount: number;
    isActive: boolean;
    createdBy: mongoose.Types.ObjectId;
}

const CouponSchema = new Schema<ICoupon>({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    discountPercent: { type: Number },
    amountOff: { type: Number },
    expiresAt: { type: Date },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Coupon: Model<ICoupon> = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
