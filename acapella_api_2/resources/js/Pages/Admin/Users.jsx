import { useState, useEffect } from 'react';
import MainLayout from '../../Layout/MainLayout';
import apiService from '../../Services/apiService';
import CustomAlertDialog from '../../Components/CustomAlertDialog';
import '../../../css/admin.css';
import useTranslation from '../../hooks/useTranslation';

export default function AdminUsers() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiService.get('/admin/users');
                setUsers(response.data.data.data || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const changeRole = async (userId, newRole) => {
        try {
            await apiService.post(`/admin/users/${userId}/role`, { role: newRole });
            // Refresh users list
            const response = await apiService.get('/admin/users');
            setUsers(response.data.data.data || []);
        } catch (error) {
            console.error('Error changing user role:', error);
            alert(t('admin.failed_change_role'));
        }
    };

    const deleteUser = async (userId) => {
        setUserToDelete(userId);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await apiService.delete(`/users/${userToDelete}`);
            // Refresh users list
            const response = await apiService.get('/admin/users');
            setUsers(response.data.data.data || []);
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(t('admin.failed_delete_user'));
        } finally {
            setUserToDelete(null);
            setDeleteDialogOpen(false);
        }
    };

    // Filter users based on search, role, and status
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            searchQuery === '' ||
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === '' || user.role === roleFilter;

        const matchesStatus =
            statusFilter === '' ||
            (statusFilter === 'premium' && user.is_premium) ||
            (statusFilter === 'free' && !user.is_premium);

        return matchesSearch && matchesRole && matchesStatus;
    });

    if (loading) {
        return (
            <MainLayout>
                <div className="admin-page">
                    <div className="admin-container">
                        <div className="admin-header">
                            <h1>{t('admin.user_management')}</h1>
                            <p>{t('admin.loading')}</p>
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
                        <h1>{t('admin.user_management')}</h1>
                        <p>{t('admin.view_manage_users')}</p>
                    </div>

                    {/* Stats */}
                    <div className="admin-stats">
                        <div className="admin-stat-card">
                            <span className="admin-stat-icon">👤</span>
                            <div>
                                <div className="admin-stat-value blue">{users.length}</div>
                                <div className="admin-stat-label">{t('admin.total_users')}</div>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <span className="admin-stat-icon">🎧</span>
                            <div>
                                <div className="admin-stat-value green">{users.filter(u => u.role === 'listener').length}</div>
                                <div className="admin-stat-label">{t('admin.listeners')}</div>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <span className="admin-stat-icon">🎤</span>
                            <div>
                                <div className="admin-stat-value amber">{users.filter(u => u.role === 'choir_manager').length}</div>
                                <div className="admin-stat-label">{t('admin.choir_managers')}</div>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <span className="admin-stat-icon">🛡️</span>
                            <div>
                                <div className="admin-stat-value purple">{users.filter(u => u.role === 'admin').length}</div>
                                <div className="admin-stat-label">{t('admin.admins')}</div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="admin-search-filter">
                        <input
                            type="text"
                            placeholder={t('admin.search_users')}
                            className="admin-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            className="admin-filter-select"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">{t('admin.all_roles')}</option>
                            <option value="listener">{t('admin.listeners')}</option>
                            <option value="choir_manager">{t('admin.choir_managers')}</option>
                            <option value="admin">{t('admin.admins')}</option>
                        </select>
                        <select
                            className="admin-filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">{t('admin.all_status')}</option>
                            <option value="premium">{t('admin.premium')}</option>
                            <option value="free">{t('admin.free')}</option>
                        </select>
                    </div>

                    {/* Users Table */}
                    {filteredUsers.length === 0 ? (
                        <div className="admin-empty-state">
                            <div className="admin-empty-icon">👤</div>
                            <h3 className="admin-empty-title">{t('admin.no_users_yet')}</h3>
                            <p className="admin-empty-description">
                                {t('admin.users_appear_here')}
                            </p>
                        </div>
                    ) : (
                        <div className="admin-users-table-wrapper">
                            <div className="admin-users-table-scroll">
                                <table className="admin-users-table">
                                    <thead>
                                        <tr>
                                            <th>{t('admin.user')}</th>
                                            <th>{t('admin.role')}</th>
                                            <th>{t('admin.status')}</th>
                                            <th>{t('admin.joined')}</th>
                                            <th>{t('admin.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td data-label="User">
                                                    <div className="admin-user-cell">
                                                        <div className="admin-user-avatar">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="admin-user-info">
                                                            <div className="admin-user-name">{user.name}</div>
                                                            <div className="admin-user-email">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td data-label="Role">
                                                    <select
                                                        defaultValue={user.role}
                                                        onChange={(e) => changeRole(user.id, e.target.value)}
                                                        className="admin-role-select"
                                                    >
                                                        <option value="listener">{t('admin.listener')}</option>
                                                        <option value="choir_manager">{t('admin.choir_manager')}</option>
                                                        <option value="admin">{t('admin.admin')}</option>
                                                    </select>
                                                </td>
                                                <td data-label="Status">
                                                    {user.is_premium ? (
                                                        <span className="admin-status-badge premium">
                                                            {t('admin.premium')}
                                                        </span>
                                                    ) : (
                                                        <span className="admin-status-badge free">
                                                            {t('admin.free')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td data-label="Joined" className="admin-joined-date">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td data-label="Actions" className="admin-actions-cell">
                                                    <div className="admin-actions-wrapper">
                                                        <button
                                                            onClick={() => deleteUser(user.id)}
                                                            className="admin-delete-button"
                                                        >
                                                            {t('admin.delete')}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CustomAlertDialog
                isOpen={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setUserToDelete(null);
                }}
                onConfirm={confirmDeleteUser}
                title={t('admin.delete')}
                message={t('admin.sure_delete_user')}
                confirmText={t('admin.delete')}
                cancelText={t('common.cancel')}
                type="danger"
            />
        </MainLayout>
    );
}
