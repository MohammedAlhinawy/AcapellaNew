import MainLayout from '../../Layout/MainLayout';
import { router } from '@inertiajs/react';
import { FaPlay, FaUsers, FaBolt, FaHeart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import '../../../css/public.css';
import '../../../css/guest.css';

export default function Welcome({ stats = { choirs: 0, tracks: 0 } }) {
    return (
        <MainLayout>
            <div className="public-page welcome-container">
                <div className="public-header badge">
                    Uzoefu Bora wa Kwaya
                </div>

                <h1 className="public-header h1 welcome">
                    Sikiliza <br />
                    <span className="public-header gradient-text">
                        Sauti za Tanzania
                    </span>
                </h1>

                <p className="public-header p welcome">
                    Furahia muziki wa kipekee wa uaminifu wa hali ya juu wa Kikristo wa Kwaya kutoka huko <span className="highlight">{stats.choirs} kwaya zilizothibitishwa</span> na <span className="highlight">{stats.tracks} tracks</span>. Saidia kwaya za ndani moja kwa moja kupitia ushirikiano rahisi wa malipo ya simu wa Mongike.
                </p>

                <div className="public-grid welcome">
                    <div className="public-card">
                        <div className="icon blue">
                            <FaPlay className="svg" size={24} />
                        </div>
                        <h3 className="public-card h3">Sauti ya Ubora wa Juu</h3>
                        <p className="public-card p">
                            Premium offline playback and background listening features for an uninterrupted spiritual journey.
                        </p>
                    </div>

                    <div className="public-card">
                        <div className="icon amber">
                            <FaUsers className="svg" size={24} />
                        </div>
                        <h3 className="public-card h3">Support Kwaya</h3>
                        <p className="public-card p">
                            Direct subscription payouts to verified Kwaya managers through integrated financial systems.
                        </p>
                    </div>

                    <div className="public-card last">
                        <div className="icon purple">
                            <FaBolt className="svg" size={24} />
                        </div>
                        <h3 className="public-card h3">Usawazishaji wa Papo Hapo</h3>
                        <p className="public-card p">
                            Real-time payment notifications and instantaneous premium unlocks powered by Laravel Reverb.
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '48px', textAlign: 'center', padding: '32px 24px', background: 'linear-gradient(135deg, rgba(184,134,11,0.15), rgba(184,134,11,0.05))', borderRadius: '16px', border: '1px solid rgba(184,134,11,0.3)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>☕</div>
                    <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.4rem' }}>Buy Us a Coffee</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', maxWidth: '500px', margin: '0 auto 20px' }}>
                        Help us improve Acapella and support the artists. Every contribution makes a difference.
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
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <FaHeart /> Donate Now
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}

Welcome.propTypes = {
    stats: PropTypes.shape({
        choirs: PropTypes.number,
        tracks: PropTypes.number,
    }),
};
