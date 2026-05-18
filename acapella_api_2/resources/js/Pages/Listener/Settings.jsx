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
import { FaRegEnvelope } from "react-icons/fa";
import '../../../css/listener.css';
import '../../../css/profile.css';

export default function Settings() {
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
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleSavePassword = async (data) => {
        try {
            await apiService.put(`/users/${user.id}`, data);
            setIsPasswordDialogOpen(false);
            toast.success('Password changed successfully');
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Failed to change password');
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
                        <h1>Profile</h1>
                        <p>Loading...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }
    return (
        <MainLayout>
            <div className="listener-page">
                <div className="listener-header">
                    <h1>Profile</h1>
                    <p>Manage your account settings and preferences</p>
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
                                {user.is_premium ? '✦ Premium' : 'Free'}
                            </div>
                        </div>

                        <div className="luxury-card-body">
                            <div className="luxury-info-grid">
                                <div className="luxury-info-item">
                                    <span className="luxury-info-label">Member Since</span>
                                    <span className="luxury-info-value">{new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="luxury-card-footer">
                            <button onClick={handleEditProfile} className="luxury-button luxury-button-primary">
                                <span>✎</span> Edit Profile
                            </button>
                            <button onClick={handleEditPassword} className="luxury-button luxury-button-secondary">
                                <span>🔒</span> Change Password
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
                                    <h2 className="luxury-card-title">Subscription</h2>
                                    <p className="luxury-card-subtitle">
                                        Upgrade to unlock all features
                                    </p>
                                </div>
                            </div>

                            <div className="luxury-card-body">
                                <div className="luxury-upgrade-cta">
                                    <p className="luxury-upgrade-text">
                                        Unlock unlimited streaming, downloads, and exclusive content
                                    </p>
                                    <button onClick={() => setIsSubscriptionDialogOpen(true)} className="luxury-button luxury-button-gold">
                                        <span>✦</span> Upgrade to Premium
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
                                <h2 className="luxury-card-title">System Preferences</h2>
                                <p className="luxury-card-subtitle">Customize your experience</p>
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
                                <h2 className="luxury-card-title">Feedback</h2>
                                <p className="luxury-card-subtitle">Share your thoughts with us</p>
                            </div>
                        </div>
                        <div className="luxury-card-body">
                            <p className="luxury-danger-text" style={{ color: 'var(--text-secondary)' }}>
                                Help us improve Acapella by sharing your feedback, reporting bugs, or suggesting features.
                            </p>
                        </div>
                        <div className="luxury-card-footer">
                            <button onClick={() => router.visit('/feedback')} className="luxury-button luxury-button-primary">
                                <FaRegEnvelope /> Submit Feedback
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
                                <h2 className="luxury-card-title">Support Us</h2>
                                <p className="luxury-card-subtitle">Help us improve Acapella</p>
                            </div>
                        </div>

                        <div className="luxury-card-body">
                            <p className="luxury-danger-text" style={{ color: 'var(--text-secondary)' }}>
                                Buy us a coffee or make a donation. Every contribution helps cover server costs and supports our artists. Asante sana! 🙏
                            </p>
                        </div>

                        <div className="luxury-card-footer">
                            <button onClick={() => router.visit('/donate')} className="luxury-button luxury-button-gold">
                                <span>❤</span> Buy Us a Coffee
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
                                <h2 className="luxury-card-title">Danger Zone</h2>
                                <p className="luxury-card-subtitle">Irreversible account actions</p>
                            </div>
                        </div>

                        <div className="luxury-card-body">
                            <p className="luxury-danger-text">
                                Deleting your account is permanent and cannot be undone. All your data, including playlists and preferences, will be permanently removed.
                            </p>
                        </div>

                        <div className="luxury-card-footer">
                            <button onClick={handleDeleteAccount} className="luxury-button luxury-button-danger-full">
                                <span>🗑️</span> Delete Account
                            </button>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="settings-logout-section">
                        <button onClick={handleLogout} className="luxury-button luxury-button-logout">
                            <span>→</span> Logout
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
                    title="Delete Account"
                    message="Are you sure you want to delete your account? This action cannot be undone. All your data, including playlists and preferences, will be permanently removed."
                    confirmText="Delete Account"
                    cancelText="Cancel"
                    type="danger"
                />
                <CustomAlertDialog
                    isOpen={isLogoutAlertOpen}
                    onClose={() => setIsLogoutAlertOpen(false)}
                    onConfirm={confirmLogout}
                    title="Logout"
                    message="Are you sure you want to logout?"
                    confirmText="Logout"
                    cancelText="Cancel"
                    type="primary"
                />
            </div>
        </MainLayout>
    );
}
