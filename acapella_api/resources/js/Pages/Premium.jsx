import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';
import GlassCard from '../Components/GlassCard';

export default function Premium({ auth, verifiedKwayaCount = 0 }) {
    return (
        <AppLayout user={auth?.user}>
            <Head title="Premium" />
            
            <div className="max-w-4xl mx-auto py-12">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        Elevate your spiritual <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">
                            listening experience.
                        </span>
                    </h2>
                    <p className="text-xl text-white/60 font-light max-w-2xl mx-auto">
                        Fungua uwezo wa kusikiliza nyuma ya skrini na kupakua nyimbo huku ukisaidia kwaya zako za kitanzania unazozipenda kupitia Mongike.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Free Tier */}
                    <div className="p-8 rounded-3xl border border-white/10 bg-white/5 opacity-70">
                        <h3 className="text-2xl font-bold text-white mb-2">Basic Access</h3>
                        <p className="text-white/50 text-sm mb-6">Free forever</p>
                        
                        <div className="text-4xl font-bold text-white mb-8">
                            TSh 0<span className="text-lg text-white/50 font-normal">/mo</span>
                        </div>

                        <ul className="space-y-4 mb-8 text-white/70 text-sm">
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Ad-supported streaming
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Access to standard catalog
                            </li>
                            <li className="flex items-center gap-3 opacity-40">
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                No Background Play
                            </li>
                            <li className="flex items-center gap-3 opacity-40">
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                No Offline Downloads
                            </li>
                        </ul>

                        <button className="w-full py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition font-semibold">
                            Current Plan
                        </button>
                    </div>

                    {/* Premium Tier */}
                    <GlassCard className="relative !p-8 border-amber-500/30 overflow-hidden">
                        <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                            Recommended
                        </div>

                        <div className="absolute -z-10 w-64 h-64 bg-amber-500/20 blur-[100px] rounded-full top-0 right-0 pointer-events-none"></div>

                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600 mb-2">Premium Unlocked</h3>
                        <p className="text-amber-200/50 text-sm mb-6">Billed monthly via Mobile Money</p>
                        
                        <div className="text-4xl font-bold text-white mb-2">
                            TSh 5,000<span className="text-lg text-white/50 font-normal">/mo</span>
                        </div>
                        <p className="text-xs text-white/40 mb-8">Prices inclusive of VAT. Cancel anytime.</p>

                        <ul className="space-y-4 mb-8 text-white/80 text-sm font-medium">
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Uninterrupted Background Play
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Sauti ya Ubora wa Juu Bitrates
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Unlimited Offline Downloads (Encrypted)
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Support {verifiedKwayaCount > 0 ? verifiedKwayaCount : 'our'} Kwaya verified creators directly
                            </li>
                        </ul>

                        <button className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:scale-[1.02] transition-all font-bold flex justify-center items-center gap-3">
                            Subscribe with Mobile Money
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </button>

                        <div className="mt-4 flex justify-center gap-2 items-center opacity-70">
                            {/* Generic payment operator pill boxes representing Snippe */}
                            <span className="text-[10px] uppercase font-bold text-white/50 bg-white/5 border border-white/10 px-2 py-1 rounded">M-Pesa</span>
                            <span className="text-[10px] uppercase font-bold text-white/50 bg-white/5 border border-white/10 px-2 py-1 rounded">Tigo Pesa</span>
                            <span className="text-[10px] uppercase font-bold text-white/50 bg-white/5 border border-white/10 px-2 py-1 rounded">Airtel</span>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AppLayout>
    );
}
