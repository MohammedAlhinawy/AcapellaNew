import PropTypes from 'prop-types';
import '../../css/dialog.css';
import useTranslation from '../hooks/useTranslation';

export default function SubscriptionDialog({ isOpen, onClose, onSelectPlan }) {
    const { t } = useTranslation();
    
    const PLANS = {
        monthly: {
            name: t('dialog.monthly'),
            price: 5000,
            currency: 'TZS',
            period: t('dialog.per_month'),
            features: [
                t('dialog.feature_unlimited'),
                t('dialog.feature_download'),
                t('dialog.feature_ad_free'),
                t('dialog.feature_high_quality'),
            ],
        },
        yearly: {
            name: t('dialog.yearly'),
            price: 50000,
            currency: 'TZS',
            period: t('dialog.per_year'),
            features: [
                t('dialog.feature_monthly_features'),
                t('dialog.feature_save_percent'),
                t('dialog.feature_priority_support'),
                t('dialog.feature_early_access'),
            ],
        },
    };
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-container" style={{ maxWidth: '700px' }}>
                <div className="dialog-header">
                    <h2>{t('dialog.choose_plan')}</h2>
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
