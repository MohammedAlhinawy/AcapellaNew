import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { db, STORAGE_KEYS } from '../Utils/indexedDB';
import '../../css/nav.css';
import useTranslation from '../hooks/useTranslation';

export default function Nav() {
    const { t } = useTranslation();
    const { props, url } = usePage();
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const isGuest = !user && !isLoading;

    useEffect(() => {
        const loadUser = async () => {
            try {
                // First check if user is in page props (more reliable during navigation)
                // eslint-disable-next-line react/prop-types
                if (props.auth?.user) {
                    // eslint-disable-next-line react/prop-types
                    setUser(props.auth.user);
                    setIsLoading(false);
                    return;
                }

                // Fallback to IndexedDB
                await db.init();
                const userData = await db.get('auth', STORAGE_KEYS.USER_DATA);
                setUser(userData);
            } catch (_error) {
                console.error('Error loading user data:', _error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();

        // Listen for auth changes
        const handleAuthChange = () => {
            loadUser();
        };

        window.addEventListener('auth-changed', handleAuthChange);
        return () => window.removeEventListener('auth-changed', handleAuthChange);
        // eslint-disable-next-line react/prop-types
    }, [props.auth?.user]);

    const getNavLinks = () => {
        if (isLoading) {
            return [];
        }

        if (isGuest) {
            return [
                { label: t('nav.home'), href: '/welcome' },
                { label: t('nav.premium'), href: '/premium' },
                { label: t('nav.login'), href: '/login', className: 'nav-link-login' },
                { label: t('nav.sign_up'), href: '/register', className: 'nav-link-signup' },
            ];
        }

        if (!user) {
            return [];
        }

        if (user.role === 'listener') {
            return [
                { label: t('nav.explore'), href: '/explore', activeOn: ['/explore', '/albums', '/choirs'] },
                { label: t('nav.library'), href: '/library' },
                { label: t('nav.profile'), href: '/profile' },
            ];
        }

        if (user.role === 'choir_manager') {
            return [
                { label: t('nav.dashboard'), href: '/manager', exact: true },
                { label: t('nav.my_choirs'), href: '/manager/choirs' },
                { label: t('nav.profile'), href: '/manager/profile' },
            ];
        }

        if (user.role === 'admin') {
            return [
                { label: t('nav.dashboard'), href: '/admin', exact: true },
                { label: t('nav.choirs'), href: '/admin/choirs' },
                { label: t('nav.users'), href: '/admin/users' },
                { label: t('nav.requests'), href: '/admin/manager-requests' },
                { label: t('nav.feedbacks'), href: '/admin/feedbacks' },
                { label: t('nav.profile'), href: '/admin/profile' },
            ];
        }

        return [];
    };

    const navLinks = getNavLinks();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="nav-container">
            <div className="nav-inner">
                <div className="nav-content">
                    <Link href="/" className="nav-logo-link">
                        <img
                            src="/images/logo.png"
                            alt="Acapella Logo"
                            className="nav-logo-img"
                        />
                        <span className="nav-logo-text">Acapella</span>
                    </Link>

                    <div className={`nav-links ${isMobileMenuOpen ? 'nav-links-open' : ''}`}>
                        {navLinks.map((link) => {
                            let isActive;
                            if (link.activeOn) {
                                isActive = link.activeOn.some(path => url === path || url.startsWith(path + '/'));
                            } else if (link.exact) {
                                isActive = url === link.href;
                            } else {
                                isActive = url === link.href || (link.href !== '/welcome' && link.href !== '/' && url.startsWith(link.href + '/'));
                            }
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`nav-link ${isActive ? 'active' : ''} ${link.className || ''}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    <button
                        className="nav-mobile-menu-button"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <FaTimes className='open-icon' />
                        ) : (
                            <FaBars className='open-icon' />
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}
