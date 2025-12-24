import React, { useState, useEffect } from 'react';
import { Star, User, MessageSquare, Send } from 'lucide-react';
import apiClient from '../../config/apiClient';
import toast from 'react-hot-toast';

const ReviewSection = ({ productId, isAuthenticated }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setFetching(true);
            const response = await apiClient.get(`/reviews/${productId}`);
            setReviews(response.data.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment || !rating) {
            toast.error('Please provide rating and comment');
            return;
        }

        try {
            setLoading(true);
            await apiClient.post(`/reviews/${productId}`, { rating, comment });
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

    const avgRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return (
        <div className="mt-20 border-t border-slate-100 pt-16">
            <div className="flex flex-col lg:flex-row gap-16">
                {/* Left: Review Stats & Form */}
                <div className="w-full lg:w-1/3">
                    <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Customer Reviews</h2>

                    <div className="premium-card p-8 text-center bg-gradient-to-br from-white to-slate-50/50 mb-6">
                        <p className="text-6xl font-black text-slate-900 mb-4">
                            {avgRating.toFixed(1)}
                        </p>
                        <div className="flex justify-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={24}
                                    className={star <= avgRating ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Based on {reviews.length} reviews</p>
                    </div>

                    {isAuthenticated ? (
                        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                            <h3 className="text-lg font-black text-slate-900">Write a Review</h3>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Your Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setRating(s)}
                                            className="transition-transform active:scale-90"
                                        >
                                            <Star
                                                size={32}
                                                className={`transition-colors ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Your Feedback</label>
                                <textarea
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-medium focus:border-emerald-500 focus:bg-white transition-all outline-none resize-none"
                                    rows="4"
                                    placeholder="What did you like or dislike about this product?"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-premium-primary py-4 rounded-xl font-black shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 group"
                            >
                                {loading ? 'Submitting...' : 'Submit Review'}
                                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    ) : (
                        <div className="mt-10 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                            <p className="text-sm font-bold text-slate-500 mb-4">You must be logged in to leave a review.</p>
                            <button onClick={() => window.location.href = '/login'} className="text-emerald-600 font-black text-sm uppercase tracking-widest hover:underline">Log in now →</button>
                        </div>
                    )}
                </div>

                {/* Right: Review List */}
                <div className="w-full lg:w-2/3">
                    <div className="space-y-8">
                        {fetching ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="flex gap-4 mb-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-100 rounded-full w-1/4"></div>
                                            <div className="h-3 bg-slate-100 rounded-full w-1/6"></div>
                                        </div>
                                    </div>
                                    <div className="h-20 bg-slate-100 rounded-2xl w-full"></div>
                                </div>
                            ))
                        ) : reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review._id} className="premium-card p-6 hover:border-emerald-100 transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-black shadow-inner">
                                                {review.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 leading-none mb-1">{review.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                                                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={14} className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-100"} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative pl-16">
                                        <MessageSquare className="absolute left-6 top-0 text-slate-100" size={32} />
                                        <p className="text-slate-500 font-medium leading-relaxed italic group-hover:text-slate-700 transition-colors">
                                            "{review.comment}"
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                    <MessageSquare size={32} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">No Reviews Yet</h3>
                                <p className="text-sm text-slate-400 font-medium">Be the first to share your experience with this product!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
