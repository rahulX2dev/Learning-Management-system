declare module 'razorpay' {
    interface RazorpayOptions {
        key_id: string;
        key_secret: string;
    }

    interface OrderOptions {
        amount: number;
        currency: string;
        receipt?: string;
        notes?: any;
        payment_capture?: boolean;
    }

    class Razorpay {
        constructor(options: RazorpayOptions);
        orders: {
            create(options: OrderOptions): Promise<any>;
            fetch(orderId: string): Promise<any>;
        };
        payments: {
            fetch(paymentId: string): Promise<any>;
            capture(paymentId: string, amount: number): Promise<any>;
            refund(paymentId: string, options?: any): Promise<any>;
        };
    }

    export = Razorpay;
}
