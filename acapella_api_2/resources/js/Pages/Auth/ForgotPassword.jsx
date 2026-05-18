import { Link } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import '../../../css/auth.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError('');
        try {
            await axios.post('/api/auth/forgot-password', { email });
            setSuccess(true);
        } catch (err) {
            const msg = err.response?.data?.message
                || err.response?.data?.errors?.email?.[0]
                || 'Something went wrong. Please try again.';
            setError(msg);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="ambient-bg top-left" />
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
                    <h2 className="auth-card h2">Reset your password</h2>
                    <p className="auth-card p">
                        Enter your email and we will send password reset instructions if the account exists.
                    </p>

                    {success ? (
                        <div className="auth-form success-message">
                            A password reset link has been sent to <strong>{email}</strong>. Please check your inbox (and spam folder).
                        </div>
                    ) : (
                        <form onSubmit={submit} className="auth-form">
                            <div>
                                <label className="auth-form label">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="auth-form input"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            {error && <div className="auth-form error-message">{error}</div>}

                            <button
                                type="submit"
                                disabled={processing}
                                className="auth-form button"
                            >
                                {processing ? 'Sending…' : 'Send reset link'}
                            </button>
                        </form>
                    )}

                    <div className="auth-footer">
                        Remember your password?{' '}
                        <Link href="/login" className="auth-footer link-text">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
