import { useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import apiService from '../../Services/apiService';
import { toast } from '../../Components/ToastContainer';
import { FaPaperPlane, FaStar } from 'react-icons/fa';
import '../../../css/feedback.css';
import useTranslation from '../../hooks/useTranslation';

export default function SubmitFeedback() {
    const { t } = useTranslation();
    const CATEGORIES = [
        { value: 'bug', label: t('feedback.category_bug') },
        { value: 'feature', label: t('feedback.category_feature') },
        { value: 'general', label: t('feedback.category_general') },
        { value: 'complaint', label: t('feedback.category_complaint') },
        { value: 'praise', label: t('feedback.category_praise') },
    ];
    const [form, setForm] = useState({
        category: 'general',
        subject: '',
        message: '',
        rating: 0,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            const payload = { ...form };
            if (!payload.rating) delete payload.rating;
            await apiService.post('/feedbacks', payload);
            toast.success(t('feedback.success'));
            setForm({ category: 'general', subject: '', message: '', rating: 0 });
            router.visit('/');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
                toast.error(t('feedback.check_form'));
            } else if (err.response?.status === 401) {
                toast.error(t('feedback.login_required'));
                router.visit('/login');
            } else {
                toast.error(err.response?.data?.message || t('feedback.failed'));
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <div className="fb-page narrow">
                <div className="fb-hero">
                    <h1>{t('feedback.title')} <span className="gradient-text">{t('feedback.title').split(' ').pop()}</span></h1>
                    <p>{t('feedback.subtitle')}</p>
                </div>

                <form className="fb-card" onSubmit={handleSubmit}>
                    <div className="fb-form-group">
                        <label className="fb-label">{t('feedback.category')}</label>
                        <div className="fb-pills">
                            {CATEGORIES.map(c => (
                                <button
                                    type="button"
                                    key={c.value}
                                    className={`fb-pill ${form.category === c.value ? 'active' : ''}`}
                                    onClick={() => setForm({ ...form, category: c.value })}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="fb-form-group">
                        <label className="fb-label">{t('feedback.subject')} *</label>
                        <input className="fb-input" name="subject" value={form.subject} onChange={handleChange} maxLength={200} required />
                        {errors.subject && <span className="fb-error" style={{ padding: 0, background: 'transparent', border: 'none' }}>{errors.subject[0]}</span>}
                    </div>

                    <div className="fb-form-group">
                        <label className="fb-label">{t('feedback.message')} *</label>
                        <textarea className="fb-textarea" name="message" value={form.message} onChange={handleChange} minLength={10} required />
                        {errors.message && <span className="fb-error" style={{ padding: 0, background: 'transparent', border: 'none' }}>{errors.message[0]}</span>}
                    </div>

                    <div className="fb-form-group">
                        <label className="fb-label">{t('feedback.rating')}</label>
                        <div className="fb-rating">
                            {[1, 2, 3, 4, 5].map(n => (
                                <button
                                    type="button"
                                    key={n}
                                    className={`fb-star ${form.rating >= n ? 'filled' : ''}`}
                                    onClick={() => setForm({ ...form, rating: form.rating === n ? 0 : n })}
                                    aria-label={`${n} star${n > 1 ? 's' : ''}`}
                                >
                                    <FaStar />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="fb-actions">
                        <button type="button" className="fb-btn ghost" onClick={() => window.history.back()}>{t('feedback.cancel')}</button>
                        <button type="submit" className="fb-btn" disabled={submitting}>
                            {submitting ? t('feedback.sending') : (<><FaPaperPlane /> {t('feedback.send')}</>)}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
