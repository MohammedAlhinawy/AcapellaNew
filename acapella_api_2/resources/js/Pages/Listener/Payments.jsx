import { useState, useEffect } from 'react';
import MainLayout from '../../Layout/MainLayout';
import apiService from '../../Services/apiService';
import { toast } from '../../Components/ToastContainer';
import '../../../css/listener.css';
import '../../../css/payments-donate.css';
import { FaShieldAlt, FaCheckCircle, FaMobileAlt } from 'react-icons/fa';
import useTranslation from '../../hooks/useTranslation';

const PLANS = {
    monthly: {
        name: 'Monthly',
        price: 5000,
        currency: 'TZS',
        period: 'per month',
    },
    yearly: {
        name: 'Yearly',
        price: 50000,
        currency: 'TZS',
        period: 'per year',
    },
};

export default function Payments() {
    const { t } = useTranslation();
    const [plan, setPlan] = useState('monthly');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [subscriptionId, setSubscriptionId] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const planParam = urlParams.get('plan');
        if (planParam && (planParam === 'monthly' || planParam === 'yearly')) {
            setPlan(planParam);
        }
    }, []);

    const formatPhoneNumber = (inputPhone) => {
        // If phone starts with 0, convert to +255 format
        if (inputPhone.startsWith('0')) {
            return '+255' + inputPhone.substring(1);
        }
        // If phone starts with 255 (without +), add +
        if (inputPhone.startsWith('255') && !inputPhone.startsWith('+')) {
            return '+' + inputPhone;
        }
        // Return as is if already in +255 format
        return inputPhone;
    };

    const handleInitiatePayment = async (e) => {
        e.preventDefault();

        if (!phone) {
            toast.error(t('payments.enter_phone'));
            return;
        }

        // Accept both formats: +255XXXXXXXXX or 0XXXXXXXXX
        const phoneRegex = /^(\+255[0-9]{9}|0[0-9]{9})$/;
        if (!phoneRegex.test(phone)) {
            toast.error(t('payments.valid_phone'));
            return;
        }

        const formattedPhone = formatPhoneNumber(phone);

        setLoading(true);

        try {
            const response = await apiService.post('/subscriptions/initiate', {
                plan,
                phone: formattedPhone,
            });

            setSubscriptionId(response.data.data.subscription_id);
            toast.success(t('payments.payment_initiated'));
        } catch (error) {
            console.error('Payment initiation error:', error);
            toast.error(error.response?.data?.message || t('payments.failed_payment'));
        } finally {
            setLoading(false);
        }
    };

    const selectedPlan = PLANS[plan];

    const altPlan = plan === 'monthly' ? 'yearly' : 'monthly';

    return (
        <MainLayout>
            <div className="pd-page">
                <header className="pd-hero">
                    <span className="pd-hero-eyebrow">{t('payments.premium_badge')}</span>
                    <h1>{t('payments.complete_payment')}</h1>
                    <p>{t('payments.secure_subscription')}</p>
                </header>

                <div className="pd-stack">
                    {/* Selected plan */}
                    <section className="pd-card luxe">
                        <div className="pd-card-label">{t('payments.selected_plan')}</div>
                        <div className="pd-plan-name">{t(`payments.${plan}`)}</div>
                        <div className="pd-plan-price">
                            <span className="pd-price-num">{selectedPlan.price.toLocaleString()}</span>
                            <span className="pd-price-meta">{selectedPlan.currency} · {t(`payments.per_${plan === 'monthly' ? 'month' : 'year'}`)}</span>
                        </div>
                        <div className="pd-switch-row">
                            <button
                                type="button"
                                className="pd-link-button"
                                onClick={() => {
                                    setPlan(altPlan);
                                    window.history.replaceState(null, '', `/payments?plan=${altPlan}`);
                                }}
                            >
                                {t('payments.switch_to')} {t(`payments.${altPlan}`)}
                            </button>
                        </div>
                    </section>

                    {/* Payment details */}
                    <section className="pd-card">
                        <h2>{t('payments.payment_details')}</h2>
                        <form onSubmit={handleInitiatePayment} className="pd-form">
                            <div className="pd-field">
                                <label htmlFor="phone">{t('payments.phone_number')}</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+255712345678 or 0712345678"
                                    required
                                />
                                <span className="pd-field-hint">
                                    {t('payments.phone_format')}
                                </span>
                            </div>

                            <div className="pd-field">
                                <label>{t('payments.payment_method')}</label>
                                <div className="pd-method">
                                    <div className="pd-method-icon"><FaMobileAlt /></div>
                                    <div>
                                        <div className="pd-method-title">{t('payments.mobile_money')}</div>
                                        <div className="pd-method-meta">{t('payments.mobile_money_providers')}</div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="pd-cta" disabled={loading}>
                                {loading ? t('payments.processing') : `${t('payments.pay_amount')} ${selectedPlan.price.toLocaleString()} TZS`}
                            </button>
                        </form>
                    </section>

                    {subscriptionId && (
                        <section className="pd-card">
                            <div className="pd-status">
                                <div className="pd-status-icon"><FaCheckCircle /></div>
                                <h3>{t('payments.payment_initiated_title')}</h3>
                                <p>{t('payments.check_phone')}</p>
                                <div className="pd-status-ref">{t('payments.transaction_id')} {subscriptionId}</div>
                            </div>
                        </section>
                    )}

                    <div className="pd-trust">
                        <FaShieldAlt className="pd-trust-icon" /> {t('payments.secured_by')}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
