import MainLayout from '../../Layout/MainLayout';
import '../../../css/public.css';
import '../../../css/guest.css';

export default function Terms() {
    return (
        <MainLayout>
            <div className="public-page public-container">
                <div className="public-header">
                    <h1 className="public-header h1">Terms of Service</h1>
                    <p className="public-header p small">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="public-prose">
                    <h2 className="public-prose h2">1. Acceptance of Terms</h2>
                    <p className="public-prose p">
                        By accessing and using the Acapella platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
                    </p>

                    <h2 className="public-prose h2">2. Description of Service</h2>
                    <p className="public-prose p">
                        Acapella provides a digital platform for streaming Christian Kwaya music, facilitating subscriptions, and supporting local choirs. We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.
                    </p>

                    <h2 className="public-prose h2">3. User Conduct and Content</h2>
                    <p className="public-prose p">
                        Watumiaji are responsible for all activity that occurs under their account. Choir Managers are solely responsible for the audio files and imagery they upload, ensuring they hold the necessary copyrights and permissions. Acapella reserves the right to remove content that violates copyright laws or our community guidelines.
                    </p>

                    <h2 className="public-prose h2">4. Premium Usajili</h2>
                    <p className="public-prose p">
                        Premium subscriptions are billed monthly via integrated mobile money services. Payments are non-refundable except as required by law. Watumiaji may cancel their subscription at any time to avoid future charges.
                    </p>

                    <h2 className="public-prose h2">5. Intellectual Property</h2>
                    <p className="public-prose p">
                        All original content, features, and functionality of the Acapella platform are owned by Acapella and are protected by international copyright, trademark, and other intellectual property laws. Uploaded music remains the property of the respective choirs.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
