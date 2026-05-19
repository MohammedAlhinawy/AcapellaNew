import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import apiService from '../../Services/apiService';
import { FaCheck, FaTimes, FaArrowLeft, FaTrash } from 'react-icons/fa';
import CustomAlertDialog from '../../Components/CustomAlertDialog';
import { toast } from '../../Components/ToastContainer';
import '../../../css/requests.css';
import useTranslation from '../../hooks/useTranslation';

export default function RequestView({ requestId }) {
    const { t } = useTranslation();
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
                title: t('admin.approve_request'),
                message: t('admin.sure_approve_request'),
                onConfirm: () => doUpdateStatus(status),
                type: 'primary'
            });
        } else if (status === 'rejected') {
            setAlertConfig({
                isOpen: true,
                title: t('admin.reject_request'),
                message: t('admin.sure_reject_request'),
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
            toast.success(res.data?.message || t('admin.status_updated_success.'));
            router.visit('/admin/manager-requests');
        } catch (e) {
            toast.error(e.response?.data?.message || t('admin.failed_update_status'));
        } finally {
            setUpdating(false);
        }
    };

    const removeRequest = () => {
        setAlertConfig({
            isOpen: true,
            title: t('admin.delete_request'),
            message: t('admin.sure_delete_request'),
            onConfirm: doRemoveRequest,
            type: 'danger'
        });
    };

    const doRemoveRequest = async () => {
        try {
            await apiService.delete(`/admin/manager-requests/${requestId}`);
            toast.success(t('admin.request_deleted_success.'));
            router.visit('/admin/manager-requests');
        } catch {
            toast.error(t('admin.delete_failed'));
        }
    };

    const closeAlert = () => {
        setAlertConfig({ ...alertConfig, isOpen: false });
    };

    if (loading) return <MainLayout><div className="req-page"><div className="req-empty">{t('admin.loading')}</div></div></MainLayout>;
    if (!req) return <MainLayout><div className="req-page"><div className="req-empty">{t('admin.request_not_found')}</div></div></MainLayout>;

    return (
        <MainLayout>
            <div className="req-page">
                <button className="req-btn ghost" onClick={() => router.visit('/admin/manager-requests')} style={{ marginBottom: 20 }}>
                    <FaArrowLeft /> {t('admin.back')}
                </button>

                <div className="req-detail-grid">
                    <div className="req-detail-card">
                        <h2 style={{ marginBottom: 4 }}>{req.full_name}</h2>
                        <p style={{ color: 'var(--text-tertiary)', marginBottom: 24 }}>
                            {t('admin.submitted')} {new Date(req.created_at).toLocaleString()}
                        </p>

                        <div className="req-detail-row"><span className="label">{t('admin.choir_name')}</span><span className="value">{req.choir_name}</span></div>
                        <div className="req-detail-row"><span className="label">{t('admin.email')}</span><span className="value">{req.email}</span></div>
                        <div className="req-detail-row"><span className="label">{t('admin.phone')}</span><span className="value">{req.phone || '—'}</span></div>
                        <div className="req-detail-row"><span className="label">{t('admin.location')}</span><span className="value">{req.location}</span></div>

                        <h3 style={{ marginTop: 28, marginBottom: 8, fontSize: '1rem' }}>{t('admin.motivation')}</h3>
                        <div className="req-prose">{req.motivation}</div>

                        {req.experience && (
                            <>
                                <h3 style={{ marginTop: 24, marginBottom: 8, fontSize: '1rem' }}>{t('admin.experience')}</h3>
                                <div className="req-prose">{req.experience}</div>
                            </>
                        )}
                    </div>

                    <div className="req-detail-card">
                        <h3 style={{ marginBottom: 12, fontSize: '1.05rem' }}>{t('admin.status')}</h3>
                        <span className={`req-status ${req.status}`}>{req.status}</span>

                        {req.reviewed_at && (
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: 12 }}>
                                {t('admin.reviewed')} {new Date(req.reviewed_at).toLocaleString()}
                                {req.reviewer && <> {t('admin.by')} {req.reviewer.name}</>}
                            </p>
                        )}

                        <div className="req-form-group" style={{ marginTop: 20 }}>
                            <label className="req-form-label">{t('admin.admin_notes')}</label>
                            <textarea
                                className="req-form-textarea"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder={t('admin.internal_notes_optional')}
                            />
                        </div>

                        {req.status !== 'approved' && (
                            <button className="req-btn success" disabled={updating} onClick={() => updateStatus('approved')} style={{ width: '100%', marginBottom: 8, justifyContent: 'center' }}>
                                <FaCheck /> {t('admin.approve_create_account')}
                            </button>
                        )}
                        {req.status !== 'rejected' && req.status !== 'approved' && (
                            <button className="req-btn danger" disabled={updating} onClick={() => updateStatus('rejected')} style={{ width: '100%', marginBottom: 8, justifyContent: 'center' }}>
                                <FaTimes /> {t('admin.reject_request')}
                            </button>
                        )}
                        {req.status !== 'pending' && req.status !== 'approved' && (
                            <button className="req-btn ghost" disabled={updating} onClick={() => updateStatus('pending')} style={{ width: '100%', marginBottom: 8, justifyContent: 'center' }}>
                                {t('admin.mark_pending')}
                            </button>
                        )}
                        <button className="req-btn ghost" onClick={removeRequest} style={{ width: '100%', justifyContent: 'center', color: 'var(--error)' }}>
                            <FaTrash /> {t('admin.delete_request')}
                        </button>

                        {req.created_user && (
                            <div style={{ marginTop: 20, padding: 14, background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                                ✓ {t('admin.account_created')} <strong>{req.created_user.email}</strong>
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
                confirmText={alertConfig.type === 'danger' ? t('admin.delete') : (alertConfig.title.includes('Approve') ? t('admin.approve_request') : t('admin.confirm'))}
                cancelText={t('common.cancel')}
                type={alertConfig.type}
            />
        </MainLayout>
    );
}

RequestView.propTypes = {
    requestId: PropTypes.string.isRequired,
};
