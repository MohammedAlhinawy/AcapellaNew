import { useState, useEffect } from 'react';
import MainLayout from '../../Layout/MainLayout';
import apiService from '../../Services/apiService';
import '../../../css/admin.css';

export default function Dashboard() {
    const [stats, setStats] = useState({
        total_users: 0,
        verified_choirs: 0,
        total_tracks: 0,
        active_subscriptions: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiService.get('/admin/dashboard');
                setStats(response.data.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <MainLayout>
            <div className="admin-page">
                <div className="admin-container">
                    <div className="admin-header">
                        <h1>Admin Dashboard</h1>
                        <p>Manage your Acapella platform</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="admin-stats">
                        {[
                            { label: 'Total Users', value: loading ? '—' : stats.total_users, icon: '👤', color: 'blue' },
                            { label: 'Listeners', value: loading ? '—' : stats.total_listeners, icon: '🎧', color: 'green' },
                            { label: 'Choir Managers', value: loading ? '—' : stats.total_choir_managers, icon: '�', color: 'amber' },
                            { label: 'Premium Users', value: loading ? '—' : stats.premium_users, icon: '💳', color: 'purple' },
                            { label: 'Total Choirs', value: loading ? '—' : stats.total_choirs, icon: '�', color: 'cyan' },
                            { label: 'Verified Choirs', value: loading ? '—' : stats.verified_choirs, icon: '✓', color: 'emerald' },
                            { label: 'Pending Choirs', value: loading ? '—' : stats.pending_choirs, icon: '⏳', color: 'orange' },
                        ].map((stat) => (
                            <div key={stat.label} className="admin-stat-card">
                                <span className="admin-stat-icon">{stat.icon}</span>
                                <div>
                                    <div className={`admin-stat-value ${stat.color}`}>{stat.value}</div>
                                    <div className="admin-stat-label">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="admin-quick-actions">
                        <h2>Quick Actions</h2>
                        <div className="admin-action-buttons">
                            {[
                                { label: 'Manage Users', href: '/admin/users' },
                                { label: 'Verify Choirs', href: '/admin/choirs' },
                                { label: 'View Reports', href: '/admin/reports' },
                            ].map((action) => (
                                <a
                                    key={action.href}
                                    href={action.href}
                                    className="admin-action-button"
                                >
                                    {action.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
