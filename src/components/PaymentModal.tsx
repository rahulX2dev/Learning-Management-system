'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCreditCard, FaMobileAlt, FaUniversity, FaWallet } from 'react-icons/fa';
import axios from 'axios';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: any;
    onSuccess: () => void;
    initialCoupon?: string;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PaymentModal({ isOpen, onClose, course, onSuccess, initialCoupon }: PaymentModalProps) {
    const [processing, setProcessing] = useState(false);
    const [couponCode, setCouponCode] = useState('');

    // Prefill coupon if provided
    useEffect(() => {
        if (isOpen && (initialCoupon || '') !== '') {
            setCouponCode(initialCoupon as string);
        }
    }, [isOpen, initialCoupon]);

    const handlePayment = async () => {
        try {
            setProcessing(true);

            // Verify current user role before attempting payment
            try {
                const me = await axios.get('/api/auth/me');
                if (!me.data.success || !me.data.user || me.data.user.role !== 'student') {
                    alert('Only students can purchase courses. Please use a student account to enroll.');
                    setProcessing(false);
                    return;
                }
            } catch (err) {
                alert('Authentication required to purchase. Please login as a student.');
                setProcessing(false);
                return;
            }

            // Create order on server (couponCode optional)
            const orderResponse = await axios.post('/api/payment/create-order', {
                courseId: course._id,
                paymentType: 'full',
                couponCode: couponCode || undefined,
            });

            const { orderId, amount, currency, keyId } = orderResponse.data;

            // Initialize Razorpay checkout
            const options = {
                key: keyId,
                amount: amount * 100, // Convert to paise
                currency: currency,
                name: 'LearnHub',
                description: course.title,
                order_id: orderId,
                handler: async function (response: any) {
                        try {
                        // Verify payment on server
                        const verifyResponse = await axios.post('/api/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            paymentMethod: 'card', // Will be detected by Razorpay
                        });

                        if (verifyResponse.data.success) {
                            alert('Payment successful! You are now enrolled.');
                            onSuccess();
                            onClose();
                        }
                    } catch (error: any) {
                        alert(error.response?.data?.error || 'Payment verification failed');
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: '',
                },
                theme: {
                    color: '#3B82F6', // Primary blue color
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
            setProcessing(false);
        } catch (error: any) {
            console.error('Payment error:', error);
            alert(error.response?.data?.error || 'Failed to initiate payment');
            setProcessing(false);
        }
    };

    const finalPrice = course.price - (course.price * course.discount / 100);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        {/* Course Details */}
                        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                            <h3 className="text-lg font-semibold text-white mb-2">
                                {course.title}
                            </h3>
                            <div className="flex justify-between items-center text-slate-300">
                                <span>Course Price:</span>
                                <span className="line-through text-slate-500">₹{course.price}</span>
                            </div>
                            {course.discount > 0 && (
                                <div className="flex justify-between items-center text-green-400">
                                    <span>Discount ({course.discount}%):</span>
                                    <span>-₹{(course.price * course.discount / 100).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-white font-bold text-xl mt-2 pt-2 border-t border-slate-700">
                                <span>Total Amount:</span>
                                <span className="text-primary-400">₹{finalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="mb-6">
                            {/* Coupon Input */}
                            <div className="mb-4">
                                <label className="text-sm text-slate-400">Coupon Code (optional)</label>
                                <div className="mt-2 flex gap-2">
                                    <input
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="flex-1 bg-slate-800/40 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                        placeholder="Enter coupon code"
                                    />
                                </div>
                            </div>
                            <h4 className="text-sm font-semibold text-slate-400 mb-3">
                                Supported Payment Methods
                            </h4>
                            <div className="grid grid-cols-4 gap-3">
                                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                    <FaMobileAlt className="text-2xl text-blue-400 mx-auto mb-1" />
                                    <p className="text-xs text-slate-400">UPI</p>
                                </div>
                                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                    <FaCreditCard className="text-2xl text-purple-400 mx-auto mb-1" />
                                    <p className="text-xs text-slate-400">Cards</p>
                                </div>
                                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                    <FaUniversity className="text-2xl text-green-400 mx-auto mb-1" />
                                    <p className="text-xs text-slate-400">NetBank</p>
                                </div>
                                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                    <FaWallet className="text-2xl text-yellow-400 mx-auto mb-1" />
                                    <p className="text-xs text-slate-400">Wallet</p>
                                </div>
                            </div>
                            {finalPrice > 1000 && (
                                <p className="text-xs text-slate-500 mt-2 text-center">
                                    💳 EMI options available at checkout
                                </p>
                            )}
                        </div>

                        {/* Pay Button */}
                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Processing...' : `Pay ₹${finalPrice.toFixed(2)}`}
                        </button>

                        <p className="text-xs text-slate-500 text-center mt-4">
                            🔒 Secure payment powered by Razorpay
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
