import MainLayout from '../../Layout/MainLayout';
import { Link } from '@inertiajs/react';
import { FaMicrophone, FaUsers, FaChartLine, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import '../../../css/requests.css';
import useTranslation from '../../hooks/useTranslation';

export default function BecomeChoirManager() {
    const { t } = useTranslation();
    return (
        <MainLayout>
            <div className="req-page">
                <div className="req-hero">
                    <span className="req-badge">{t('public.for_choir_leaders')}</span>
                    <h1>{t('public.become_choir_manager')}</h1>
                    <p>
                        {t('public.become_manager_desc')}
                    </p>
                </div>

                <div className="req-info-grid">
                    <div className="req-info-card">
                        <div className="icon"><FaMicrophone /></div>
                        <h3>{t('public.upload_music')}</h3>
                        <p>{t('public.upload_music_desc')}</p>
                    </div>
                    <div className="req-info-card">
                        <div className="icon"><FaUsers /></div>
                        <h3>{t('public.reach_fans')}</h3>
                        <p>{t('public.reach_fans_desc')}</p>
                    </div>
                    <div className="req-info-card">
                        <div className="icon"><FaChartLine /></div>
                        <h3>{t('public.track_performance')}</h3>
                        <p>{t('public.track_performance_desc')}</p>
                    </div>
                    <div className="req-info-card">
                        <div className="icon"><FaShieldAlt /></div>
                        <h3>{t('public.verified_status')}</h3>
                        <p>{t('public.verified_status_desc')}</p>
                    </div>
                </div>

                <div className="req-cta">
                    <Link href="/become-choir-manager/submit" className="req-btn">
                        {t('public.submit_request')} <FaArrowRight />
                    </Link>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '12px' }}>
                        {t('public.review_notice')}
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
