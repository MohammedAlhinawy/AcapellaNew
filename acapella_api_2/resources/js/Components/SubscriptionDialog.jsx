import PropTypes from 'prop-types';
import '../../css/dialog.css';

const PLANS = {
    monthly: {
        name: 'Monthly',
        price: 5000,
        currency: 'TZS',
        period: 'per month',
        features: [
            'Unlimited music streaming',
            'Download for offline listening',
            'Ad-free experience',
            'High quality audio',
        ],
    },
    yearly: {
        name: 'Yearly',
        price: 50000,
        currency: 'TZS',
        period: 'per year',
        features: [
            'All monthly features',
            'Save 16% compared to monthly',
            'Priority support',
            'Early access to new releases',
        ],
    },
};

export default function SubscriptionDialog({ isOpen, onClose, onSelectPlan }) {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-container" style={{ maxWidth: '700px' }}>
                <div className="dialog-header">
                    <h2>Choose Your Plan</h2>
                    <button onClick={onClose} className="dialog-close-button">×</button>
                </div>
                <div className="dialog-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                    {Object.entries(PLANS).map(([key, plan]) => (
                        <div
                            key={key}
                            className="subscription-plan-card"
                            style={{
                                border: '1px solid var(--border-primary)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--spacing-xl)',
                                background: 'var(--bg-tertiary)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-normal)',
                            }}
                            onClick={() => onSelectPlan(key)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-primary)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--spacing-sm)' }}>
                                {plan.name}
                            </h3>
                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--accent-primary)' }}>
                                    {plan.price.toLocaleString()}
                                </span>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                                    {' '}{plan.currency} {plan.period}
                                </span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {plan.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--text-secondary)',
                                            marginBottom: 'var(--spacing-xs)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-xs)',
                                        }}
                                    >
                                        <span style={{ color: 'var(--success)', fontSize: 'var(--text-base)' }}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

SubscriptionDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelectPlan: PropTypes.func.isRequired,
};
