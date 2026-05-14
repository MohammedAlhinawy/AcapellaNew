import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Terms() {
    return (
        <MainLayout>
            <Head title="Terms of Service" />
            
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-white/50 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="prose prose-invert prose-amber max-w-none text-white/80">
                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-4">
                        By accessing and using the Acapella platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Description of Service</h2>
                    <p className="mb-4">
                        Acapella provides a digital platform for streaming Christian Kwaya music, facilitating subscriptions, and supporting local choirs. We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. User Conduct and Content</h2>
                    <p className="mb-4">
                        Watumiaji are responsible for all activity that occurs under their account. Choir Managers are solely responsible for the audio files and imagery they upload, ensuring they hold the necessary copyrights and permissions. Acapella reserves the right to remove content that violates copyright laws or our community guidelines.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Premium Usajili</h2>
                    <p className="mb-4">
                        Premium subscriptions are billed monthly via integrated mobile money services. Payments are non-refundable except as required by law. Watumiaji may cancel their subscription at any time to avoid future charges.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Intellectual Property</h2>
                    <p className="mb-4">
                        All original content, features, and functionality of the Acapella platform are owned by Acapella and are protected by international copyright, trademark, and other intellectual property laws. Uploaded music remains the property of the respective choirs.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
