import { useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import apiService from '../../Services/apiService';
import { toast } from '../../Components/ToastContainer';
import { FaPaperPlane, FaStar } from 'react-icons/fa';
import '../../../css/feedback.css';

const CATEGORIES = [
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'general', label: 'General' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'praise', label: 'Praise' },
];

export default function SubmitFeedback() {
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
            toast.success('Thanks! Your feedback was submitted successfully.');
            setForm({ category: 'general', subject: '', message: '', rating: 0 });
            router.visit('/');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
                toast.error('Please check the form and try again.');
            } else if (err.response?.status === 401) {
                toast.error('Please log in to submit feedback.');
                router.visit('/login');
            } else {
                toast.error(err.response?.data?.message || 'Failed to submit. Try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <div className="fb-page narrow">
                <div className="fb-hero">
                    <h1>Share Your <span className="gradient-text">Feedback</span></h1>
                    <p>Help us improve Acapella. We read every message.</p>
                </div>

                <form className="fb-card" onSubmit={handleSubmit}>
                    <div className="fb-form-group">
                        <label className="fb-label">Category</label>
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
                        <label className="fb-label">Subject *</label>
                        <input className="fb-input" name="subject" value={form.subject} onChange={handleChange} maxLength={200} required />
                        {errors.subject && <span className="fb-error" style={{ padding: 0, background: 'transparent', border: 'none' }}>{errors.subject[0]}</span>}
                    </div>

                    <div className="fb-form-group">
                        <label className="fb-label">Message *</label>
                        <textarea className="fb-textarea" name="message" value={form.message} onChange={handleChange} minLength={10} required />
                        {errors.message && <span className="fb-error" style={{ padding: 0, background: 'transparent', border: 'none' }}>{errors.message[0]}</span>}
                    </div>

                    <div className="fb-form-group">
                        <label className="fb-label">Rating (optional)</label>
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
                        <button type="button" className="fb-btn ghost" onClick={() => window.history.back()}>Cancel</button>
                        <button type="submit" className="fb-btn" disabled={submitting}>
                            {submitting ? 'Sending…' : (<><FaPaperPlane /> Send Feedback</>)}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
