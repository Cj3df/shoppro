import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import apiClient from '../../config/apiClient';
import toast from 'react-hot-toast';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';

const CheckoutPage = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        paymentMethod: 'cod' // Default to COD
    });

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderPayload = {
                items: cartItems.map(item => ({
                    product: item.productId,
                    variant: item.variant?._id,
                    qty: item.qty
                })),
                shippingAddress: {
                    street: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zipCode,
                    country: 'India' // Defaulting
                },
                paymentInfo: {
                    method: formData.paymentMethod,
                    status: formData.paymentMethod === 'cod' ? 'pending' : 'paid' // Simulated
                },
                customerNote: `Phone: ${formData.phone}` // Storing phone in note for now if schema doesn't have phone in shippingAddress
            };

            const response = await apiClient.post('/orders', orderPayload);

            if (response.data.success) {
                toast.success('Order placed successfully!');
                clearCart();
                navigate('/my-orders'); // Or success page
            }
        } catch (error) {
            console.error('Order creation failed:', error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/cart')}
                className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition"
            >
                <ArrowLeft size={16} className="mr-1" /> Back to Cart
            </button>

            <h1 className="text-2xl font-bold text-slate-900 mb-8">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Checkout Form */}
                <div className="lg:w-2/3">
                    <form id="checkout-form" onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                                <Truck className="mr-2 text-emerald-600" size={20} /> Shipping Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        required
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        required
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
                                <CreditCard className="mr-2 text-emerald-600" size={20} /> Payment Method
                            </h2>
                            <div className="space-y-3">
                                <label className="flex items-center p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-emerald-500 transition">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={handleChange}
                                        className="text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="ml-3 font-medium text-slate-700">Cash on Delivery (COD)</span>
                                </label>
                                <label className="flex items-center p-3 border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        disabled
                                        className="text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="ml-3 font-medium text-slate-700">Credit / Debit Card (Coming Soon)</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <div key={item.itemId} className="flex justify-between text-sm">
                                    <span className="text-slate-600">
                                        {item.qty} x {item.name}
                                        {item.variant && <span className="text-xs text-slate-400 block">({Object.values(item.variant.attributes).join('/')})</span>}
                                    </span>
                                    <span className="font-medium text-slate-900">₹{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-200 pt-4 space-y-2 mb-6">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>₹{getCartTotal()}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Shipping</span>
                                <span className="text-emerald-600 text-sm font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Tax (18% est)</span>
                                <span>₹{Math.round(getCartTotal() * 0.18 * 100) / 100}</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-4 mb-6">
                            <div className="flex justify-between font-bold text-lg text-slate-900">
                                <span>Total</span>
                                <span>₹{getCartTotal() + Math.round(getCartTotal() * 0.18 * 100) / 100}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
