export default function GlassCard({ children, className = '' }) {
    return (
        <div className={`
            relative overflow-hidden rounded-2xl 
            backdrop-blur-[20px] bg-white/[0.03] 
            border border-white/[0.10] 
            shadow-[0_8px_32px_rgba(0,0,0,0.3)]
            transition-all duration-300 hover:bg-white/[0.05]
            hover:border-white/[0.15]
            ${className}
        `}>
            {/* Subtle inner highlight to make it look glassy */}
            <div className="absolute inset-0 rounded-2xl border border-white/[0.05] pointer-events-none" style={{ mixBlendMode: 'overlay' }} />
            
            <div className="relative z-10 p-6">
                {children}
            </div>
        </div>
    );
}
