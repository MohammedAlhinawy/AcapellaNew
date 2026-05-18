import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import PropTypes from 'prop-types';
import '../../../css/public.css';
import '../../../css/guest.css';

export default function Premium({ verifiedKwayaCount = 0 }) {
    return (
        <MainLayout>
            <div className="public-page public-container">
                <div className="public-header">
                    <h2 className="public-header h1">
                        Elevate your spiritual <br />
                        <span className="public-header gradient-text">
                            listening experience.
                        </span>
                    </h2>
                    <p className="public-header p">
                        Fungua uwezo wa kusikiliza nyuma ya skrini na kupakua nyimbo huku ukisaidia kwaya zako za kitanzania unazozipenda kupitia Mongike.
                    </p>
                </div>

                <div className="public-grid">
                    {/* Free Tier */}
                    <div className="public-card">
                        <h3 className="public-card h3">Basic Access</h3>
                        <p className="public-card sub">Free forever</p>
                        
                        <div className="public-card price">
                            TSh 0<span className="public-card price span">/mo</span>
                        </div>

                        <ul className="public-card feature-list">
                            <li className="public-card feature-list item">
                                <svg className="public-card feature-list svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Streaming with ads
                            </li>
                            <li className="public-card feature-list item">
                                <svg className="public-card feature-list svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Browse full catalog & choirs
                            </li>
                            <li className="public-card feature-list item">
                                <svg className="public-card feature-list svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Up to 5 tracks in queue
                            </li>
                            <li className="public-card feature-list item disabled">
                                <svg className="public-card feature-list svg disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                No Background Play (pauses on tab switch)
                            </li>
                            <li className="public-card feature-list item disabled">
                                <svg className="public-card feature-list svg disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                No Liked Songs
                            </li>
                            <li className="public-card feature-list item disabled">
                                <svg className="public-card feature-list svg disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                No Playlists
                            </li>
                            <li className="public-card feature-list item disabled">
                                <svg className="public-card feature-list svg disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                No Downloads
                            </li>
                        </ul>

                        <button className="public-card button">
                            Current Plan
                        </button>
                    </div>

                    {/* Premium Tier */}
                    <div className="public-card feature">
                        <div className="public-card badge-recommended">
                            Recommended
                        </div>

                        <div className="public-card feature-glow"></div>

                        <h3 className="public-card h3 premium">Premium Unlocked</h3>
                        <p className="public-card sub premium">Billed monthly via Mobile Money</p>
                        
                        <div className="public-card price premium">
                            TSh 5,000<span className="public-card price span">/mo</span>
                        </div>
                        <p className="public-card price-note">Prices inclusive of VAT. Cancel anytime.</p>

                        <ul className="public-card feature-list premium">
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Uninterrupted Background Play
                            </li>
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                High-Quality Bitrates
                            </li>
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Unlimited Track Downloads
                            </li>
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Like songs & build your Liked library
                            </li>
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Create unlimited personal Playlists
                            </li>
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Unlimited queue length
                            </li>
                            <li className="public-card feature-list item premium">
                                <svg className="public-card feature-list svg premium" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Support {verifiedKwayaCount > 0 ? verifiedKwayaCount : 'our'} verified Kwaya creators directly
                            </li>
                        </ul>

                        <button className="public-card premium-btn" onClick={() => router.visit('/payments?plan=monthly')}>
                            Subscribe with Mobile Money
                            <svg className="public-card premium-btn svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </button>

                        <div className="public-card payment-methods">
                            {/* Generic payment operator pill boxes representing Snippe */}
                            <span className="span">M-Pesa</span>
                            <span className="span">Tigo Pesa</span>
                            <span className="span">Airtel</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '48px', textAlign: 'center', padding: '32px 24px', background: 'linear-gradient(135deg, rgba(184,134,11,0.15), rgba(184,134,11,0.05))', borderRadius: '16px', border: '1px solid rgba(184,134,11,0.3)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>☕</div>
                    <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.4rem' }}>Not ready for Premium?</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', maxWidth: '500px', margin: '0 auto 20px' }}>
                        You can still support us with a one-time donation — any amount helps us keep the music playing.
                    </p>
                    <button
                        onClick={() => router.visit('/donate')}
                        style={{
                            background: '#B8860B',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 28px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                        }}
                    >
                        ❤ Buy Us a Coffee
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}

Premium.propTypes = {
    verifiedKwayaCount: PropTypes.number,
};
