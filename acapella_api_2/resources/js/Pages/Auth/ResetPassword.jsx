import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../../../css/auth.css';

export default function ResetPassword({ email: initialEmail = '', token: initialToken = '' }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formError, setFormError] = useState('');
    const [errors, setErrors] = useState({});
    const [data, setDataState] = useState({
        email: initialEmail,
        token: initialToken,
        password: '',
        password_confirmation: '',
    });

    const setData = (key, value) => setDataState(prev => ({ ...prev, [key]: value }));

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setFormError('');
        setErrors({});
        try {
            await axios.post('/api/auth/reset-password', data);
            setSuccess(true);
            setTimeout(() => router.visit('/login'), 2500);
        } catch (err) {
            const resp = err.response?.data;
            if (resp?.errors) {
                setErrors(resp.errors);
            } else {
                setFormError(resp?.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="ambient-bg bottom-right" />
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
                    <h2 className="auth-card h2">Create a new password</h2>

                    {success && (
                        <div className="auth-form success-message">
                            Password reset successfully! Redirecting to login…
                        </div>
                    )}

                    {formError && (
                        <div className="auth-form error-message">{formError}</div>
                    )}

                    <form onSubmit={submit} className="auth-form">
                        <div>
                            <label className="auth-form label">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="auth-form input"
                                placeholder="name@example.com"
                            />
                            {errors.email && <div className="auth-form error-message">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="auth-form label">Reset Token</label>
                            <input
                                type="text"
                                value={data.token}
                                onChange={e => setData('token', e.target.value)}
                                className="auth-form input"
                                placeholder="Paste your reset token"
                            />
                            {errors.token && <div className="auth-form error-message">{errors.token}</div>}
                        </div>

                        <div>
                            <label className="auth-form label">New Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
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
                            <label className="auth-form label">Confirm New Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
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
                            Reset password
                        </button>
                    </form>

                    <div className="auth-footer">
                        Back to{' '}
                        <Link href="/login" className="auth-footer link-text">
                            login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

ResetPassword.propTypes = {
    email: PropTypes.string,   // passed as initialEmail
    token: PropTypes.string,   // passed as initialToken
};
