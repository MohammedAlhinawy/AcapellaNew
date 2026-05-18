import { useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import apiService from '../../Services/apiService';
import { toast } from '../../Components/ToastContainer';
import '../../../css/listener.css';
import '../../../css/payments-donate.css';
import { FaShieldAlt, FaMobileAlt, FaHeart } from 'react-icons/fa';

const PRESET_AMOUNTS = [15000, 30000, 50000, 100000, 200000];
const MIN_AMOUNT = 5000;

export default function Donate() {
    const [amount, setAmount] = useState(MIN_AMOUNT);
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [donationId, setDonationId] = useState(null);

    const formatPhoneNumber = (inputPhone) => {
        if (inputPhone.startsWith('0')) {
            return '+255' + inputPhone.substring(1);
        }
        if (inputPhone.startsWith('255') && !inputPhone.startsWith('+')) {
            return '+' + inputPhone;
        }
        return inputPhone;
    };

    const handleAmountChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setAmount(val === '' ? '' : parseInt(val, 10));
    };

    const handleDonate = async (e) => {
        e.preventDefault();

        if (!amount || amount < MIN_AMOUNT) {
            toast.error(`Minimum donation is ${MIN_AMOUNT.toLocaleString()} TZS`);
            return;
        }

        if (!phone) {
            toast.error('Please enter your phone number');
            return;
        }

        const phoneRegex = /^(\+255[0-9]{9}|0[0-9]{9})$/;
        if (!phoneRegex.test(phone)) {
            toast.error('Please enter a valid Tanzanian phone number (+255XXXXXXXXX or 0XXXXXXXXX)');
            return;
        }

        const formattedPhone = formatPhoneNumber(phone);

        setLoading(true);

        try {
            const response = await apiService.post('/donations/initiate', {
                amount: parseInt(amount, 10),
                phone: formattedPhone,
            });

            setDonationId(response.data.data.subscription_id);
            toast.success('Donation initiated. Please confirm on your phone.');
        } catch (error) {
            console.error('Donation initiation error:', error);
            toast.error(error.response?.data?.message || 'Failed to initiate donation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="pd-page">
                <header className="pd-hero">
                    <span className="pd-hero-eyebrow"><FaHeart /> Support Acapella</span>
                    <h1>Buy Us a Coffee ☕</h1>
                    <p>Help us cover server costs, pay our artists, and ship new features for the community.</p>
                </header>

                <div className="pd-stack">
                    {/* Why donate */}
                    <section className="pd-card luxe">
                        <div className="pd-card-label">Why Donate</div>
                        <div className="pd-prose">
                            <p>
                                Every contribution — big or small — helps us cover server costs,
                                pay our artists, and build new features for the community.
                            </p>
                            <p>Asante sana kwa msaada wako! 🙏</p>
                        </div>
                    </section>

                    {/* Amount */}
                    <section className="pd-card">
                        <h2>Choose an Amount</h2>
                        <div className="pd-amount-grid">
                            {PRESET_AMOUNTS.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setAmount(preset)}
                                    className={`pd-amount-chip ${amount === preset ? 'active' : ''}`}
                                >
                                    {preset.toLocaleString()} TZS
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleDonate} className="pd-form">
                            <div className="pd-field">
                                <label htmlFor="amount">Custom Amount (TZS)</label>
                                <input
                                    id="amount"
                                    type="text"
                                    inputMode="numeric"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="5000"
                                    required
                                />
                                <span className="pd-field-hint">
                                    Minimum donation: {MIN_AMOUNT.toLocaleString()} TZS
                                </span>
                            </div>

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
                                    Enter your Tanzanian mobile number
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

                            <button
                                type="submit"
                                className="pd-cta"
                                disabled={loading || !amount || amount < MIN_AMOUNT}
                            >
                                {loading
                                    ? 'Processing…'
                                    : `Donate ${(amount || 0).toLocaleString()} TZS`}
                            </button>
                        </form>
                    </section>

                    {donationId && (
                        <section className="pd-card">
                            <div className="pd-status">
                                <div className="pd-status-icon">🙏</div>
                                <h3>Thank You!</h3>
                                <p>Please check your phone to complete the donation via USSD prompt.</p>
                                <div className="pd-status-ref">Reference: {donationId}</div>
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
