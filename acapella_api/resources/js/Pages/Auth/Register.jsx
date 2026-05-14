import { Head, Link, useForm } from '@inertiajs/react';
import GlassCard from '../../Components/GlassCard';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
            
            <Head title="Jisajili" />

            <div className="w-full max-w-md relative z-10">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Acapella Logo" className="w-10 h-10 object-contain shadow-[0_0_20px_rgba(217,119,6,0.3)] rounded-full" />
                        <h1 className="font-serif text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                            Acapella
                        </h1>
                    </Link>
                </div>

                <GlassCard className="!p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-center tracking-tight">Create your account</h2>
                    
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-light"
                                placeholder="Your Name"
                            />
                            {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-light"
                                placeholder="name@example.com"
                            />
                            {errors.email && <div className="text-red-400 text-xs mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-light"
                                placeholder="••••••••"
                            />
                            {errors.password && <div className="text-red-400 text-xs mt-1">{errors.password}</div>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-light"
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            disabled={processing}
                            className="w-full bg-white text-black font-semibold py-3 rounded-full mt-6 hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex justify-center items-center gap-2"
                        >
                            Jisajili
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-white/50">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white hover:text-amber-400 font-medium transition-colors">
                            Log in
                        </Link>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
