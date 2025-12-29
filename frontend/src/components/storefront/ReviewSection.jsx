import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import apiClient from '../../config/apiClient';
import toast from 'react-hot-toast';

// ReviewSection - Shows product reviews and allows users to submit reviews
const ReviewSection = ({ productId, isAuthenticated }) => {
    // State for reviews list
    const [reviews, setReviews] = useState([]);
    
    // State for the review form
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    
    // Loading states
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Fetch reviews when component loads or productId changes
    useEffect(() => {
        fetchReviews();
    }, [productId]);

    // Function to get reviews from API
    const fetchReviews = async () => {
        try {
            setFetching(true);
            const response = await apiClient.get(`/reviews/${productId}`);
            setReviews(response.data.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            // Set empty array if error (e.g., no reviews yet)
            setReviews([]);
        } finally {
            setFetching(false);
        }
    };

    // Handle review form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!comment || !rating) {
            toast.error('Please provide rating and comment');
            return;
        }

        try {
            setLoading(true);
            await apiClient.post(`/reviews/${productId}`, { rating, comment });
            
            // Clear form and refresh reviews
            setComment('');
            setRating(5);
            toast.success('Review submitted successfully');
            fetchReviews();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    // Helper function to render star icons
    const renderStars = (count, size = 16, interactive = false, onClickHandler = null) => {
        return [1, 2, 3, 4, 5].map((starNum) => (
            <button
                key={starNum}
                type="button"
                onClick={interactive ? () => onClickHandler(starNum) : undefined}
                className={interactive ? 'cursor-pointer' : 'cursor-default'}
                disabled={!interactive}
            >
                <Star
                    size={size}
                    className={`${
                        starNum <= count
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                    } transition-colors`}
                />
            </button>
        ));
    };

    // Format date nicely
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="mt-12 border-t border-slate-200 pt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
                Customer Reviews
            </h2>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* ========== LEFT SIDE: Stats and Form ========== */}
                <div className="w-full lg:w-1/3">
                    {/* Rating Summary Card */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 text-center mb-6">
                        <p className="text-5xl font-bold text-slate-900 mb-2">
                            {averageRating.toFixed(1)}
                        </p>
                        <div className="flex justify-center gap-1 mb-2">
                            {renderStars(Math.round(averageRating), 20)}
                        </div>
                        <p className="text-sm text-slate-500">
                            Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>

                    {/* Review Form (only for logged in users) */}
                    {isAuthenticated ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                Write a Review
                            </h3>
                            
                            {/* Rating Selection */}
                            <div>
                                <label className="text-sm font-medium text-slate-600 mb-2 block">
                                    Your Rating
                                </label>
                                <div className="flex gap-2">
                                    {renderStars(rating, 28, true, setRating)}
                                </div>
                            </div>

                            {/* Comment Input */}
                            <div>
                                <label className="text-sm font-medium text-slate-600 mb-2 block">
                                    Your Feedback
                                </label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                                    rows="4"
                                    placeholder="What did you like or dislike about this product?"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Submitting...' : 'Submit Review'}
                                <Send size={16} />
                            </button>
                        </form>
                    ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                            <p className="text-sm text-slate-600 mb-3">
                                You must be logged in to leave a review.
                            </p>
                            <a 
                                href="/login" 
                                className="text-emerald-600 font-bold text-sm hover:underline"
                            >
                                Log in now →
                            </a>
                        </div>
                    )}
                </div>

                {/* ========== RIGHT SIDE: Reviews List ========== */}
                <div className="w-full lg:w-2/3">
                    {fetching ? (
                        // Loading skeleton
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="flex gap-4 mb-3">
                                        <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                            <div className="h-3 bg-slate-200 rounded w-1/6"></div>
                                        </div>
                                    </div>
                                    <div className="h-16 bg-slate-200 rounded w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : reviews.length > 0 ? (
                        // Reviews list
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div 
                                    key={review._id} 
                                    className="bg-white border border-slate-200 rounded-xl p-5"
                                >
                                    {/* Review Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {/* User Avatar */}
                                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                                                {review.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">
                                                    {review.name || 'Anonymous'}
                                                </h4>
                                                <p className="text-xs text-slate-400">
                                                    {formatDate(review.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Star Rating */}
                                        <div className="flex gap-0.5">
                                            {renderStars(review.rating, 14)}
                                        </div>
                                    </div>
                                    
                                    {/* Review Comment */}
                                    <p className="text-slate-600 leading-relaxed">
                                        "{review.comment}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // No reviews message
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                            <MessageSquare size={32} className="text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                No Reviews Yet
                            </h3>
                            <p className="text-sm text-slate-500">
                                Be the first to share your experience with this product!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
