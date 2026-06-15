import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpay: any | null = null;

function getRazorpayInstance() {
    if (razorpay) return razorpay;

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (!keyId) {
        throw new Error('Razorpay key id is not configured. Set RAZORPAY_KEY_ID in server env.');
    }

    razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret || '',
    });

    return razorpay;
}

// Create Razorpay order
export async function createRazorpayOrder(amount: number, currency: string = 'INR', notes?: any) {
    try {
        const rp = getRazorpayInstance();
        const order = await rp.orders.create({
            amount: amount * 100, // Convert to smallest currency unit (paise)
            currency,
            notes,
        });
        return order;
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        throw error;
    }
}

// Verify payment signature
export function verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
): boolean {
    try {
        const text = `${orderId}|${paymentId}`;
        const secret = process.env.RAZORPAY_KEY_SECRET || '';

        const generatedSignature = crypto.createHmac('sha256', secret).update(text).digest('hex');

        return generatedSignature === signature;
    } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
}

// Fetch payment details
export async function fetchPaymentDetails(paymentId: string) {
    try {
        const rp = getRazorpayInstance();
        const payment = await rp.payments.fetch(paymentId);
        return payment;
    } catch (error) {
        console.error('Error fetching payment details:', error);
        throw error;
    }
}

// Initiate refund
export async function initiateRefund(paymentId: string, amount?: number) {
    try {
        const rp = getRazorpayInstance();
        const refund = await rp.payments.refund(paymentId, {
            amount: amount ? amount * 100 : undefined,
        });
        return refund;
    } catch (error) {
        console.error('Error initiating refund:', error);
        throw error;
    }
}
