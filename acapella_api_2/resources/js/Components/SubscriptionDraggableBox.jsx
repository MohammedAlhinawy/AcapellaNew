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

export default function SubscriptionDraggableBox({ isOpen, onClose, onSelectPlan }) {
    if (!isOpen) return null;

    return (
        <div className="draggable-box-overlay">
            <div className="draggable-box-container">
                <div className="draggable-box-header">
                    <h2>Choose Your Plan</h2>
                    <button onClick={onClose} className="draggable-box-close-button">×</button>
                </div>
                <div className="draggable-box-form" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {Object.entries(PLANS).map(([key, plan]) => (
                        <div
                            key={key}
                            className="draggable-box-plan-card"
                            style={{
                                border: '1px solid var(--border-primary)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 'var(--spacing-lg)',
                                background: 'var(--bg-tertiary)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-normal)',
                            }}
                            onClick={() => onSelectPlan(key)}
                        >
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--spacing-sm)' }}>
                                {plan.name}
                            </h3>
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
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

SubscriptionDraggableBox.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelectPlan: PropTypes.func.isRequired,
};
