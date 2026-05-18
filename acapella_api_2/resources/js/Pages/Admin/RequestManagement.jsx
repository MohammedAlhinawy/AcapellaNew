import { useEffect, useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import apiService from '../../Services/apiService';
import { FaEye } from 'react-icons/fa';
import '../../../css/requests.css';

export default function RequestManagement() {
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
                    <h1 style={{ fontSize: '2rem' }}>Manager Requests</h1>
                    <p>Review applications from prospective choir managers.</p>
                </div>

                <div className="req-toolbar">
                    <input
                        className="req-form-input"
                        placeholder="Search by name, email or choir…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select className="req-form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {loading ? (
                    <div className="req-empty">Loading…</div>
                ) : filtered.length === 0 ? (
                    <div className="req-empty">No requests found.</div>
                ) : (
                    <table className="req-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Choir</th>
                                <th className="hide-mobile">Email</th>
                                <th className="hide-mobile">Location</th>
                                <th>Status</th>
                                <th>Actions</th>
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
