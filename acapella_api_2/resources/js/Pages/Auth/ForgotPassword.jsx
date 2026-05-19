import { Link } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import '../../../css/auth.css';
import useTranslation from '../../hooks/useTranslation';

export default function ForgotPassword() {
    const { t } = useTranslation();
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
                || t('auth.something_wrong');
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
                    <h2 className="auth-card h2">{t('auth.reset_password')}</h2>
                    <p className="auth-card p">
                        {t('auth.reset_description')}
                    </p>

                    {success ? (
                        <div className="auth-form success-message">
                            {t('auth.reset_link_sent')} <strong>{email}</strong>. {t('auth.check_inbox')}
                        </div>
                    ) : (
                        <form onSubmit={submit} className="auth-form">
                            <div>
                                <label className="auth-form label">{t('auth.email')}</label>
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
                                {processing ? t('auth.sending') : t('auth.send_reset_link')}
                            </button>
                        </form>
                    )}

                    <div className="auth-footer">
                        {t('auth.remember_password')}{' '}
                        <Link href="/login" className="auth-footer link-text">
                            {t('auth.login')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
