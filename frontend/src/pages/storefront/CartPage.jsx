import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6 text-slate-400">
                    <ShoppingBag size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link
                    to="/products"
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:w-2/3">
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-slate-500 text-sm">Product</th>
                                    <th className="px-6 py-4 font-medium text-slate-500 text-sm">Price</th>
                                    <th className="px-6 py-4 font-medium text-slate-500 text-sm">Quantity</th>
                                    <th className="px-6 py-4 font-medium text-slate-500 text-sm">Total</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {cartItems.map((item) => (
                                    <tr key={item.itemId}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-slate-100 rounded-md overflow-hidden flex-shrink-0 border border-slate-200">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">Img</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <Link to={`/products/${item.productData.slug}`} className="font-medium text-slate-900 hover:text-emerald-600">
                                                        {item.name}
                                                    </Link>
                                                    {item.variant && (
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {Object.values(item.variant.attributes).join(' / ')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            ₹{item.price}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center w-24 border border-slate-200 rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.itemId, item.qty - 1)}
                                                    className="px-2 py-1 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                                                    disabled={item.qty <= 1}
                                                >-</button>
                                                <span className="flex-1 text-center text-sm font-medium">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.itemId, item.qty + 1)}
                                                    className="px-2 py-1 text-slate-500 hover:bg-slate-50"
                                                >+</button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            ₹{item.price * item.qty}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => removeFromCart(item.itemId)}
                                                className="text-slate-400 hover:text-red-500 transition"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex justify-between">
                        <Link to="/products" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center">
                            <ArrowRight size={16} className="mr-1 rotate-180" /> Continue Shopping
                        </Link>
                        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700">
                            Clear Cart
                        </button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>₹{getCartTotal()}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Shipping</span>
                                <span className="text-emerald-600 text-sm font-medium">Free</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-4 mb-6">
                            <div className="flex justify-between font-bold text-lg text-slate-900">
                                <span>Total</span>
                                <span>₹{getCartTotal()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
