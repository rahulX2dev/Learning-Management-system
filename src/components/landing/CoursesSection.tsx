'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCategorySection from './CourseCategorySection';

export default function CoursesSection() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('/api/courses');
                if (response.data.success) {
                    setCourses(response.data.courses);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const masterclasses = courses.filter(c => c.courseType === 'masterclass');
    const liveClasses = courses.filter(c => c.courseType === 'live');
    const recordedClasses = courses.filter(c => c.courseType === 'recorded');

    if (loading) {
        return (
            <div className="flex justify-center py-20 bg-[#020617]">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#020617] space-y-12 pb-24">
            {/* Masterclasses */}
            <CourseCategorySection
                id="masterclasses"
                title="Exclusive Masterclasses"
                subtitle="Deep dive into advanced topics with industry experts."
                courses={masterclasses}
                theme="purple"
            />

            {/* Live Classes */}
            <CourseCategorySection
                id="live-classes"
                title="Live Interactive Batches"
                subtitle="Learn in real-time with mentors and peers."
                courses={liveClasses}
                theme="red"
            />

            {/* Recorded Classes */}
            <CourseCategorySection
                id="recorded-classes"
                title="Self-Paced Courses"
                subtitle="Learn at your own convenience with our comprehensive library."
                courses={recordedClasses}
                theme="blue"
            />
        </div>
    );
}
