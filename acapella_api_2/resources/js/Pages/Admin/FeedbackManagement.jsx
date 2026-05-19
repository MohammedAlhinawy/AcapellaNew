import { useEffect, useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import apiService from '../../Services/apiService';
import { FaEye, FaStar } from 'react-icons/fa';
import '../../../css/feedback.css';
import useTranslation from '../../hooks/useTranslation';

export default function FeedbackManagement() {
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [search, setSearch] = useState('');

    const load = async () => {
        setLoading(true);
        try {
            const qs = new URLSearchParams();
            if (statusFilter) qs.set('status', statusFilter);
            if (categoryFilter) qs.set('category', categoryFilter);
            const url = `/admin/feedbacks${qs.toString() ? '?' + qs.toString() : ''}`;
            const res = await apiService.get(url);
            setItems(res.data?.data?.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [statusFilter, categoryFilter]); // eslint-disable-line react-hooks/exhaustive-deps

    const filtered = items.filter(f => {
        if (!search) return true;
        const q = search.toLowerCase();
        return f.subject.toLowerCase().includes(q)
            || f.user?.name?.toLowerCase().includes(q)
            || f.user?.email?.toLowerCase().includes(q);
    });

    return (
        <MainLayout>
            <div className="fb-page">
                <div className="fb-hero" style={{ textAlign: 'left', marginBottom: 24 }}>
                    <h1 style={{ fontSize: '2rem' }}>{t('admin.feedback_management')}</h1>
                    <p>{t('admin.review_respond_feedback')}</p>
                </div>

                <div className="fb-toolbar">
                    <input className="fb-input" placeholder={t('admin.search_subject_user')} value={search} onChange={(e) => setSearch(e.target.value)} />
                    <select className="fb-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">{t('admin.all_statuses')}</option>
                        <option value="new">{t('admin.new')}</option>
                        <option value="in_review">{t('admin.in_review')}</option>
                        <option value="resolved">{t('admin.resolved')}</option>
                        <option value="closed">{t('admin.closed')}</option>
                    </select>
                    <select className="fb-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="">{t('admin.all_categories')}</option>
                        <option value="bug">{t('admin.bug')}</option>
                        <option value="feature">{t('admin.feature')}</option>
                        <option value="general">{t('admin.general')}</option>
                        <option value="complaint">{t('admin.complaint')}</option>
                        <option value="praise">{t('admin.praise')}</option>
                    </select>
                </div>

                {loading ? (
                    <div className="fb-empty">{t('admin.loading')}</div>
                ) : filtered.length === 0 ? (
                    <div className="fb-empty">{t('admin.no_feedback_found')}</div>
                ) : (
                    <table className="fb-table">
                        <thead>
                            <tr>
                                <th>{t('admin.subject')}</th>
                                <th className="hide-mobile">{t('admin.user')}</th>
                                <th>{t('admin.category')}</th>
                                <th className="hide-mobile">{t('admin.rating')}</th>
                                <th>{t('admin.status')}</th>
                                <th>{t('admin.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(f => (
                                <tr key={f.id}>
                                    <td>{f.subject}</td>
                                    <td className="hide-mobile">{f.user?.name || '—'}</td>
                                    <td><span className="fb-category">{f.category}</span></td>
                                    <td className="hide-mobile">
                                        {f.rating ? (<><FaStar style={{ color: 'var(--warning)' }} /> {f.rating}</>) : '—'}
                                    </td>
                                    <td><span className={`fb-status ${f.status}`}>{f.status.replace('_', ' ')}</span></td>
                                    <td>
                                        <button
                                            className="fb-btn ghost"
                                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                            onClick={() => router.visit(`/admin/feedbacks/${f.id}`)}
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
