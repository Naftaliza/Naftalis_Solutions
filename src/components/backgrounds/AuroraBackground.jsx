// Option 2: "Aurora Flow" — soft animated gradient blobs, light background
export default function AuroraBackground() {
  return (
    <>
      <style>{`
        @keyframes aurora1 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          33% { transform: translate(5%, -8%) scale(1.1); }
          66% { transform: translate(-4%, 6%) scale(0.95); }
        }
        @keyframes aurora2 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          33% { transform: translate(-6%, 5%) scale(1.05); }
          66% { transform: translate(4%, -6%) scale(1.1); }
        }
        @keyframes aurora3 {
          0%, 100% { transform: translate(0%, 0%) scale(1.05); }
          50% { transform: translate(3%, 4%) scale(0.95); }
        }
        .aurora-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          mix-blend-mode: multiply;
        }
      `}</style>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50">
        <div
          className="aurora-blob"
          style={{
            width: '60vw', height: '60vw',
            top: '-20%', left: '-10%',
            background: 'radial-gradient(circle, #14b8a6, #0d9488)',
            animation: 'aurora1 12s ease-in-out infinite',
          }}
        />
        <div
          className="aurora-blob"
          style={{
            width: '50vw', height: '50vw',
            top: '30%', right: '-15%',
            background: 'radial-gradient(circle, #5eead4, #99f6e4)',
            animation: 'aurora2 15s ease-in-out infinite',
          }}
        />
        <div
          className="aurora-blob"
          style={{
            width: '45vw', height: '45vw',
            bottom: '-10%', left: '25%',
            background: 'radial-gradient(circle, #0f766e, #134e4a)',
            animation: 'aurora3 18s ease-in-out infinite',
          }}
        />
        {/* Noise overlay for texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
            opacity: 0.4,
          }}
        />
      </div>
    </>
  );
}
