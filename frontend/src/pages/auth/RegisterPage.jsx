import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { UserPlus, Eye, EyeOff, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    // Password strength check
    const getPasswordStrength = () => {
        const { password } = formData;
        if (!password) return { score: 0, label: '', color: '' };

        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

        const levels = [
            { score: 0, label: '', color: '' },
            { score: 1, label: 'Weak', color: 'bg-red-500' },
            { score: 2, label: 'Fair', color: 'bg-orange-500' },
            { score: 3, label: 'Good', color: 'bg-yellow-500' },
            { score: 4, label: 'Strong', color: 'bg-emerald-500' }
        ];

        return levels[score] || levels[0];
    };

    const passwordStrength = getPasswordStrength();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!agreedToTerms) {
            setError('Please agree to the terms and conditions');
            return;
        }

        setLoading(true);

        const result = await register(formData.name, formData.email, formData.password);

        if (result.success) {
            toast.success('Account created successfully!');
            navigate('/');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4 shadow-lg shadow-emerald-500/30">
                            <UserPlus size={26} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
                        <p className="text-slate-500 mt-2">Join ShopMaster and start shopping</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {/* Password Strength */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full ${passwordStrength.score >= level
                                                    ? passwordStrength.color
                                                    : 'bg-slate-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Password strength: <span className="font-medium">{passwordStrength.label}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border ${formData.confirmPassword && formData.password !== formData.confirmPassword
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : formData.confirmPassword && formData.password === formData.confirmPassword
                                        ? 'border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500'
                                        : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                                    } outline-none transition`}
                                placeholder="••••••••"
                            />
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                    <Check size={12} /> Passwords match
                                </p>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="terms" className="text-sm text-slate-600">
                                I agree to the{' '}
                                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    {/* Social Login (Optional placeholder) */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-400">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm font-medium text-slate-700">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm font-medium text-slate-700">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub
                            </button>
                        </div>
                    </div>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
