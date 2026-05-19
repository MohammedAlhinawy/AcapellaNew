import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import apiService from '../../Services/apiService';
import { db, STORAGE_KEYS } from '../../Utils/indexedDB';
import { toast } from '../../Components/ToastContainer';
import '../../../css/auth.css';
import useTranslation from '../../hooks/useTranslation';

export default function Login() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const handleChange = (field) => (e) => {
        setData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleCheckboxChange = (field) => (e) => {
        setData(prev => ({ ...prev, [field]: e.target.checked }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await apiService.post('/auth/login', {
                email: data.email,
                password: data.password,
                remember: data.remember,
            });

            const { user, token } = response.data.data;

            // Store token and user data in IndexedDB
            await db.init();
            await db.set('auth', STORAGE_KEYS.AUTH_TOKEN, token);
            await db.set('auth', STORAGE_KEYS.USER_DATA, user);

            // Dispatch auth changed event for Nav component
            window.dispatchEvent(new CustomEvent('auth-changed'));

            toast.success(t('auth.login_success'));

            // Redirect based on user role
            const redirectPath = getRedirectPath(user.role);
            router.visit(redirectPath);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                toast.error(t('auth.check_form_errors'));
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
                toast.error(error.response.data.message);
            } else {
                setErrors({ general: t('auth.error_occurred') });
                toast.error(t('auth.error_occurred'));
            }
        } finally {
            setProcessing(false);
        }
    };

    const getRedirectPath = (role) => {
        const normalizedRole = role?.toString().trim().toLowerCase();
        const roleRedirects = {
            admin: '/admin',
            choir_manager: '/manager',
            listener: '/explore',
        };
        return roleRedirects[normalizedRole] || '/explore';
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
                    <h2 className="auth-card h2">{t('auth.welcome_back')}</h2>
                    
                    <form onSubmit={submit} className="auth-form">
                        <div>
                            <label className="auth-form label">{t('auth.email')}</label>
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
                            <label className="auth-form label">{t('auth.password')}</label>
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

                        <div className="auth-form checkbox-container">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={handleCheckboxChange('remember')}
                                    className="auth-form checkbox"
                                />
                                <span className="checkbox-label span">{t('auth.remember_me')}</span>
                            </label>
                            <Link href="/forgot-password" className="forgot-password-link">
                                {t('auth.forgot_password')}
                            </Link>
                        </div>

                        <button 
                            disabled={processing}
                            className="auth-form button"
                        >
                            {t('auth.login')}
                            {/* <svg className="auth-form button svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg> */}
                        </button>
                    </form>

                    <div className="auth-footer">
                        {t('auth.no_account')}{' '}
                        <Link href="/register" className="auth-footer link-text">
                            {t('auth.sign_up')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
