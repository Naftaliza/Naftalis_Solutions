// Option 3: "Cyber Grid" — perspective horizon grid, dark cyberpunk aesthetic
export default function CyberGrid() {
  return (
    <>
      <style>{`
        @keyframes gridScroll {
          from { background-position: 0 0; }
          to { background-position: 0 80px; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .cyber-scanline {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(20,184,166,0.4), transparent);
          animation: scanline 6s linear infinite;
        }
        .horizon-glow {
          animation: glow-pulse 3s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: '#040d1a' }}>

        {/* Perspective floor grid */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: '60%',
            backgroundImage: `
              linear-gradient(rgba(20,184,166,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(20,184,166,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            animation: 'gridScroll 2s linear infinite',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            transform: 'perspective(500px) rotateX(45deg)',
            transformOrigin: 'bottom center',
          }}
        />

        {/* Horizon glow line */}
        <div
          className="horizon-glow absolute left-0 right-0"
          style={{
            top: '42%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, #14b8a6 20%, #5eead4 50%, #14b8a6 80%, transparent 100%)',
            boxShadow: '0 0 20px 4px rgba(20,184,166,0.5), 0 0 60px 10px rgba(20,184,166,0.2)',
          }}
        />

        {/* Star field */}
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 50 + '%',
              left: Math.random() * 100 + '%',
              background: 'white',
              opacity: Math.random() * 0.6 + 0.1,
            }}
          />
        ))}

        {/* Scan line effect */}
        <div className="cyber-scanline" style={{ top: 0 }} />

        {/* Vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(4,13,26,0.8) 100%)',
          }}
        />
      </div>
    </>
  );
}
