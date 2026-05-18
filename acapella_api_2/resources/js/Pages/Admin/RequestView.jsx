import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import apiService from '../../Services/apiService';
import { FaCheck, FaTimes, FaArrowLeft, FaTrash } from 'react-icons/fa';
import CustomAlertDialog from '../../Components/CustomAlertDialog';
import { toast } from '../../Components/ToastContainer';
import '../../../css/requests.css';

export default function RequestView({ requestId }) {
    const [req, setReq] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adminNotes, setAdminNotes] = useState('');
    const [updating, setUpdating] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });

    const load = async () => {
        setLoading(true);
        try {
            const res = await apiService.get(`/admin/manager-requests/${requestId}`);
            const data = res.data?.data;
            setReq(data);
            setAdminNotes(data?.admin_notes || '');
        } catch (_error) {
            console.error(_error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [requestId]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateStatus = (status) => {
        if (status === 'approved') {
            setAlertConfig({
                isOpen: true,
                title: 'Approve Request',
                message: 'Are you sure you want to approve this request? An account will be created and credentials will be emailed to the applicant.',
                onConfirm: () => doUpdateStatus(status),
                type: 'primary'
            });
        } else if (status === 'rejected') {
            setAlertConfig({
                isOpen: true,
                title: 'Reject Request',
                message: 'Are you sure you want to reject this request?',
                onConfirm: () => doUpdateStatus(status),
                type: 'danger'
            });
        } else {
            doUpdateStatus(status);
        }
    };

    const doUpdateStatus = async (status) => {
        setUpdating(true);
        try {
            const res = await apiService.put(`/admin/manager-requests/${requestId}`, {
                status,
                admin_notes: adminNotes,
            });
            setReq(res.data?.data);
            toast.success(res.data?.message || 'Status updated successfully.');
            router.visit('/admin/manager-requests');
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to update status.');
        } finally {
            setUpdating(false);
        }
    };

    const removeRequest = () => {
        setAlertConfig({
            isOpen: true,
            title: 'Delete Request',
            message: 'Are you sure you want to permanently delete this request? This action cannot be undone.',
            onConfirm: doRemoveRequest,
            type: 'danger'
        });
    };

    const doRemoveRequest = async () => {
        try {
            await apiService.delete(`/admin/manager-requests/${requestId}`);
            toast.success('Request deleted successfully.');
            router.visit('/admin/manager-requests');
        } catch {
            toast.error('Delete failed. Please try again.');
        }
    };

    const closeAlert = () => {
        setAlertConfig({ ...alertConfig, isOpen: false });
    };

    if (loading) return <MainLayout><div className="req-page"><div className="req-empty">Loading…</div></div></MainLayout>;
    if (!req) return <MainLayout><div className="req-page"><div className="req-empty">Request not found.</div></div></MainLayout>;

    return (
        <MainLayout>
            <div className="req-page">
                <button className="req-btn ghost" onClick={() => router.visit('/admin/manager-requests')} style={{ marginBottom: 20 }}>
                    <FaArrowLeft /> Back
                </button>

                <div className="req-detail-grid">
                    <div className="req-detail-card">
                        <h2 style={{ marginBottom: 4 }}>{req.full_name}</h2>
                        <p style={{ color: 'var(--text-tertiary)', marginBottom: 24 }}>
                            Submitted {new Date(req.created_at).toLocaleString()}
                        </p>

                        <div className="req-detail-row"><span className="label">Choir Name</span><span className="value">{req.choir_name}</span></div>
                        <div className="req-detail-row"><span className="label">Email</span><span className="value">{req.email}</span></div>
                        <div className="req-detail-row"><span className="label">Phone</span><span className="value">{req.phone || '—'}</span></div>
                        <div className="req-detail-row"><span className="label">Location</span><span className="value">{req.location}</span></div>

                        <h3 style={{ marginTop: 28, marginBottom: 8, fontSize: '1rem' }}>Motivation</h3>
                        <div className="req-prose">{req.motivation}</div>

                        {req.experience && (
                            <>
                                <h3 style={{ marginTop: 24, marginBottom: 8, fontSize: '1rem' }}>Experience</h3>
                                <div className="req-prose">{req.experience}</div>
                            </>
                        )}
                    </div>

                    <div className="req-detail-card">
                        <h3 style={{ marginBottom: 12, fontSize: '1.05rem' }}>Status</h3>
                        <span className={`req-status ${req.status}`}>{req.status}</span>

                        {req.reviewed_at && (
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: 12 }}>
                                Reviewed {new Date(req.reviewed_at).toLocaleString()}
                                {req.reviewer && <> by {req.reviewer.name}</>}
                            </p>
                        )}

                        <div className="req-form-group" style={{ marginTop: 20 }}>
                            <label className="req-form-label">Admin Notes</label>
                            <textarea
                                className="req-form-textarea"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Internal notes (optional)…"
                            />
                        </div>

                        {req.status !== 'approved' && (
                            <button className="req-btn success" disabled={updating} onClick={() => updateStatus('approved')} style={{ width: '100%', marginBottom: 8, justifyContent: 'center' }}>
                                <FaCheck /> Approve & Create Account
                            </button>
                        )}
                        {req.status !== 'rejected' && req.status !== 'approved' && (
                            <button className="req-btn danger" disabled={updating} onClick={() => updateStatus('rejected')} style={{ width: '100%', marginBottom: 8, justifyContent: 'center' }}>
                                <FaTimes /> Reject
                            </button>
                        )}
                        {req.status !== 'pending' && req.status !== 'approved' && (
                            <button className="req-btn ghost" disabled={updating} onClick={() => updateStatus('pending')} style={{ width: '100%', marginBottom: 8, justifyContent: 'center' }}>
                                Mark Pending
                            </button>
                        )}
                        <button className="req-btn ghost" onClick={removeRequest} style={{ width: '100%', justifyContent: 'center', color: 'var(--error)' }}>
                            <FaTrash /> Delete Request
                        </button>

                        {req.created_user && (
                            <div style={{ marginTop: 20, padding: 14, background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                                ✓ Account created: <strong>{req.created_user.email}</strong>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CustomAlertDialog
                isOpen={alertConfig.isOpen}
                onClose={closeAlert}
                onConfirm={alertConfig.onConfirm}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText={alertConfig.type === 'danger' ? 'Delete' : (alertConfig.title.includes('Approve') ? 'Approve' : 'Confirm')}
                cancelText="Cancel"
                type={alertConfig.type}
            />
        </MainLayout>
    );
}

RequestView.propTypes = {
    requestId: PropTypes.string.isRequired,
};
