import { useState, useEffect } from 'react';
import MainLayout from '../../Layout/MainLayout';
import apiService from '../../Services/apiService';
import '../../../css/admin.css';
import useTranslation from '../../hooks/useTranslation';

export default function Dashboard() {
    const { t } = useTranslation();
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
                        <h1>{t('admin.admin_dashboard')}</h1>
                        <p>{t('admin.manage_platform')}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="admin-stats">
                        {[
                            { label: t('admin.total_users'), value: loading ? '—' : stats.total_users, icon: '👤', color: 'blue' },
                            { label: t('admin.listeners'), value: loading ? '—' : stats.total_listeners, icon: '🎧', color: 'green' },
                            { label: t('admin.choir_managers'), value: loading ? '—' : stats.total_choir_managers, icon: '', color: 'amber' },
                            { label: t('admin.premium_users'), value: loading ? '—' : stats.premium_users, icon: '💳', color: 'purple' },
                            { label: t('admin.total_choirs'), value: loading ? '—' : stats.total_choirs, icon: '', color: 'cyan' },
                            { label: t('admin.verified_choirs'), value: loading ? '—' : stats.verified_choirs, icon: '✓', color: 'emerald' },
                            { label: t('admin.pending_choirs'), value: loading ? '—' : stats.pending_choirs, icon: '⏳', color: 'orange' },
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
                        <h2>{t('admin.quick_actions')}</h2>
                        <div className="admin-action-buttons">
                            {[
                                { label: t('admin.manage_users'), href: '/admin/users' },
                                { label: t('admin.verify_choirs_action'), href: '/admin/choirs' },
                                { label: t('admin.view_reports'), href: '/admin/reports' },
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
