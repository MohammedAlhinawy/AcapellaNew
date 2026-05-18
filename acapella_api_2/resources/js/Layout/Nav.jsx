import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { db, STORAGE_KEYS } from '../Utils/indexedDB';
import '../../css/nav.css';

export default function Nav() {
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
                { label: 'Home', href: '/welcome' },
                { label: 'Premium', href: '/premium' },
                { label: 'Login', href: '/login', className: 'nav-link-login' },
                { label: 'Sign Up', href: '/register', className: 'nav-link-signup' },
            ];
        }

        if (!user) {
            return [];
        }

        if (user.role === 'listener') {
            return [
                { label: 'Explore', href: '/explore', activeOn: ['/explore', '/albums', '/choirs'] },
                { label: 'Library', href: '/library' },
                { label: 'Profile', href: '/profile' },
            ];
        }

        if (user.role === 'choir_manager') {
            return [
                { label: 'Dashboard', href: '/manager', exact: true },
                { label: 'My Choirs', href: '/manager/choirs' },
                { label: 'Profile', href: '/manager/profile' },
            ];
        }

        if (user.role === 'admin') {
            return [
                { label: 'Dashboard', href: '/admin', exact: true },
                { label: 'Choirs', href: '/admin/choirs' },
                { label: 'Users', href: '/admin/users' },
                { label: 'Requests', href: '/admin/manager-requests' },
                { label: 'Feedbacks', href: '/admin/feedbacks' },
                { label: 'Profile', href: '/admin/profile' },
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
