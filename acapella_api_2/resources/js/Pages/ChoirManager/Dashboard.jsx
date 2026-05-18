import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import MainLayout from '../../Layout/MainLayout';
import managerService from '../../Services/managerService';
import '../../../css/manager.css';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalAlbums: 0,
        totalTracks: 0,
        subscribers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const choirs = await managerService.getMyChoirs();
                const choirsArray = Array.isArray(choirs) ? choirs : [];
                let totalAlbums = 0;
                let totalTracks = 0;
                let subscribers = 0;

                for (const choir of choirsArray) {
                    const albums = await managerService.getMyAlbums(choir.id);
                    const albumsArray = Array.isArray(albums) ? albums : [];
                    totalAlbums += albumsArray.length;

                    for (const album of albumsArray) {
                        const tracks = await managerService.getMyTracks(album.id);
                        const tracksArray = Array.isArray(tracks) ? tracks : [];
                        totalTracks += tracksArray.length;
                    }

                    subscribers += choir.subscriber_count || 0;
                }

                setStats({
                    totalAlbums,
                    totalTracks,
                    subscribers,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <MainLayout>
            <div className="manager-page">
                <div className="manager-container">
                    <div className="manager-header">
                        <h1>Choir Manager Dashboard</h1>
                        <p>Manage your choir, albums, and tracks</p>
                    </div>

                    {/* Stats */}
                    <div className="manager-stats">
                        {[
                            { label: 'Total Albums', value: loading ? '—' : stats.totalAlbums, icon: '💿', color: 'blue' },
                            { label: 'Total Tracks', value: loading ? '—' : stats.totalTracks, icon: '🎵', color: 'green' },
                            { label: 'Subscribers', value: loading ? '—' : stats.subscribers, icon: '👥', color: 'amber' },
                        ].map((stat) => (
                            <div key={stat.label} className="manager-stat-card">
                                <span className="manager-stat-icon">{stat.icon}</span>
                                <div>
                                    <div className={`manager-stat-value ${stat.color}`}>{stat.value}</div>
                                    <div className="manager-stat-label">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="manager-quick-actions">
                        <h2>Quick Actions</h2>
                        <div className="manager-action-buttons">
                            {[
                                { label: 'Upload Track', href: '/manager/choirs' },
                                { label: 'Create Album', href: '/manager/choirs' },
                                { label: 'Edit Choir Profile', href: '/manager/profile' },
                            ].map((action, index) => (
                                <Link
                                    key={`${action.href}-${index}`}
                                    href={action.href}
                                    className="manager-action-button"
                                >
                                    {action.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
