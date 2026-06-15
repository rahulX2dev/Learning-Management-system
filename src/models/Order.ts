import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    amount: number;
    originalPrice: number;
    discountAmount: number;
    couponCode?: string;
    paymentType: 'full' | 'emi';
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    paymentMethod?: 'upi' | 'card' | 'netbanking' | 'wallet' | 'emi';
    emiPlan?: {
        tenure: number;
        monthlyAmount: number;
        bankName?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    originalPrice: {
        type: Number,
        required: true,
    },
    discountAmount: {
        type: Number,
        default: 0,
    },
    couponCode: String,
    paymentType: {
        type: String,
        enum: ['full', 'emi'],
        default: 'full',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paymentMethod: {
        type: String,
        enum: ['upi', 'card', 'netbanking', 'wallet', 'emi'],
    },
    emiPlan: {
        tenure: Number,
        monthlyAmount: Number,
        bankName: String,
    },
}, {
    timestamps: true,
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
