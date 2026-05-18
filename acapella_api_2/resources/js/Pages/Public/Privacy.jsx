import MainLayout from '../../Layout/MainLayout';
import '../../../css/public.css';
import '../../../css/guest.css';

export default function Privacy() {
    return (
        <MainLayout>
            <div className="public-page public-container">
                <div className="public-header">
                    <h1 className="public-header h1">Privacy Policy</h1>
                    <p className="public-header p small">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="public-prose">
                    <h2 className="public-prose h2">1. Information We Collect</h2>
                    <p className="public-prose p">
                        At Acapella, we collect information that you provide directly to us, such as your name, email address, and phone number (if you use mobile money for subscriptions). We also automatically collect certain information about your device and how you interact with our platform.
                    </p>

                    <h2 className="public-prose h2">2. How We Use Your Information</h2>
                    <p className="public-prose p">
                        We use the information we collect to provide, maintain, and improve our services, to process transactions (such as premium subscriptions via Snippe), and to communicate with you. Your data helps us personalize your experience and recommend Kwaya music you might enjoy.
                    </p>

                    <h2 className="public-prose h2">3. Data Sharing and Security</h2>
                    <p className="public-prose p">
                        We do not sell your personal information. We only share data with third-party service providers (like payment processors) when absolutely necessary to operate our service. We implement robust security measures to protect your data from unauthorized access or disclosure.
                    </p>

                    <h2 className="public-prose h2">4. Your Rights</h2>
                    <p className="public-prose p">
                        You have the right to access, update, or delete your personal information. You can manage your account settings directly within the app or contact our support team for assistance.
                    </p>

                    <h2 className="public-prose h2">5. Contact Us</h2>
                    <p className="public-prose p">
                        If you have any questions about this Privacy Policy, please contact us at privacy@acapella.tz.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
