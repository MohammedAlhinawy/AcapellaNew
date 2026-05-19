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
import SubscriptionDialog from '../../Components/SubscriptionDialog';
import SubscriptionDraggableBox from '../../Components/SubscriptionDraggableBox';
import CustomAlertDialog from '../../Components/CustomAlertDialog';
import LanguageSelector from '../../Components/LanguageSelector';
import useTranslation from '../../hooks/useTranslation';
import { FaRegEnvelope } from "react-icons/fa";
import '../../../css/listener.css';
import '../../../css/profile.css';

export default function Settings() {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
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
                toast.error(t('settings.failed_to_load_profile'));
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
            toast.success(t('settings.profile_updated'));
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(t('settings.failed_to_update_profile'));
        }
    };

    const handleSavePassword = async (data) => {
        try {
            await apiService.put(`/users/${user.id}`, data);
            setIsPasswordDialogOpen(false);
            toast.success(t('settings.password_changed'));
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(t('settings.failed_to_change_password'));
        }
    };

    const handleSelectPlan = (plan) => {
        setIsSubscriptionDialogOpen(false);
        router.visit(`/payments?plan=${plan}`);
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
            toast.success(t('settings.account_deleted'));
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error(t('settings.failed_to_delete_account'));
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
            <div className="listener-page">
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
                            <div className={`luxury-badge ${user.is_premium ? 'premium' : 'free'}`}>
                                {user.is_premium ? `✦ ${t('album.premium')}` : t('settings.free')}
                            </div>
                        </div>

                        <div className="luxury-card-body">
                            <div className="luxury-info-grid">
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

                    {/* Subscription Card - only shown to free users */}
                    {!user.is_premium && (
                        <div className="luxury-card">
                            <div className="luxury-card-header">
                                <div className="luxury-icon-wrapper">
                                    <span className="luxury-icon">💎</span>
                                </div>
                                <div className="luxury-user-info">
                                    <h2 className="luxury-card-title">{t('settings.subscription')}</h2>
                                    <p className="luxury-card-subtitle">
                                        {t('settings.upgrade_unlock')}
                                    </p>
                                </div>
                            </div>

                            <div className="luxury-card-body">
                                <div className="luxury-upgrade-cta">
                                    <p className="luxury-upgrade-text">
                                        {t('settings.upgrade_text')}
                                    </p>
                                    <button onClick={() => setIsSubscriptionDialogOpen(true)} className="luxury-button luxury-button-gold">
                                        <span>✦</span> {t('settings.upgrade_premium')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* System Preferences Card */}
                    <div className="luxury-card">
                        <div className="luxury-card-header">
                            <div className="luxury-icon-wrapper">
                                <span className="luxury-icon">⚙️</span>
                            </div>
                            <div className="luxury-user-info">
                                <h2 className="luxury-card-title">{t('settings.system_preferences')}</h2>
                                <p className="luxury-card-subtitle">{t('settings.customize_experience')}</p>
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
                                <h2 className="luxury-card-title">{t('settings.feedback')}</h2>
                                <p className="luxury-card-subtitle">{t('settings.share_thoughts')}</p>
                            </div>
                        </div>
                        <div className="luxury-card-body">
                            <p className="luxury-danger-text" style={{ color: 'var(--text-secondary)' }}>
                                {t('settings.feedback_help')}
                            </p>
                        </div>
                        <div className="luxury-card-footer">
                            <button onClick={() => router.visit('/feedback')} className="luxury-button luxury-button-primary">
                                <FaRegEnvelope /> {t('settings.submit_feedback')}
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
                                <h2 className="luxury-card-title">{t('settings.support_us')}</h2>
                                <p className="luxury-card-subtitle">{t('settings.help_improve')}</p>
                            </div>
                        </div>

                        <div className="luxury-card-body">
                            <p className="luxury-danger-text" style={{ color: 'var(--text-secondary)' }}>
                                {t('settings.donate_text')}
                            </p>
                        </div>

                        <div className="luxury-card-footer">
                            <button onClick={() => router.visit('/donate')} className="luxury-button luxury-button-gold">
                                <span>❤</span> {t('settings.buy_coffee')}
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
                                <h2 className="luxury-card-title">{t('settings.danger_zone')}</h2>
                                <p className="luxury-card-subtitle">{t('settings.irreversible_actions')}</p>
                            </div>
                        </div>

                        <div className="luxury-card-body">
                            <p className="luxury-danger-text">
                                {t('settings.delete_warning')}
                            </p>
                        </div>

                        <div className="luxury-card-footer">
                            <button onClick={handleDeleteAccount} className="luxury-button luxury-button-danger-full">
                                <span>🗑️</span> {t('settings.delete_account')}
                            </button>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="settings-logout-section">
                        <button onClick={handleLogout} className="luxury-button luxury-button-logout">
                            <span>→</span> {t('settings.logout')}
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
                        <SubscriptionDraggableBox
                            isOpen={isSubscriptionDialogOpen}
                            onClose={() => setIsSubscriptionDialogOpen(false)}
                            onSelectPlan={handleSelectPlan}
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
                        <SubscriptionDialog
                            isOpen={isSubscriptionDialogOpen}
                            onClose={() => setIsSubscriptionDialogOpen(false)}
                            onSelectPlan={handleSelectPlan}
                        />
                    </>
                )}

                <CustomAlertDialog
                    isOpen={isDeleteAlertOpen}
                    onClose={() => setIsDeleteAlertOpen(false)}
                    onConfirm={confirmDeleteAccount}
                    title={t('settings.delete_account')}
                    message={t('settings.delete_warning')}
                    confirmText={t('settings.delete_account')}
                    cancelText={t('common.cancel')}
                    type="danger"
                />
                <CustomAlertDialog
                    isOpen={isLogoutAlertOpen}
                    onClose={() => setIsLogoutAlertOpen(false)}
                    onConfirm={confirmLogout}
                    title={t('settings.logout_confirm_title')}
                    message={t('settings.logout_confirm')}
                    confirmText={t('settings.logout')}
                    cancelText={t('common.cancel')}
                    type="primary"
                />
            </div>
        </MainLayout>
    );
}
