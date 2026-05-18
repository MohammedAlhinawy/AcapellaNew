import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import apiService from '../../Services/apiService';
import { FaArrowLeft, FaStar, FaTrash, FaPaperPlane } from 'react-icons/fa';
import { toast } from '../../Components/ToastContainer';
import '../../../css/feedback.css';

const STATUSES = [
    { value: 'new', label: 'New' },
    { value: 'in_review', label: 'In Review' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
];

export default function FeedbackView({ feedbackId }) {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('new');
    const [response, setResponse] = useState('');
    const [updating, setUpdating] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await apiService.get(`/admin/feedbacks/${feedbackId}`);
            const data = res.data?.data;
            setItem(data);
            setStatus(data?.status || 'new');
        } catch (_error) { // Renamed error to _error
            console.error(_error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [feedbackId]); // eslint-disable-line react-hooks/exhaustive-deps

    const update = async () => {
        setUpdating(true);
        try {
            const res = await apiService.put(`/admin/feedbacks/${feedbackId}`, {
                status,
                admin_response: response,
            });
            setItem(res.data?.data);
            toast.success('Feedback updated successfully.');
            router.visit('/admin/feedbacks');
        } catch (e) {
            toast.error(e.response?.data?.message || 'Update failed.');
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = async () => {
        if (!confirm('Permanently delete this feedback?')) return;
        try {
            await apiService.delete(`/admin/feedbacks/${feedbackId}`);
            toast.success('Feedback deleted successfully.');
            router.visit('/admin/feedbacks');
        } catch {
            toast.error('Delete failed. Please try again.');
        }
    };

    if (loading) return <MainLayout><div className="fb-page"><div className="fb-empty">Loading…</div></div></MainLayout>;
    if (!item) return <MainLayout><div className="fb-page"><div className="fb-empty">Feedback not found.</div></div></MainLayout>;

    return (
        <MainLayout>
            <div className="fb-page">
                <button className="fb-btn ghost" onClick={() => router.visit('/admin/feedbacks')} style={{ marginBottom: 20 }}>
                    <FaArrowLeft /> Back
                </button>

                <div className="fb-detail-grid">
                    <div className="fb-detail-card">
                        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                            <span className="fb-category">{item.category}</span>
                            <span className={`fb-status ${item.status}`}>{item.status.replace('_', ' ')}</span>
                        </div>
                        <h2 style={{ marginBottom: 8 }}>{item.subject}</h2>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: 20 }}>
                            From <strong>{item.user?.name}</strong> ({item.user?.email}) · {new Date(item.created_at).toLocaleString()}
                        </p>

                        {item.rating > 0 && (
                            <div style={{ display: 'flex', gap: 4, marginBottom: 16, color: 'var(--warning)' }}>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} style={{ opacity: i < item.rating ? 1 : 0.25 }} />
                                ))}
                            </div>
                        )}

                        <div className="fb-prose">{item.message}</div>

                        {item.admin_response && (
                            <>
                                <h3 style={{ marginTop: 28, marginBottom: 8, fontSize: '1rem' }}>Admin Response</h3>
                                <div className="fb-prose">{item.admin_response}</div>
                                {item.responded_at && (
                                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginTop: 6 }}>
                                        Responded {new Date(item.responded_at).toLocaleString()}
                                        {item.responder && <> by {item.responder.name}</>}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    <div className="fb-detail-card">
                        <h3 style={{ marginBottom: 14, fontSize: '1.05rem' }}>Manage</h3>

                        <div className="fb-form-group">
                            <label className="fb-label">Status</label>
                            <select className="fb-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>

                        <div className="fb-form-group">
                            <label className="fb-label">Response</label>
                            <textarea
                                className="fb-textarea"
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                placeholder="Reply to the user (optional)…"
                            />
                        </div>

                        <button className="fb-btn" disabled={updating} onClick={update} style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}>
                            <FaPaperPlane /> {updating ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button className="fb-btn ghost" onClick={removeItem} style={{ width: '100%', justifyContent: 'center', color: 'var(--error)' }}>
                            <FaTrash /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

FeedbackView.propTypes = {
    feedbackId: PropTypes.string.isRequired,
};
