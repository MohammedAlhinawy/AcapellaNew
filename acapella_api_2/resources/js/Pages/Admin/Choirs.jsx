import { useState, useEffect } from 'react';
import MainLayout from '../../Layout/MainLayout';
import apiService from '../../Services/apiService';
import '../../../css/dialog.css';
import '../../../css/admin.css';

export default function AdminChoirs() {
    const [choirs, setChoirs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChoir, setSelectedChoir] = useState(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchChoirs = async () => {
            try {
                const response = await apiService.get('/choirs');
                // Handle paginated response structure
                setChoirs(response.data.data?.data || []);
            } catch {
                setChoirs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChoirs();
    }, []);

    const toggleVerification = async (choirId, isVerified) => {
        try {
            const endpoint = isVerified ? `/admin/choirs/${choirId}/unverify` : `/admin/choirs/${choirId}/verify`;
            await apiService.post(endpoint);
            // Refresh choirs list
            const response = await apiService.get('/choirs');
            setChoirs(response.data.data?.data || []);
        } catch {
            alert('Failed to update choir verification status');
        }
    };

    const handleViewDetails = (choir) => {
        setSelectedChoir(choir);
        setIsDetailsDialogOpen(true);
    };

    const handleCloseDetailsDialog = () => {
        setSelectedChoir(null);
        setIsDetailsDialogOpen(false);
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="admin-page">
                    <div className="admin-container">
                        <div className="admin-header">
                            <h1>Choir Verification Center</h1>
                            <p>Loading...</p>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="admin-page">
                <div className="admin-container">
                    <div className="admin-header">
                        <h1>Choir Verification Center</h1>
                        <p>Review and verify choir profiles on the platform</p>
                    </div>

                    {/* Stats */}
                    <div className="admin-stats">
                        <div className="admin-stat-card">
                            <span className="admin-stat-icon">🎶</span>
                            <div>
                                <div className="admin-stat-value blue">{choirs.length}</div>
                                <div className="admin-stat-label">Total Choirs</div>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <span className="admin-stat-icon">✓</span>
                            <div>
                                <div className="admin-stat-value green">{choirs.filter(c => c.is_verified).length}</div>
                                <div className="admin-stat-label">Verified</div>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <span className="admin-stat-icon">⏳</span>
                            <div>
                                <div className="admin-stat-value amber">{choirs.filter(c => !c.is_verified).length}</div>
                                <div className="admin-stat-label">Pending</div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="admin-filter-tabs">
                        <button
                            className={`admin-filter-tab${filter === 'all' ? ' active' : ''}`}
                            onClick={() => setFilter('all')}
                        >All Choirs</button>
                        <button
                            className={`admin-filter-tab${filter === 'verified' ? ' active' : ''}`}
                            onClick={() => setFilter('verified')}
                        >Verified</button>
                        <button
                            className={`admin-filter-tab${filter === 'pending' ? ' active' : ''}`}
                            onClick={() => setFilter('pending')}
                        >Pending</button>
                    </div>

                    {/* Choirs List */}
                    {(() => {
                        const filteredChoirs = filter === 'verified'
                            ? choirs.filter(c => c.is_verified)
                            : filter === 'pending'
                                ? choirs.filter(c => !c.is_verified)
                                : choirs;
                        return filteredChoirs.length === 0 ? (
                        <div className="admin-empty-state">
                            <div className="admin-empty-icon">🎶</div>
                            <h3 className="admin-empty-title">No choirs yet</h3>
                            <p className="admin-empty-description">
                                Choirs will appear here once they are registered
                            </p>
                        </div>
                        ) : (
                        <div className="admin-choirs-list">
                            {filteredChoirs.map((choir) => (
                                <div key={choir.id} className="admin-choir-item">
                                    <div className="admin-choir-avatar">
                                        {choir.image_path ? (
                                            <img
                                                src={choir.image_path}
                                                alt={choir.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            choir.name.charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    <div className="admin-choir-info">
                                        <div className="admin-choir-name-row">
                                            <h3 className="admin-choir-name">{choir.name}</h3>
                                            {choir.is_verified && (
                                                <span className="admin-choir-badge">✓ Verified</span>
                                            )}
                                        </div>
                                        <p className="admin-choir-location">📍 {choir.location}</p>
                                        {choir.bio && (
                                            <p className="admin-choir-bio">{choir.bio}</p>
                                        )}
                                    </div>

                                    <div className="admin-choir-actions">
                                        <button
                                            onClick={() => toggleVerification(choir.id, choir.is_verified)}
                                            className={choir.is_verified ? 'admin-choir-revoke-button' : 'admin-choir-verify-button'}
                                        >
                                            {choir.is_verified ? 'Revoke' : 'Verify'}
                                        </button>
                                        <button
                                            onClick={() => handleViewDetails(choir)}
                                            className="admin-choir-view-button"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        );
                    })()}
                </div>

                {/* Choir Details Dialog */}
                {isDetailsDialogOpen && selectedChoir && (
                    <div className="dialog-overlay" style={{ zIndex: 9999 }}>
                        <div className="dialog-container">
                            <div className="dialog-header">
                                <h2>Choir Details</h2>
                                <button onClick={handleCloseDetailsDialog} className="dialog-close-button">×</button>
                            </div>
                            <div className="dialog-body">
                                <div className="admin-choir-detail-avatar">
                                    {selectedChoir.image_path ? (
                                        <img
                                            src={selectedChoir.image_path}
                                            alt={selectedChoir.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="admin-choir-detail-avatar-placeholder">
                                            {selectedChoir.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="admin-choir-detail-info">
                                    <h3 className="admin-choir-detail-name">{selectedChoir.name}</h3>
                                    <p className="admin-choir-detail-location">📍 {selectedChoir.location}</p>
                                    <div className="admin-choir-detail-status">
                                        <span className={`admin-choir-detail-badge ${selectedChoir.is_verified ? 'verified' : 'pending'}`}>
                                            {selectedChoir.is_verified ? '✓ Verified' : '⏳ Pending Verification'}
                                        </span>
                                    </div>
                                    {selectedChoir.bio && (
                                        <div className="admin-choir-detail-bio">
                                            <label>Bio:</label>
                                            <p>{selectedChoir.bio}</p>
                                        </div>
                                    )}
                                    <div className="admin-choir-detail-meta">
                                        <label>ID:</label>
                                        <span>{selectedChoir.id}</span>
                                    </div>
                                    <div className="admin-choir-detail-meta">
                                        <label>Created:</label>
                                        <span>{new Date(selectedChoir.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="dialog-actions">
                                <button onClick={handleCloseDetailsDialog} className="dialog-button dialog-button-primary">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
