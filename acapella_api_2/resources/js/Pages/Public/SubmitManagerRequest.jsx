import { useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import apiService from '../../Services/apiService';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import '../../../css/requests.css';

export default function SubmitManagerRequest() {
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
                alert(err.response?.data?.message || 'Failed to submit. Please try again.');
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
                        <h1 style={{ fontSize: '1.8rem', marginBottom: 12 }}>Request Submitted!</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 18 }}>
                            Thank you. Our admins will review your request within 2-3 business days.
                            If approved, your login credentials will be sent to <strong>{form.email}</strong>.
                        </p>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem', marginBottom: 24 }}>
                            <strong>Tip:</strong> If you don&apos;t see the email in your inbox, please check your Spam or Junk folder.
                        </p>
                        <button onClick={() => router.visit('/welcome')} className="req-btn">Back Home</button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="req-page narrow">
                <div className="req-hero">
                    <span className="req-badge">Manager Application</span>
                    <h1>Tell us about <span className="gradient-text">your choir</span></h1>
                    <p>Fill in the details below. All fields marked with * are required.</p>
                </div>

                <form className="req-form-card" onSubmit={handleSubmit}>
                    <div className="req-form-row">
                        <div className="req-form-group">
                            <label className="req-form-label">Full Name *</label>
                            <input className="req-form-input" name="full_name" value={form.full_name} onChange={handleChange} required />
                            {errors.full_name && <span className="req-form-error">{errors.full_name[0]}</span>}
                        </div>
                        <div className="req-form-group">
                            <label className="req-form-label">Email *</label>
                            <input type="email" className="req-form-input" name="email" value={form.email} onChange={handleChange} required />
                            {errors.email && <span className="req-form-error">{errors.email[0]}</span>}
                        </div>
                    </div>

                    <div className="req-form-row">
                        <div className="req-form-group">
                            <label className="req-form-label">Phone</label>
                            <input className="req-form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+255..." />
                            {errors.phone && <span className="req-form-error">{errors.phone[0]}</span>}
                        </div>
                        <div className="req-form-group">
                            <label className="req-form-label">Location *</label>
                            <input className="req-form-input" name="location" value={form.location} onChange={handleChange} placeholder="Dar-es-Salaam" required />
                            {errors.location && <span className="req-form-error">{errors.location[0]}</span>}
                        </div>
                    </div>

                    <div className="req-form-group">
                        <label className="req-form-label">Choir Name *</label>
                        <input className="req-form-input" name="choir_name" value={form.choir_name} onChange={handleChange} required />
                        {errors.choir_name && <span className="req-form-error">{errors.choir_name[0]}</span>}
                    </div>

                    <div className="req-form-group">
                        <label className="req-form-label">Why do you want to join? *</label>
                        <textarea className="req-form-textarea" name="motivation" value={form.motivation} onChange={handleChange} required minLength={20} />
                        <span className="req-form-help">Minimum 20 characters.</span>
                        {errors.motivation && <span className="req-form-error">{errors.motivation[0]}</span>}
                    </div>

                    <div className="req-form-group">
                        <label className="req-form-label">Experience (optional)</label>
                        <textarea className="req-form-textarea" name="experience" value={form.experience} onChange={handleChange} placeholder="Past performances, recordings, leadership roles..." />
                    </div>

                    <div className="req-form-actions">
                        <button type="button" className="req-btn ghost" onClick={() => router.visit('/become-choir-manager')}>Cancel</button>
                        <button type="submit" className="req-btn" disabled={submitting}>
                            {submitting ? 'Submitting…' : (<><FaPaperPlane /> Submit Request</>)}
                        </button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
