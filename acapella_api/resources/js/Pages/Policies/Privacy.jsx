import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Privacy() {
    return (
        <MainLayout>
            <Head title="Privacy Policy" />
            
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-white/50 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="prose prose-invert prose-amber max-w-none text-white/80">
                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
                    <p className="mb-4">
                        At Acapella, we collect information that you provide directly to us, such as your name, email address, and phone number (if you use mobile money for subscriptions). We also automatically collect certain information about your device and how you interact with our platform.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h2>
                    <p className="mb-4">
                        We use the information we collect to provide, maintain, and improve our services, to process transactions (such as premium subscriptions via Snippe), and to communicate with you. Your data helps us personalize your experience and recommend Kwaya music you might enjoy.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Data Sharing and Security</h2>
                    <p className="mb-4">
                        We do not sell your personal information. We only share data with third-party service providers (like payment processors) when absolutely necessary to operate our service. We implement robust security measures to protect your data from unauthorized access or disclosure.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Your Rights</h2>
                    <p className="mb-4">
                        You have the right to access, update, or delete your personal information. You can manage your account settings directly within the app or contact our support team for assistance.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Contact Us</h2>
                    <p className="mb-4">
                        If you have any questions about this Privacy Policy, please contact us at privacy@acapella.tz.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
