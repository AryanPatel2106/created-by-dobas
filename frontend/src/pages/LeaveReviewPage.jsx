import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const LeaveReviewPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('You must be logged in to leave a review.');
            return;
        }
        try {
            await api.post('/api/testimonials', {
                user: {
                    name: user.name,
                    email: user.email,
                    picture: user.picture
                },
                rating,
                comment
            });
            alert('Thank you! Your review has been submitted for approval.');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit review.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-16">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-[var(--theme-pink)] mb-8 transition-colors">
                <ArrowLeft size={20} />
                Back to Home
            </Link>
            <div className="bg-white p-8 rounded-lg shadow-lg border">
                <form onSubmit={handleSubmit}>
                    <h1 className="font-playfair text-3xl font-bold mb-6 text-gray-800">Share Your Experience</h1>
                    <p className="text-gray-600 mb-8">We'd love to hear what you think about our store and creations. Your feedback helps us grow!</p>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Overall Rating</label>
                            <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" required>
                                <option value="0" disabled>Select a rating...</option>
                                <option value="1">1 - Poor</option>
                                <option value="2">2 - Fair</option>
                                <option value="3">3 - Good</option>
                                <option value="4">4 - Very Good</option>
                                <option value="5">5 - Excellent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Your Review</label>
                            <textarea rows="5" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 focus:ring-[var(--theme-pink)] focus:border-[var(--theme-pink)]" required placeholder="Tell us about your experience..."></textarea>
                        </div>
                    </div>
                    <button type="submit" className="mt-8 w-full bg-[var(--theme-pink)] text-gray-800 font-bold py-3 rounded-lg text-lg hover:bg-[var(--theme-pink-hover)] transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Submit My Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LeaveReviewPage;