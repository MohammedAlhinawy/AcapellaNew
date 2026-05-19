import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from '../../Layout/MainLayout';
import apiService from '../../Services/apiService';
import { toast } from '../../Components/ToastContainer';
import { db, STORAGE_KEYS } from '../../Utils/indexedDB';
import EditProfileDialog from '../../Components/EditProfileDialog';
import EditPasswordDialog from '../../Components/EditPasswordDialog';
import EditProfileDraggableBox from '../../Components/EditProfileDraggableBox';
import EditPasswordDraggableBox from '../../Components/EditPasswordDraggableBox';
import CustomAlertDialog from '../../Components/CustomAlertDialog';
import LanguageSelector from '../../Components/LanguageSelector';
import '../../../css/admin.css';
import '../../../css/profile.css';
import useTranslation from '../../hooks/useTranslation';

export default function AdminProfile() {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiService.get('/users/me');
                setUser(response.data.data);
            } catch (error) {
                console.error('Error fetching user:', error);
                toast.error(t('admin.failed_load_profile'));
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [t]);

    const handleLogout = async () => {
        setIsLogoutAlertOpen(true);
    };

    const confirmLogout = async () => {
        try {
            await apiService.post('/auth/logout');
            await db.init();
            await db.delete('auth', STORAGE_KEYS.AUTH_TOKEN);
            await db.delete('auth', STORAGE_KEYS.USER_DATA);
            window.dispatchEvent(new CustomEvent('auth-changed'));
            router.visit('/welcome');
        } catch (error) {
            console.error('Logout error:', error);
            await db.init();
            await db.delete('auth', STORAGE_KEYS.AUTH_TOKEN);
            await db.delete('auth', STORAGE_KEYS.USER_DATA);
            window.dispatchEvent(new CustomEvent('auth-changed'));
            router.visit('/welcome');
        }
    };

    const handleEditProfile = () => {
        setIsProfileDialogOpen(true);
    };

    const handleEditPassword = () => {
        setIsPasswordDialogOpen(true);
    };

    const handleSaveProfile = async (data) => {
        try {
            const response = await apiService.put(`/users/${user.id}`, data);
            setUser(response.data.data);
            setIsProfileDialogOpen(false);
            toast.success(t('admin.profile_updated_success'));
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(t('admin.failed_update_profile'));
        }
    };

    const handleSavePassword = async (data) => {
        try {
            await apiService.put(`/users/${user.id}`, data);
            setIsPasswordDialogOpen(false);
            toast.success(t('admin.password_changed_success'));
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(t('admin.failed_change_password'));
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleteAlertOpen(true);
    };

    const confirmDeleteAccount = async () => {
        try {
            await apiService.delete(`/users/${user.id}`);
            await db.init();
            await db.delete('auth', STORAGE_KEYS.AUTH_TOKEN);
            await db.delete('auth', STORAGE_KEYS.USER_DATA);
            window.dispatchEvent(new CustomEvent('auth-changed'));
            router.visit('/welcome');
            toast.success(t('admin.account_deleted_success'));
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error(t('admin.failed_delete_account'));
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="listener-page">
                    <div className="listener-header">
                        <h1>{t('admin.profile')}</h1>
                        <p>{t('admin.loading')}</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="admin-page">
                <div className="listener-header">
                    <h1>{t('admin.profile')}</h1>
                    <p>{t('admin.manage_account_settings')}</p>
                </div>

                <div className="settings-content">
                    {/* Profile Card */}
                    <div className="luxury-card">
                        <div className="luxury-card-header">
                            <div className="luxury-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="luxury-user-info">
                                <h2 className="luxury-user-name">{user.name}</h2>
                                <p className="luxury-user-email">{user.email}</p>
                            </div>
                        </div>

                        <div className="luxury-card-body">
                            <div className="luxury-info-grid">
                                <div className="luxury-info-item">
                                    <span className="luxury-info-label">{t('admin.role')}</span>
                                    <span className="luxury-info-value">{user.role}</span>
                                </div>
                                <div className="luxury-info-item">
                                    <span className="luxury-info-label">{t('admin.member_since')}</span>
                                    <span className="luxury-info-value">{new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="luxury-card-footer">
                            <button onClick={handleEditProfile} className="luxury-button luxury-button-primary">
                                <span>✎</span> {t('admin.edit_profile')}
                            </button>
                            <button onClick={handleEditPassword} className="luxury-button luxury-button-secondary">
                                <span>🔒</span> {t('admin.change_password')}
                            </button>
                        </div>
                    </div>

                    {/* System Preferences Card */}
                    <div className="luxury-card">
                        <div className="luxury-card-header">
                            <div className="luxury-icon-wrapper">
                                <span className="luxury-icon">⚙️</span>
                            </div>
                            <div className="luxury-user-info">
                                <h2 className="luxury-card-title">{t('admin.system_preferences')}</h2>
                                <p className="luxury-card-subtitle">{t('admin.customize_experience')}</p>
                            </div>
                        </div>

                        <div className="luxury-card-body">
                            <div className="luxury-info-grid">
                                <LanguageSelector />
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone Card */}
                    <div className="luxury-card luxury-card-danger">
                        <div className="luxury-card-header">
                            <div className="luxury-icon-wrapper luxury-icon-danger">
                                <span className="luxury-icon">⚠️</span>
                            </div>
                            <div className="luxury-user-info">
                                <h2 className="luxury-card-title">{t('admin.danger_zone')}</h2>
                                <p className="luxury-card-subtitle">{t('admin.irreversible_actions')}</p>
                            </div>
                        </div>

                        <div className="luxury-card-body">
                            <p className="luxury-danger-text">
                                {t('admin.delete_account_warning')}
                            </p>
                        </div>

                        <div className="luxury-card-footer">
                            <button onClick={handleDeleteAccount} className="luxury-button luxury-button-danger-full">
                                <span>🗑️</span> {t('admin.delete_account')}
                            </button>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="settings-logout-section">
                        <button onClick={handleLogout} className="luxury-button luxury-button-logout">
                            <span>→</span> {t('admin.logout')}
                        </button>
                    </div>
                </div>

                {/* Dialogs */}
                {isMobile ? (
                    <>
                        <EditProfileDraggableBox
                            isOpen={isProfileDialogOpen}
                            onClose={() => setIsProfileDialogOpen(false)}
                            user={user}
                            onSave={handleSaveProfile}
                        />
                        <EditPasswordDraggableBox
                            isOpen={isPasswordDialogOpen}
                            onClose={() => setIsPasswordDialogOpen(false)}
                            onSave={handleSavePassword}
                        />
                    </>
                ) : (
                    <>
                        <EditProfileDialog
                            isOpen={isProfileDialogOpen}
                            onClose={() => setIsProfileDialogOpen(false)}
                            user={user}
                            onSave={handleSaveProfile}
                        />
                        <EditPasswordDialog
                            isOpen={isPasswordDialogOpen}
                            onClose={() => setIsPasswordDialogOpen(false)}
                            onSave={handleSavePassword}
                        />
                    </>
                )}

                <CustomAlertDialog
                    isOpen={isDeleteAlertOpen}
                    onClose={() => setIsDeleteAlertOpen(false)}
                    onConfirm={confirmDeleteAccount}
                    title={t('admin.delete_account')}
                    message={t('admin.sure_delete_account')}
                    confirmText={t('admin.delete_account')}
                    cancelText={t('common.cancel')}
                    type="danger"
                />
                <CustomAlertDialog
                    isOpen={isLogoutAlertOpen}
                    onClose={() => setIsLogoutAlertOpen(false)}
                    onConfirm={confirmLogout}
                    title={t('admin.logout')}
                    message={t('admin.sure_logout')}
                    confirmText={t('admin.logout')}
                    cancelText={t('common.cancel')}
                    type="primary"
                />
            </div>
        </MainLayout>
    );
}
