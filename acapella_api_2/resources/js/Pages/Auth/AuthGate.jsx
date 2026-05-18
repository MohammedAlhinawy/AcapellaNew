import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { db, STORAGE_KEYS } from '../../Utils/indexedDB';
import '../../../css/auth.css';

export default function AuthGate() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getRedirectPath = (role) => {
            const normalizedRole = role?.toString().trim().toLowerCase();
            const roleRedirects = {
                admin: '/admin',
                choir_manager: '/manager',
                listener: '/explore',
            };

            return roleRedirects[normalizedRole] || '/explore';
        };

        const redirectForUser = (user) => {
            router.visit(getRedirectPath(user?.role), { replace: true });
        };

        const extractUser = (payload) => {
            const data = payload?.data ?? payload;
            return data?.user_info || data?.user || data;
        };

        const checkAuth = async () => {
            try {
                await db.init();
                const token = await db.get('auth', STORAGE_KEYS.AUTH_TOKEN);
                const userData = await db.get('auth', STORAGE_KEYS.USER_DATA);

                if (!token) {
                    router.visit('/welcome', { replace: true });
                    setLoading(false);
                    return;
                }

                if (userData) {
                    const parsedUser = extractUser(userData);

                    if (parsedUser?.role) {
                        const redirectPath = getRedirectPath(parsedUser.role);
                        router.visit(redirectPath, { replace: true });
                        setLoading(false);
                        return;
                    }
                }

                const response = await axios.get('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });
                const user = extractUser(response.data);

                if (user?.role) {
                    await db.set('auth', STORAGE_KEYS.USER_DATA, user);
                    redirectForUser(user);
                    setLoading(false);
                    return;
                }

                router.visit('/welcome', { replace: true });
            } catch (error) {
                console.error('AuthGate - Error checking auth:', error);
                await db.delete('auth', STORAGE_KEYS.AUTH_TOKEN);
                await db.delete('auth', STORAGE_KEYS.USER_DATA);
                router.visit('/welcome', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="auth-page">
                <div className="loading-spinner" />
            </div>
        );
    }

    return null;
}
