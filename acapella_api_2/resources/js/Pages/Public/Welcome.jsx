import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import { FaPlay, FaUsers, FaBolt, FaHeart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import '../../../css/public.css';
import '../../../css/guest.css';
import useTranslation from '../../hooks/useTranslation';

export default function Welcome({ stats = { choirs: 0, tracks: 0 } }) {
    const { t } = useTranslation();
    return (
        <MainLayout>
            <div className="public-page welcome-container">
                <div className="public-header badge">
                    {t('public.welcome_badge')}
                </div>

                <h1 className="public-header h1 welcome">
                    {t('public.listen_tanzania')} <br />
                    <span className="public-header gradient-text">
                        {t('public.voices_tanzania')}
                    </span>
                </h1>

                <p className="public-header p welcome">
                    {t('public.welcome_desc', { choirs: stats.choirs, tracks: stats.tracks })}
                </p>

                <div className="public-grid welcome">
                    <div className="public-card">
                        <div className="icon blue">
                            <FaPlay className="svg" size={24} />
                        </div>
                        <h3 className="public-card h3">{t('public.high_quality_sound')}</h3>
                        <p className="public-card p">
                            {t('public.high_quality_desc')}
                        </p>
                    </div>

                    <div className="public-card">
                        <div className="icon amber">
                            <FaUsers className="svg" size={24} />
                        </div>
                        <h3 className="public-card h3">{t('public.support_choirs')}</h3>
                        <p className="public-card p">
                            {t('public.support_choirs_desc')}
                        </p>
                    </div>

                    <div className="public-card last">
                        <div className="icon purple">
                            <FaBolt className="svg" size={24} />
                        </div>
                        <h3 className="public-card h3">{t('public.instant_sync')}</h3>
                        <p className="public-card p">
                            {t('public.instant_sync_desc')}
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '48px', textAlign: 'center', padding: '32px 24px', background: 'linear-gradient(135deg, rgba(184,134,11,0.15), rgba(184,134,11,0.05))', borderRadius: '16px', border: '1px solid rgba(184,134,11,0.3)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>☕</div>
                    <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.4rem' }}>{t('public.buy_coffee')}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', maxWidth: '500px', margin: '0 auto 20px' }}>
                        {t('public.donate_desc')}
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
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <FaHeart /> {t('public.donate_now')}
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}

Welcome.propTypes = {
    stats: PropTypes.shape({
        choirs: PropTypes.number,
        tracks: PropTypes.number,
    }),
};
