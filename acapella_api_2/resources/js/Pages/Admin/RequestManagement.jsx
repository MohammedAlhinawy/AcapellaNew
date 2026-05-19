import { useEffect, useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import apiService from '../../Services/apiService';
import { FaEye } from 'react-icons/fa';
import '../../../css/requests.css';
import useTranslation from '../../hooks/useTranslation';

export default function RequestManagement() {
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');

    const load = async () => {
        setLoading(true);
        try {
            const url = statusFilter ? `/admin/manager-requests?status=${statusFilter}` : '/admin/manager-requests';
            const res = await apiService.get(url);
            setRequests(res.data?.data?.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

    const filtered = requests.filter(r => {
        if (!search) return true;
        const q = search.toLowerCase();
        return r.full_name.toLowerCase().includes(q)
            || r.email.toLowerCase().includes(q)
            || r.choir_name.toLowerCase().includes(q);
    });

    return (
        <MainLayout>
            <div className="req-page">
                <div className="req-hero" style={{ textAlign: 'left', marginBottom: 24 }}>
                    <h1 style={{ fontSize: '2rem' }}>{t('admin.manager_requests')}</h1>
                    <p>{t('admin.review_applications')}</p>
                </div>

                <div className="req-toolbar">
                    <input
                        className="req-form-input"
                        placeholder={t('admin.search_name_email_choir')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select className="req-form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">{t('admin.all_statuses')}</option>
                        <option value="pending">{t('admin.pending')}</option>
                        <option value="approved">{t('admin.approved')}</option>
                        <option value="rejected">{t('admin.rejected')}</option>
                    </select>
                </div>

                {loading ? (
                    <div className="req-empty">{t('admin.loading')}</div>
                ) : filtered.length === 0 ? (
                    <div className="req-empty">{t('admin.no_requests_found')}</div>
                ) : (
                    <table className="req-table">
                        <thead>
                            <tr>
                                <th>{t('admin.name')}</th>
                                <th>{t('admin.choir')}</th>
                                <th className="hide-mobile">{t('admin.email')}</th>
                                <th className="hide-mobile">{t('admin.location')}</th>
                                <th>{t('admin.status')}</th>
                                <th>{t('admin.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(r => (
                                <tr key={r.id}>
                                    <td>{r.full_name}</td>
                                    <td>{r.choir_name}</td>
                                    <td className="hide-mobile">{r.email}</td>
                                    <td className="hide-mobile">{r.location}</td>
                                    <td><span className={`req-status ${r.status}`}>{r.status}</span></td>
                                    <td>
                                        <button
                                            className="req-btn ghost"
                                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                            onClick={() => router.visit(`/admin/manager-requests/${r.id}`)}
                                        >
                                            <FaEye /> {t('admin.view')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </MainLayout>
    );
}
