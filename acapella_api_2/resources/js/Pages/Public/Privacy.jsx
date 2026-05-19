import MainLayout from '../../Layout/MainLayout';
import '../../../css/public.css';
import '../../../css/guest.css';
import useTranslation from '../../hooks/useTranslation';

export default function Privacy() {
    const { t } = useTranslation();
    return (
        <MainLayout>
            <div className="public-page public-container">
                <div className="public-header">
                    <h1 className="public-header h1">{t('public.privacy_policy')}</h1>
                    <p className="public-header p small">{t('public.last_updated')} {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="public-prose">
                    <h2 className="public-prose h2">{t('public.info_collect')}</h2>
                    <p className="public-prose p">
                        {t('public.info_collect_desc')}
                    </p>

                    <h2 className="public-prose h2">{t('public.use_info')}</h2>
                    <p className="public-prose p">
                        {t('public.use_info_desc')}
                    </p>

                    <h2 className="public-prose h2">{t('public.data_sharing')}</h2>
                    <p className="public-prose p">
                        {t('public.data_sharing_desc')}
                    </p>

                    <h2 className="public-prose h2">{t('public.your_rights')}</h2>
                    <p className="public-prose p">
                        {t('public.your_rights_desc')}
                    </p>

                    <h2 className="public-prose h2">{t('public.contact_us')}</h2>
                    <p className="public-prose p">
                        {t('public.contact_us_desc')}
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
