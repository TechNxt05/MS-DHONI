import LegacyClient from './LegacyClient';

export const metadata = {
    title: 'Legacy | MS Dhoni',
    description: 'What the world says about the Captain Cool.',
};

export default function LegacyPage() {
    return (
        <main className="min-h-screen bg-[#1a1a1a] relative overflow-x-hidden">
            {/* Background Texture */}
            {/* Background Texture - Removed missing noise.png */}
            <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none z-0 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-br from-csk-yellow/10 via-black to-india-blue/20 pointer-events-none z-0" />

            {/* Title */}
            <div className="relative z-10 pt-32 pb-10 text-center pointer-events-none">
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-csk-yellow to-white drop-shadow-[0_4px_0_rgba(0,0,0,1)]">
                    The Legacy
                </h1>
                <p className="text-xl text-zinc-400 font-bold tracking-widest uppercase mt-4">
                    Legends on the Legend
                </p>
            </div>

            <LegacyClient />
        </main>
    );
}
