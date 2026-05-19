import { useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import apiService from '../../Services/apiService';
import { toast } from '../../Components/ToastContainer';
import '../../../css/listener.css';
import '../../../css/payments-donate.css';
import { FaShieldAlt, FaMobileAlt, FaHeart } from 'react-icons/fa';
import useTranslation from '../../hooks/useTranslation';

const PRESET_AMOUNTS = [15000, 30000, 50000, 100000, 200000];
const MIN_AMOUNT = 5000;

export default function Donate() {
    const { t } = useTranslation();
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
            toast.error(t('donate.min_amount', { amount: MIN_AMOUNT.toLocaleString() }));
            return;
        }

        if (!phone) {
            toast.error(t('donate.enter_phone'));
            return;
        }

        const phoneRegex = /^(\+255[0-9]{9}|0[0-9]{9})$/;
        if (!phoneRegex.test(phone)) {
            toast.error(t('donate.valid_phone'));
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
            toast.success(t('donate.donation_initiated'));
        } catch (error) {
            console.error('Donation initiation error:', error);
            toast.error(error.response?.data?.message || t('donate.failed_donation'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="pd-page">
                <header className="pd-hero">
                    <span className="pd-hero-eyebrow"><FaHeart /> {t('donate.support_acapella')}</span>
                    <h1>{t('donate.buy_coffee')}</h1>
                    <p>{t('donate.help_cover')}</p>
                </header>

                <div className="pd-stack">
                    {/* Why donate */}
                    <section className="pd-card luxe">
                        <div className="pd-card-label">{t('donate.why_donate')}</div>
                        <div className="pd-prose">
                            <p>
                                {t('donate.contribution_help')}
                            </p>
                            <p>{t('donate.asante')}</p>
                        </div>
                    </section>

                    {/* Amount */}
                    <section className="pd-card">
                        <h2>{t('donate.choose_amount')}</h2>
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
                                <label htmlFor="amount">{t('donate.custom_amount')}</label>
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
                                    {t('donate.min_donation', { amount: MIN_AMOUNT.toLocaleString() })}
                                </span>
                            </div>

                            <div className="pd-field">
                                <label htmlFor="phone">{t('donate.phone_number')}</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+255712345678 or 0712345678"
                                    required
                                />
                                <span className="pd-field-hint">
                                    {t('donate.enter_tanzanian_phone')}
                                </span>
                            </div>

                            <div className="pd-field">
                                <label>{t('donate.payment_method')}</label>
                                <div className="pd-method">
                                    <div className="pd-method-icon"><FaMobileAlt /></div>
                                    <div>
                                        <div className="pd-method-title">{t('donate.mobile_money')}</div>
                                        <div className="pd-method-meta">{t('donate.mobile_money_providers')}</div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="pd-cta"
                                disabled={loading || !amount || amount < MIN_AMOUNT}
                            >
                                {loading
                                    ? t('donate.processing')
                                    : t('donate.donate_amount', { amount: (amount || 0).toLocaleString() })}
                            </button>
                        </form>
                    </section>

                    {donationId && (
                        <section className="pd-card">
                            <div className="pd-status">
                                <div className="pd-status-icon">🙏</div>
                                <h3>{t('donate.thank_you')}</h3>
                                <p>{t('donate.check_phone')}</p>
                                <div className="pd-status-ref">{t('donate.reference')} {donationId}</div>
                            </div>
                        </section>
                    )}

                    <div className="pd-trust">
                        <FaShieldAlt className="pd-trust-icon" /> {t('donate.secured_by')}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
