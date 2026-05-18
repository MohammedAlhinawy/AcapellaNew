import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { db, STORAGE_KEYS } from '../Utils/indexedDB';
import '../../css/footer.css';

export default function Footer() {
    const [user, setUser] = useState(null);
    const isGuest = !user;

    useEffect(() => {
        const loadUser = async () => {
            try {
                await db.init();
                const userData = await db.get('auth', STORAGE_KEYS.USER_DATA);
                setUser(userData);
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };

        loadUser();

        // Listen for auth changes
        const handleAuthChange = () => {
            loadUser();
        };

        window.addEventListener('auth-changed', handleAuthChange);
        return () => window.removeEventListener('auth-changed', handleAuthChange);
    }, []);

    if (!isGuest) {
        return null;
    }

    return (
        <footer className="footer-container">
            <div className="footer-inner">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img
                                src="/images/logo.png"
                                alt="Acapella Logo"
                                className="footer-logo-img"
                            />
                            <span className="footer-logo-text">Acapella</span>
                        </div>
                        <p className="footer-description">
                            The premier platform for streaming Tanzanian Christian Kwaya music. Support local choirs directly through mobile money subscriptions.
                        </p>
                    </div>

                    {/* Support */}
                    <div className="footer-section">
                        <h3 className="footer-section-title">Support</h3>
                        <ul className="footer-links">
                            <li>
                                <a href="mailto:acapellatz@gmail.com" className="footer-link">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="mailto:acapellatz@gmail.com" className="footer-link">
                                    Privacy Inquiries
                                </a>
                            </li>
                            <li style={{ marginBottom: '7px' }}>
                                <Link href="/become-choir-manager" className="footer-link">
                                    Become a Choir Manager
                                </Link>
                            </li>
                            <li style={{ borderTop: '1px solid #dddddd', width: 'calc(100% + 30px)' }}></li>
                            <li style={{ marginTop: '7px' }}>
                                <Link href="/terms-of-service" className="footer-link">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy" className="footer-link">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-copyright">
                    <p className="footer-copyright-text">
                        © {new Date().getFullYear()} Acapella. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
