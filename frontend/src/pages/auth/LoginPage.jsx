import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin/dashboard'; // Default to admin for now, logic can improve

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            // Redirect based on role? Or just to 'from'
            // Ideally check role here
            navigate(from, { replace: true });
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-900 mb-4">
                        <LogIn size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
                    <p className="text-slate-500 mt-2">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                            <span className="text-slate-600">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-sky-600 hover:text-sky-700 font-medium">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-sky-600 hover:text-sky-700 font-medium">
                        Sign up
                    </Link>
                </p>

                {/* Development Helper */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400">
                    <p className="font-semibold mb-2">Demo Credentials:</p>
                    <p>Admin: admin@shopmaster.com / admin123</p>
                    <p>Customer: customer@example.com / customer123</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
