import { useState, useEffect } from 'react';
import MainLayout from '../../Layout/MainLayout';
import apiService from '../../Services/apiService';
import { toast } from '../../Components/ToastContainer';
import '../../../css/listener.css';
import '../../../css/payments-donate.css';
import { FaShieldAlt, FaCheckCircle, FaMobileAlt } from 'react-icons/fa';

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
            toast.error('Please enter your phone number');
            return;
        }

        // Accept both formats: +255XXXXXXXXX or 0XXXXXXXXX
        const phoneRegex = /^(\+255[0-9]{9}|0[0-9]{9})$/;
        if (!phoneRegex.test(phone)) {
            toast.error('Please enter a valid Tanzanian phone number (+255XXXXXXXXX or 0XXXXXXXXX)');
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
            toast.success('Payment initiated. Please confirm on your phone.');
        } catch (error) {
            console.error('Payment initiation error:', error);
            toast.error(error.response?.data?.message || 'Failed to initiate payment');
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
                    <span className="pd-hero-eyebrow">✦ Acapella Premium</span>
                    <h1>Complete Your Payment</h1>
                    <p>Secure your premium subscription and unlock the full Acapella experience.</p>
                </header>

                <div className="pd-stack">
                    {/* Selected plan */}
                    <section className="pd-card luxe">
                        <div className="pd-card-label">Selected Plan</div>
                        <div className="pd-plan-name">{selectedPlan.name}</div>
                        <div className="pd-plan-price">
                            <span className="pd-price-num">{selectedPlan.price.toLocaleString()}</span>
                            <span className="pd-price-meta">{selectedPlan.currency} · {selectedPlan.period}</span>
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
                                Switch to {altPlan === 'monthly' ? 'Monthly' : 'Yearly'}
                            </button>
                        </div>
                    </section>

                    {/* Payment details */}
                    <section className="pd-card">
                        <h2>Payment Details</h2>
                        <form onSubmit={handleInitiatePayment} className="pd-form">
                            <div className="pd-field">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+255712345678 or 0712345678"
                                    required
                                />
                                <span className="pd-field-hint">
                                    Format: +255XXXXXXXXX or 0XXXXXXXXX
                                </span>
                            </div>

                            <div className="pd-field">
                                <label>Payment Method</label>
                                <div className="pd-method">
                                    <div className="pd-method-icon"><FaMobileAlt /></div>
                                    <div>
                                        <div className="pd-method-title">Mobile Money</div>
                                        <div className="pd-method-meta">M-Pesa · Tigo Pesa · Airtel Money · Halopesa</div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="pd-cta" disabled={loading}>
                                {loading ? 'Processing…' : `Pay ${selectedPlan.price.toLocaleString()} TZS`}
                            </button>
                        </form>
                    </section>

                    {subscriptionId && (
                        <section className="pd-card">
                            <div className="pd-status">
                                <div className="pd-status-icon"><FaCheckCircle /></div>
                                <h3>Payment Initiated</h3>
                                <p>Check your phone and approve the USSD prompt to complete payment.</p>
                                <div className="pd-status-ref">Transaction ID: {subscriptionId}</div>
                            </div>
                        </section>
                    )}

                    <div className="pd-trust">
                        <FaShieldAlt className="pd-trust-icon" /> Secured by Mongike Payment Gateway
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
