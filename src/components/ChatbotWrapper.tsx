'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Chatbot from './Chatbot';

export default function ChatbotWrapper() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            // User not authenticated
        } finally {
            setLoading(false);
        }
    };

    // Only show chatbot for students (not instructors or admins)
    if (loading) return null;
    if (!user) return null; // Not logged in
    if (user.role === 'instructor' || user.role === 'admin') return null;

    return <Chatbot />;
}
