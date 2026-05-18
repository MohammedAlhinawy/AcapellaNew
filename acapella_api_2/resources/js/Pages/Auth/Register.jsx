import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import apiService from '../../Services/apiService';
import { db, STORAGE_KEYS } from '../../Utils/indexedDB';
import { toast } from '../../Components/ToastContainer';
import '../../../css/auth.css';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (field) => (e) => {
        setData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await apiService.post('/auth/register', {
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
                role: 'listener',
            });

            const { user, token } = response.data.data;

            // Store token and user data in IndexedDB
            await db.init();
            await db.set('auth', STORAGE_KEYS.AUTH_TOKEN, token);
            await db.set('auth', STORAGE_KEYS.USER_DATA, user);

            // Dispatch auth changed event for Nav component
            window.dispatchEvent(new CustomEvent('auth-changed'));

            toast.success('Akaunti imeundwa kwa mafanikio!');

            // Redirect to auth gate which will handle the redirect based on user role
            router.visit('/auth-gate');
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error response:', error.response);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                toast.error('Tafadhali angalia fomu kwa makosa.');
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
                toast.error(error.response.data.message);
            } else {
                setErrors({ general: 'An error occurred. Please try again.' });
                toast.error('Kuna hitilafu. Tafadhali jaribu tena.');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Ambient Backgrounds */}
            <div className="ambient-bg top-right" />
            <div className="auth-container">
                <div className="auth-logo-container">
                    <Link href="/" className="logo-link">
                        <img src="/images/logo.png" alt="Acapella Logo" className="logo-img" />
                        <h1 className="logo-text">
                            Acapella
                        </h1>
                    </Link>
                </div>

                <div className="auth-card">
                    <h2 className="auth-card h2">Create your account</h2>
                    
                    <form onSubmit={submit} className="auth-form">
                        <div>
                            <label className="auth-form label">Full Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={handleChange('name')}
                                className="auth-form input"
                                placeholder="Your Name"
                            />
                            {errors.name && <div className="auth-form error-message">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="auth-form label">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={handleChange('email')}
                                className="auth-form input"
                                placeholder="name@example.com"
                            />
                            {errors.email && <div className="auth-form error-message">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="auth-form label">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={handleChange('password')}
                                    className="auth-form input"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                >
                                    {showPassword ? (
                                        <svg className="password-toggle svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="password-toggle svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <div className="auth-form error-message">{errors.password}</div>}
                        </div>
                        
                        <div>
                            <label className="auth-form label">Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={handleChange('password_confirmation')}
                                    className="auth-form input"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="password-toggle"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="password-toggle svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="password-toggle svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && <div className="auth-form error-message">{errors.password_confirmation}</div>}
                        </div>

                        <button 
                            disabled={processing}
                            className="auth-form button"
                        >
                            Jisajili
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account?{' '}
                        <Link href="/login" className="auth-footer link-text">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
