import { useEffect, useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import apiService from '../../Services/apiService';
import { FaEye, FaStar } from 'react-icons/fa';
import '../../../css/feedback.css';

export default function FeedbackManagement() {
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
                    <h1 style={{ fontSize: '2rem' }}>Feedback Management</h1>
                    <p>Review and respond to user feedback.</p>
                </div>

                <div className="fb-toolbar">
                    <input className="fb-input" placeholder="Search subject or user…" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <select className="fb-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All statuses</option>
                        <option value="new">New</option>
                        <option value="in_review">In Review</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                    <select className="fb-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="">All categories</option>
                        <option value="bug">Bug</option>
                        <option value="feature">Feature</option>
                        <option value="general">General</option>
                        <option value="complaint">Complaint</option>
                        <option value="praise">Praise</option>
                    </select>
                </div>

                {loading ? (
                    <div className="fb-empty">Loading…</div>
                ) : filtered.length === 0 ? (
                    <div className="fb-empty">No feedback found.</div>
                ) : (
                    <table className="fb-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th className="hide-mobile">User</th>
                                <th>Category</th>
                                <th className="hide-mobile">Rating</th>
                                <th>Status</th>
                                <th>Actions</th>
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
                                            <FaEye /> View
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
