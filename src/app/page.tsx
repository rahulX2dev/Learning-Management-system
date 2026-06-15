'use client';

import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import FeatureSection from '@/components/landing/FeatureSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CoursesSection from '@/components/landing/CoursesSection';
import FounderSection from '@/components/landing/FounderSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import FAQSection from '@/components/landing/FAQSection';
import BlogSection from '@/components/landing/BlogSection';

export default function HomePage() {
    return (
        <div className="bg-[#020617] min-h-screen text-white overflow-x-hidden">
            <HeroSection />
            <StatsSection />
            <FeatureSection />
            <HowItWorksSection />
            <CoursesSection />
            <FounderSection />
            <TestimonialsSection />
            <BlogSection />
            <FAQSection />
            <CTASection />
        </div>
    );
}
