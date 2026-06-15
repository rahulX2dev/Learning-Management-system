import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotWrapper from "@/components/ChatbotWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "LMS - Learning Management System",
    description: "A modern, animated learning platform with courses, quizzes, and interactive content",
};

import Script from "next/script";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <div className="min-h-screen bg-black flex flex-col">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8 flex-grow pt-24">
                        {children}
                    </main>
                    <Footer />
                    <ChatbotWrapper />
                </div>
                <Script
                    id="razorpay-checkout-js"
                    src="https://checkout.razorpay.com/v1/checkout.js"
                    strategy="lazyOnload"
                />
            </body>
        </html>
    );
}
