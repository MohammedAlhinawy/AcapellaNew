import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from '../../Layout/MainLayout';
import userService from '../../Services/userService';
import authService from '../../Services/authService';
import { toast } from '../../Components/ToastContainer';
import { db, STORAGE_KEYS } from '../../Utils/indexedDB';
import EditProfileDialog from '../../Components/EditProfileDialog';
import EditPasswordDialog from '../../Components/EditPasswordDialog';
import EditProfileDraggableBox from '../../Components/EditProfileDraggableBox';
import EditPasswordDraggableBox from '../../Components/EditPasswordDraggableBox';
import CustomAlertDialog from '../../Components/CustomAlertDialog';
import LanguageSelector from '../../Components/LanguageSelector';
import useTranslation from '../../hooks/useTranslation';
import { FaRegEnvelope } from "react-icons/fa";
import '../../../css/manager.css';
import '../../../css/profile.css';

export default function ChoirManagerProfile() {
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
                const userData = await userService.getMe();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        setIsLogoutAlertOpen(true);
    };

    const confirmLogout = async () => {
        try {
            await authService.logout();
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
            const response = await userService.updateUser(user.id, data);
            setUser(response);
            setIsProfileDialogOpen(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleSavePassword = async (data) => {
        try {
            await userService.updateUser(user.id, data);
            setIsPasswordDialogOpen(false);
            toast.success('Password changed successfully');
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Failed to change password');
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleteAlertOpen(true);
    };

    const confirmDeleteAccount = async () => {
        try {
            await userService.deleteUser(user.id);
            await db.init();
            await db.delete('auth', STORAGE_KEYS.AUTH_TOKEN);
            await db.delete('auth', STORAGE_KEYS.USER_DATA);
            window.dispatchEvent(new CustomEvent('auth-changed'));
            router.visit('/welcome');
            toast.success('Account deleted successfully');
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('Failed to delete account');
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="listener-page">
                    <div className="listener-header">
                        <h1>{t('profile.title')}</h1>
                        <p>{t('common.loading')}</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="manager-page">
                <div className="listener-header">
                    <h1>{t('profile.title')}</h1>
                    <p>{t('profile.settings')}</p>
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
                            {/* <div className={`luxury-badge ${user.is_premium ? 'premium' : 'free'}`}>
                                {user.is_premium ? '✦ Premium' : 'Free'}
                            </div> */}
                        </div>

                        <div className="luxury-card-body">
                            <div className="luxury-info-grid">
                                <div className="luxury-info-item">
                                    <span className="luxury-info-label">{t('profile.role')}</span>
                                    <span className="luxury-info-value">{user.role}</span>
                                </div>
                                <div className="luxury-info-item">
                                    <span className="luxury-info-label">{t('profile.member_since')}</span>
                                    <span className="luxury-info-value">{new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="luxury-card-footer">
                            <button onClick={handleEditProfile} className="luxury-button luxury-button-primary">
                                <span>✎</span> {t('profile.edit')}
                            </button>
                            <button onClick={handleEditPassword} className="luxury-button luxury-button-secondary">
                                <span>🔒</span> {t('profile.change_password')}
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
                                <h2 className="luxury-card-title">{t('profile.system_preferences')}</h2>
                                <p className="luxury-card-subtitle">{t('profile.customize_experience')}</p>
                            </div>
                        </div>

                        <div className="luxury-card-body">
                            <div className="luxury-info-grid">
                                <LanguageSelector />
                            </div>
                        </div>
                    </div>

                    {/* Feedback Card */}
                    <div className="luxury-card">
                        <div className="luxury-card-header">
                            <div className="luxury-icon-wrapper">
                                <span className="luxury-icon">💬</span>
                            </div>
                            <div className="luxury-user-info">
                                <h2 className="luxury-card-title">{t('profile.feedback')}</h2>
                                <p className="luxury-card-subtitle">{t('profile.feedback_subtitle')}</p>
                            </div>
                        </div>
                        <div className="luxury-card-body">
                            <p className="luxury-danger-text" style={{ color: 'var(--text-secondary)' }}>
                                {t('profile.feedback_description')}
                            </p>
                        </div>
                        <div className="luxury-card-footer">
                            <button onClick={() => router.visit('/feedback')} className="luxury-button luxury-button-primary">
                                <FaRegEnvelope /> {t('profile.submit_feedback')}
                            </button>
                        </div>
                    </div>

                    {/* Support Us Card */}
                    <div className="luxury-card">
                        <div className="luxury-card-header">
                            <div className="luxury-icon-wrapper">
                                <span className="luxury-icon">☕</span>
                            </div>
                            <div className="luxury-user-info">
                                <h2 className="luxury-card-title">{t('profile.support_us')}</h2>
                                <p className="luxury-card-subtitle">{t('profile.support_subtitle')}</p>
                            </div>
                        </div>
                        <div className="luxury-card-body">
                            <p className="luxury-danger-text" style={{ color: 'var(--text-secondary)' }}>
                                {t('profile.support_description')}
                            </p>
                        </div>
                        <div className="luxury-card-footer">
                            <button onClick={() => router.visit('/donate')} className="luxury-button luxury-button-gold">
                                <span>❤</span> {t('profile.buy_coffee')}
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone Card */}
                    <div className="luxury-card luxury-card-danger">
                        <div className="luxury-card-header">
                            <div className="luxury-icon-wrapper luxury-icon-danger">
                                <span className="luxury-icon">⚠️</span>
                            </div>
                            <div className="luxury-user-info">
                                <h2 className="luxury-card-title">{t('profile.danger_zone')}</h2>
                                <p className="luxury-card-subtitle">{t('profile.danger_subtitle')}</p>
                            </div>
                        </div>

                        <div className="luxury-card-body">
                            <p className="luxury-danger-text">
                                {t('profile.delete_warning')}
                            </p>
                        </div>

                        <div className="luxury-card-footer">
                            <button onClick={handleDeleteAccount} className="luxury-button luxury-button-danger-full">
                                <span>🗑️</span> {t('profile.delete_account')}
                            </button>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="settings-logout-section">
                        <button onClick={handleLogout} className="luxury-button luxury-button-logout">
                            <span>→</span> {t('profile.logout')}
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
                    title={t('profile.delete_account')}
                    message={t('profile.delete_confirm')}
                    confirmText={t('profile.delete_account')}
                    cancelText={t('profile.cancel')}
                    type="danger"
                />
                <CustomAlertDialog
                    isOpen={isLogoutAlertOpen}
                    onClose={() => setIsLogoutAlertOpen(false)}
                    onConfirm={confirmLogout}
                    title={t('profile.logout')}
                    message={t('profile.logout_confirm')}
                    confirmText={t('profile.logout')}
                    cancelText={t('profile.cancel')}
                    type="primary"
                />
            </div>
        </MainLayout>
    );
}
