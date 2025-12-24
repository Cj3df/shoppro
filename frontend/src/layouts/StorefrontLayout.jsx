import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, ShoppingCart, Menu, X, ChevronDown, Heart, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

const StorefrontLayout = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const cartCount = getCartCount();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Announcement Bar */}
            <div className="bg-slate-900 text-white text-center py-2 text-sm">
                <p>🎉 Free shipping on orders over ₹999 | Use code <span className="font-semibold">WELCOME10</span> for 10% off</p>
            </div>

            {/* Header */}
            <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                                <ShoppingBag size={20} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                Shop<span className="text-emerald-600">Master</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                                Home
                            </Link>
                            <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                                Shop
                            </Link>
                            <div className="relative group">
                                <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition flex items-center gap-1">
                                    Categories <ChevronDown size={14} />
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <Link to="/products?category=electronics" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">Electronics</Link>
                                    <Link to="/products?category=fashion" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">Fashion</Link>
                                    <Link to="/products?category=home-living" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">Home & Living</Link>
                                    <Link to="/products?category=sports-fitness" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">Sports & Fitness</Link>
                                </div>
                            </div>
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            {/* Cart */}
                            <Link
                                to="/cart"
                                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
                            >
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center rounded-full shadow-lg animate-bounce-once">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Wishlist */}
                            <Link
                                to="/wishlist"
                                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
                            >
                                <Heart size={22} className={user?.wishlist?.length > 0 ? "text-red-500 fill-red-500" : ""} />
                                {user?.wishlist?.length > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg">
                                        {user.wishlist.length}
                                    </span>
                                )}
                            </Link>

                            {isAuthenticated ? (
                                <div className="hidden md:flex items-center gap-3">
                                    <Link
                                        to={user.role === 'admin' || user.role === 'staff' ? '/admin/dashboard' : '/my-orders'}
                                        className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-emerald-600 transition"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span>{user.name}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-medium text-slate-500 hover:text-red-600 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-5 py-2 text-sm font-medium bg-slate-900 text-white rounded-full hover:bg-slate-800 transition shadow-sm hover:shadow-md"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 text-slate-600 hover:text-slate-900"
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 text-slate-600 hover:text-slate-900"
                        >
                            Shop
                        </Link>
                        <Link
                            to="/cart"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 text-slate-600 hover:text-slate-900"
                        >
                            Cart ({cartCount})
                        </Link>
                        <Link
                            to="/wishlist"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 text-slate-600 hover:text-slate-900"
                        >
                            Wishlist ({user?.wishlist?.length || 0})
                        </Link>
                        <hr className="border-slate-200" />
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/my-orders"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2 text-slate-600 hover:text-slate-900"
                                >
                                    My Orders
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                    className="block py-2 text-red-600 hover:text-red-700"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 py-2 text-center border border-slate-300 rounded-lg text-slate-700"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 py-2 text-center bg-slate-900 text-white rounded-lg"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-emerald-500 text-white p-1.5 rounded-lg">
                                    <ShoppingBag size={18} />
                                </div>
                                <span className="text-lg font-bold">ShopMaster</span>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Your one-stop destination for premium products at unbeatable prices.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Shop</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link to="/products" className="hover:text-white transition">All Products</Link></li>
                                <li><Link to="/products?category=electronics" className="hover:text-white transition">Electronics</Link></li>
                                <li><Link to="/products?category=fashion" className="hover:text-white transition">Fashion</Link></li>
                                <li><Link to="/products?category=home-living" className="hover:text-white transition">Home & Living</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Account</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link to="/my-orders" className="hover:text-white transition">My Orders</Link></li>
                                <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
                                <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
                                <li><Link to="/register" className="hover:text-white transition">Register</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 underline decoration-emerald-500 decoration-2 underline-offset-8">Stay Updated</h4>
                            <p className="text-slate-400 text-xs mb-4 leading-relaxed">Subscribe to receive updates, access to exclusive deals, and more.</p>
                            <form onSubmit={(e) => { e.preventDefault(); toast.success('Subscribed successfully!'); }} className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-slate-800 border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                    required
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 p-1.5 rounded-lg transition-colors">
                                    <Mail size={16} />
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} ShopMaster Pro. All rights reserved.
                        </p>
                        <div className="flex gap-4 text-slate-400 text-sm">
                            <a href="#" className="hover:text-white transition">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default StorefrontLayout;
