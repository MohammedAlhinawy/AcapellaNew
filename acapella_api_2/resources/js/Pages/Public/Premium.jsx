import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import PropTypes from 'prop-types';
import '../../../css/public.css';
import '../../../css/guest.css';
import useTranslation from '../../hooks/useTranslation';

export default function Premium({ verifiedKwayaCount = 0 }) {
    const { t } = useTranslation();
    return (
        <MainLayout>
            <div className="public-page public-container">
                <div className="public-header">
                    <h2 className="public-header h1">
                        Elevate your spiritual <br />
                        <span className="public-header gradient-text">
                            {t('public.elevate_experience')}
                        </span>
                    </h2>
                    <p className="public-header p">
                        {t('public.unlock_premium_desc')}
                    </p>
                </div>

                <div className="public-grid">
                    {/* Free Tier */}
                    <div className="public-card">
                        <h3 className="public-card h3">{t('public.basic_access')}</h3>
                        <p className="public-card sub">{t('public.free_forever')}</p>
                        
                        <div className="public-card price">
                            TSh 0<span className="public-card price span">/mo</span>
                        </div>

                        <ul className="public-card feature-list">
                            <li className="public-card feature-list item">
                                <svg className="public-card feature-list svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {t('public.streaming_ads')}
                            </li>
                            <li className="public-card feature-list item">
                                <svg className="public-card feature-list svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {t('public.browse_catalog')}
                            </li>
                            <li className="public-card feature-list item">
                                <svg className="public-card feature-list svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {t('public.up_to_tracks')}
                            </li>
                            <li className="public-card feature-list item disabled">
                                <svg className="public-card feature-list svg disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                {t('public.no_background')}
                            </li>
                            <li className="public-card feature-list item disabled">
                                <svg className="public-card feature-list svg disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                {t('public.no_liked')}
                            </li>
                            <li className="public-card feature-list item disabled">
                                <svg className="public-card feature-list svg disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                {t('public.no_playlists')}
                            </li>
                            <li className="public-card feature-list item disabled">
                                <svg className="public-card feature-list svg disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                {t('public.no_downloads')}
                            </li>
                        </ul>

                        <button className="public-card button">
                            {t('public.current_plan')}
                        </button>
                    </div>

                    {/* Premium Tier */}
                    <div className="public-card feature">
                        <div className="public-card badge-recommended">
                            {t('public.recommended')}
                        </div>

                        <div className="public-card feature-glow"></div>

                        <h3 className="public-card h3 premium">{t('public.premium_unlocked')}</h3>
                        <p className="public-card sub premium">{t('public.billed_monthly')}</p>
                        
                        <div className="public-card price premium">
                            TSh 5,000<span className="public-card price span">/mo</span>
                        </div>
                        <p className="public-card price-note">{t('public.prices_inclusive')}</p>

                        <ul className="public-card feature-list premium">
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {t('public.background_play')}
                            </li>
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {t('public.high_quality')}
                            </li>
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {t('public.unlimited_downloads')}
                            </li>
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {t('public.liked_songs')}
                            </li>
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {t('public.unlimited_playlists')}
                            </li>
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {t('public.unlimited_queue')}
                            </li>
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {t('public.support_creators', { count: verifiedKwayaCount > 0 ? verifiedKwayaCount : 'our' })}
                            </li>
                        </ul>

                        <button className="public-card premium-btn" onClick={() => router.visit('/payments?plan=monthly')}>
                            {t('public.subscribe_mobile')}
                            <svg className="public-card premium-btn svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </button>

                        <div className="public-card payment-methods">
                            {/* Generic payment operator pill boxes representing Snippe */}
                            <span className="span">M-Pesa</span>
                            <span className="span">Mix by Yas</span>
                            <span className="span">HaloPesa</span>
                            <span className="span">Airtel Money</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '48px', textAlign: 'center', padding: '32px 24px', background: 'linear-gradient(135deg, rgba(184,134,11,0.15), rgba(184,134,11,0.05))', borderRadius: '16px', border: '1px solid rgba(184,134,11,0.3)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>☕</div>
                    <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.4rem' }}>{t('public.not_ready_premium')}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', maxWidth: '500px', margin: '0 auto 20px' }}>
                        {t('public.donation_desc')}
                    </p>
                    <button
                        onClick={() => router.visit('/donate')}
                        style={{
                            background: '#B8860B',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 28px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                        }}
                    >
                        {t('public.buy_coffee')}
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}

Premium.propTypes = {
    verifiedKwayaCount: PropTypes.number,
};
