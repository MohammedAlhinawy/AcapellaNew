import { useState, useEffect } from 'react';
import MainLayout from '../../Layout/MainLayout';
import apiService from '../../Services/apiService';
import CustomAlertDialog from '../../Components/CustomAlertDialog';
import '../../../css/admin.css';

export default function AdminUsers() {
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
            alert('Failed to change user role');
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
            alert('Failed to delete user');
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
                            <h1>User Management</h1>
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
                        <h1>User Management</h1>
                        <p>View, manage, and modify user accounts and roles</p>
                    </div>

                    {/* Stats */}
                    <div className="admin-stats">
                        <div className="admin-stat-card">
                            <span className="admin-stat-icon">👤</span>
                            <div>
                                <div className="admin-stat-value blue">{users.length}</div>
                                <div className="admin-stat-label">Total Users</div>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <span className="admin-stat-icon">🎧</span>
                            <div>
                                <div className="admin-stat-value green">{users.filter(u => u.role === 'listener').length}</div>
                                <div className="admin-stat-label">Listeners</div>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <span className="admin-stat-icon">🎤</span>
                            <div>
                                <div className="admin-stat-value amber">{users.filter(u => u.role === 'choir_manager').length}</div>
                                <div className="admin-stat-label">Choir Managers</div>
                            </div>
                        </div>
                        <div className="admin-stat-card">
                            <span className="admin-stat-icon">🛡️</span>
                            <div>
                                <div className="admin-stat-value purple">{users.filter(u => u.role === 'admin').length}</div>
                                <div className="admin-stat-label">Admins</div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="admin-search-filter">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="admin-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            className="admin-filter-select"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="listener">Listeners</option>
                            <option value="choir_manager">Choir Managers</option>
                            <option value="admin">Admins</option>
                        </select>
                        <select
                            className="admin-filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="premium">Premium</option>
                            <option value="free">Free</option>
                        </select>
                    </div>

                    {/* Users Table */}
                    {filteredUsers.length === 0 ? (
                        <div className="admin-empty-state">
                            <div className="admin-empty-icon">👤</div>
                            <h3 className="admin-empty-title">No users yet</h3>
                            <p className="admin-empty-description">
                                Users will appear here once they register
                            </p>
                        </div>
                    ) : (
                        <div className="admin-users-table-wrapper">
                            <div className="admin-users-table-scroll">
                                <table className="admin-users-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
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
                                                        <option value="listener">Listener</option>
                                                        <option value="choir_manager">Choir Manager</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td data-label="Status">
                                                    {user.is_premium ? (
                                                        <span className="admin-status-badge premium">
                                                            Premium
                                                        </span>
                                                    ) : (
                                                        <span className="admin-status-badge free">
                                                            Free
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
                                                            Delete
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
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </MainLayout>
    );
}
