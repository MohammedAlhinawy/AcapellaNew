import MainLayout from '../../Layout/MainLayout';
import { Link } from '@inertiajs/react';
import { FaMicrophone, FaUsers, FaChartLine, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import '../../../css/requests.css';

export default function BecomeChoirManager() {
    return (
        <MainLayout>
            <div className="req-page">
                <div className="req-hero">
                    <span className="req-badge">For Choir Leaders</span>
                    <h1>Become a <span className="gradient-text">Choir Manager</span></h1>
                    <p>
                        Join Acapella as a verified choir manager and share your music with thousands of listeners across Tanzania.
                        Manage albums, upload tracks, and earn directly from premium subscriptions.
                    </p>
                </div>

                <div className="req-info-grid">
                    <div className="req-info-card">
                        <div className="icon"><FaMicrophone /></div>
                        <h3>Upload Your Music</h3>
                        <p>Publish your choir&rsquo;s albums and tracks to a curated catalog enjoyed by listeners nationwide.</p>
                    </div>
                    <div className="req-info-card">
                        <div className="icon"><FaUsers /></div>
                        <h3>Reach More Fans</h3>
                        <p>Get discovered through smart recommendations and connect with a passionate audience.</p>
                    </div>
                    <div className="req-info-card">
                        <div className="icon"><FaChartLine /></div>
                        <h3>Track Performance</h3>
                        <p>Monitor plays, likes, and listener engagement with a clean analytics dashboard.</p>
                    </div>
                    <div className="req-info-card">
                        <div className="icon"><FaShieldAlt /></div>
                        <h3>Verified Status</h3>
                        <p>Earn the verified badge after admin approval — building trust with your listeners.</p>
                    </div>
                </div>

                <div className="req-cta">
                    <Link href="/become-choir-manager/submit" className="req-btn">
                        Submit Your Request <FaArrowRight />
                    </Link>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '12px' }}>
                        Reviewed within 2-3 business days. Credentials sent via email upon approval.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
