import { useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import apiService from '../../Services/apiService';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import '../../../css/requests.css';
import useTranslation from '../../hooks/useTranslation';

export default function SubmitManagerRequest() {
    const { t } = useTranslation();
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        phone: '',
        choir_name: '',
        location: '',
        motivation: '',
        experience: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            await apiService.post('/manager-requests', form);
            setSuccess(true);
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                alert(err.response?.data?.message || t('public.failed_submit'));
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <MainLayout>
                <div className="req-page narrow reply">
                    <div className="req-form-card" style={{ textAlign: 'center' }}>
                        <FaCheckCircle size={56} style={{ color: 'var(--success)', marginBottom: 16 }} />
                        <h1 style={{ fontSize: '1.8rem', marginBottom: 12 }}>{t('public.request_submitted')}</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 18 }}>
                            {t('public.request_submitted_desc')} <strong>{form.email}</strong>.
                        </p>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem', marginBottom: 24 }}>
                            <strong>Tip:</strong> {t('public.check_spam')}
                        </p>
                        <button onClick={() => router.visit('/welcome')} className="req-btn">{t('public.back_home')}</button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="req-page narrow">
                <div className="req-hero">
                    <span className="req-badge">{t('public.manager_application')}</span>
                    <h1>{t('public.tell_us_choir')}</h1>
                    <p>{t('public.fill_details')}</p>
                </div>

                <form className="req-form-card" onSubmit={handleSubmit}>
                    <div className="req-form-row">
                        <div className="req-form-group">
                            <label className="req-form-label">{t('public.full_name')}</label>
                            <input className="req-form-input" name="full_name" value={form.full_name} onChange={handleChange} required />
                            {errors.full_name && <span className="req-form-error">{errors.full_name[0]}</span>}
                        </div>
                        <div className="req-form-group">
                            <label className="req-form-label">{t('public.email')}</label>
                            <input type="email" className="req-form-input" name="email" value={form.email} onChange={handleChange} required />
                            {errors.email && <span className="req-form-error">{errors.email[0]}</span>}
                        </div>
                    </div>

                    <div className="req-form-row">
                        <div className="req-form-group">
                            <label className="req-form-label">{t('public.phone')}</label>
                            <input className="req-form-input" name="phone" value={form.phone} onChange={handleChange} placeholder={t('public.phone_placeholder')} />
                            {errors.phone && <span className="req-form-error">{errors.phone[0]}</span>}
                        </div>
                        <div className="req-form-group">
                            <label className="req-form-label">{t('public.location')}</label>
                            <input className="req-form-input" name="location" value={form.location} onChange={handleChange} placeholder={t('public.location_placeholder')} required />
                            {errors.location && <span className="req-form-error">{errors.location[0]}</span>}
                        </div>
                    </div>

                    <div className="req-form-group">
                        <label className="req-form-label">{t('public.choir_name')}</label>
                        <input className="req-form-input" name="choir_name" value={form.choir_name} onChange={handleChange} required />
                        {errors.choir_name && <span className="req-form-error">{errors.choir_name[0]}</span>}
                    </div>

                    <div className="req-form-group">
                        <label className="req-form-label">{t('public.why_join')}</label>
                        <textarea className="req-form-textarea" name="motivation" value={form.motivation} onChange={handleChange} required minLength={20} />
                        <span className="req-form-help">{t('public.min_chars')}</span>
                        {errors.motivation && <span className="req-form-error">{errors.motivation[0]}</span>}
                    </div>

                    <div className="req-form-group">
                        <label className="req-form-label">{t('public.experience')}</label>
                        <textarea className="req-form-textarea" name="experience" value={form.experience} onChange={handleChange} placeholder={t('public.experience_placeholder')} />
                    </div>

                    <div className="req-form-actions">
                        <button type="button" className="req-btn ghost" onClick={() => router.visit('/become-choir-manager')}>{t('public.cancel')}</button>
                        <button type="submit" className="req-btn" disabled={submitting}>
                            {submitting ? t('public.submitting') : (<><FaPaperPlane /> {t('public.submit_request_btn')}</>)}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
