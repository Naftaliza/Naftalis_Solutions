import { useEffect, useRef } from 'react';

export default function HoloCity() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fov = 600;
    const camY = 80;
    const project = (x, y, z) => {
      const dz = fov + z;
      if (dz <= 0) return null;
      const scale = fov / dz;
      return {
        x: canvas.width / 2 + x * scale,
        y: canvas.height * 0.45 + y * scale,
        scale,
      };
    };

    // Particles
    const particles = Array.from({ length: 120 }, () => ({
      x: (Math.random() - 0.5) * 1000,
      y: (Math.random() - 0.5) * 300 - 50,
      z: Math.random() * 700 - 100,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.08,
      vz: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 2 + 1,
      pulse: Math.random() * Math.PI * 2,
      isCyan: Math.random() > 0.4,
    }));

    // Holographic screens
    const screens = [
      { x: -420, y: -260, z: 80,  w: 130, h: 85,  type: 'bars',    phase: 0 },
      { x: -260, y: -320, z: 40,  w: 110, h: 72,  type: 'line',    phase: 1.2 },
      { x:   20, y: -360, z: 10,  w: 100, h: 68,  type: 'network', phase: 2.4 },
      { x:  280, y: -310, z: 60,  w: 120, h: 78,  type: 'bars',    phase: 0.8 },
      { x:  430, y: -265, z: 100, w: 115, h: 80,  type: 'line',    phase: 1.8 },
    ];

    // City buildings
    const buildings = Array.from({ length: 24 }, (_, i) => ({
      x: (i - 12) * 75 + (Math.random() - 0.5) * 30,
      height: Math.random() * 240 + 60,
      width:  Math.random() * 35 + 18,
      z: 320 + Math.random() * 250,
    }));

    // Circuit traces on floor
    const buildTrace = () => {
      const segs = [];
      let x = (Math.random() - 0.5) * 700;
      let z = Math.random() * 500 + 50;
      for (let i = 0; i < 6; i++) {
        const nx = x + (Math.random() - 0.5) * 120;
        const nz = z + Math.random() * 60 + 20;
        segs.push({ x1: x, z1: z, x2: nx, z2: nz });
        x = nx; z = nz;
      }
      return { segs, progress: Math.random() };
    };
    const traces = Array.from({ length: 18 }, buildTrace);

    const drawScreen = (p, screen, alpha) => {
      const sw = screen.w * p.scale;
      const sh = screen.h * p.scale;
      const sx = p.x - sw / 2;
      const sy = p.y - sh / 2;

      // Background
      ctx.fillStyle = `rgba(0,15,50,${alpha * 0.55})`;
      ctx.fillRect(sx, sy, sw, sh);

      // Border
      ctx.strokeStyle = `rgba(0,210,255,${alpha * 0.9})`;
      ctx.lineWidth = p.scale * 1.2;
      ctx.strokeRect(sx, sy, sw, sh);

      // Corner brackets
      const cs = 7 * p.scale;
      ctx.strokeStyle = `rgba(150,80,255,${alpha})`;
      ctx.lineWidth = p.scale * 2;
      [[sx, sy, 1, 1], [sx+sw, sy, -1, 1], [sx, sy+sh, 1, -1], [sx+sw, sy+sh, -1, -1]].forEach(([cx2, cy2, dx, dy]) => {
        ctx.beginPath(); ctx.moveTo(cx2, cy2 + dy*cs); ctx.lineTo(cx2, cy2); ctx.lineTo(cx2 + dx*cs, cy2); ctx.stroke();
      });

      // Content
      if (screen.type === 'bars') {
        for (let b = 0; b < 5; b++) {
          const bh = (0.35 + Math.sin(time * 0.025 + screen.phase + b * 1.1) * 0.22 + 0.18) * sh * 0.68;
          const bw = sw * 0.11;
          const bx = sx + sw * 0.09 + b * sw * 0.165;
          const grad = ctx.createLinearGradient(bx, sy + sh - sh*0.08 - bh, bx, sy + sh - sh*0.08);
          grad.addColorStop(0, `rgba(0,210,255,${alpha * 0.9})`);
          grad.addColorStop(1, `rgba(0,80,150,${alpha * 0.3})`);
          ctx.fillStyle = grad;
          ctx.fillRect(bx, sy + sh - sh*0.08 - bh, bw, bh);
        }
      } else if (screen.type === 'line') {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,210,255,${alpha})`;
        ctx.lineWidth = 1.5 * p.scale;
        for (let pt = 0; pt <= 12; pt++) {
          const px = sx + sw * 0.08 + pt * sw * 0.076;
          const py = sy + sh * 0.55 + Math.sin(time * 0.03 + screen.phase + pt * 0.7) * sh * 0.28;
          pt === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        // Fill under line
        ctx.lineTo(sx + sw * 0.92, sy + sh * 0.85);
        ctx.lineTo(sx + sw * 0.08, sy + sh * 0.85);
        ctx.closePath();
        ctx.fillStyle = `rgba(0,150,255,${alpha * 0.12})`;
        ctx.fill();
      } else if (screen.type === 'network') {
        const pts = Array.from({ length: 6 }, (_, i) => ({
          x: sx + sw * 0.15 + Math.cos(i * Math.PI/3 + time*0.015) * sw * 0.28 + sw*0.35,
          y: sy + sh * 0.15 + Math.sin(i * Math.PI/3 + time*0.015) * sh * 0.28 + sh*0.35,
        }));
        pts.forEach((a, i) => pts.forEach((b, j) => {
          if (i < j) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(100,180,255,${alpha*0.35})`; ctx.lineWidth = 0.7*p.scale; ctx.stroke();
          }
        }));
        pts.forEach(pt => {
          ctx.beginPath(); ctx.arc(pt.x, pt.y, 2.5*p.scale, 0, Math.PI*2);
          ctx.fillStyle = `rgba(0,210,255,${alpha})`; ctx.fill();
        });
      }
    };

    const draw = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, '#010614');
      bg.addColorStop(0.45, '#030d22');
      bg.addColorStop(1, '#010818');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      if (time === 1) {
        canvas._stars = Array.from({ length: 80 }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.45,
          r: Math.random() * 1.2 + 0.2,
          a: Math.random() * 0.5 + 0.1,
        }));
      }
      (canvas._stars || []).forEach(s => {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(180,220,255,${s.a})`; ctx.fill();
      });

      // City buildings
      buildings.forEach(b => {
        const bp = project(b.x, camY, b.z);
        const tp = project(b.x, camY - b.height, b.z);
        if (!bp || !tp) return;
        const bw = b.width * bp.scale;
        ctx.fillStyle = `rgba(2,12,35,${Math.min(bp.scale*2, 0.9)})`;
        ctx.strokeStyle = `rgba(0,80,180,${Math.min(bp.scale*1.8, 0.6)})`;
        ctx.lineWidth = 0.5;
        ctx.fillRect(bp.x - bw/2, tp.y, bw, bp.y - tp.y);
        ctx.strokeRect(bp.x - bw/2, tp.y, bw, bp.y - tp.y);
        // Window lights
        for (let r = 1; r < 6; r++) {
          if (Math.sin(b.x * r * 7 + time * 0.005) > 0.4) {
            const wy = tp.y + (bp.y - tp.y) * r / 6;
            ctx.fillStyle = `rgba(0,180,255,${Math.min(bp.scale*0.8,0.35)})`;
            ctx.fillRect(bp.x - bw*0.2, wy, bw*0.4, 1.5*bp.scale);
          }
        }
      });

      // Perspective floor grid
      const hor = canvas.height * 0.44;
      const cx = canvas.width / 2;

      for (let i = -14; i <= 14; i++) {
        const spread = i * (canvas.width / 22);
        const a = Math.max(0, 0.35 - Math.abs(i) * 0.024);
        ctx.beginPath();
        ctx.moveTo(cx + spread * 0.08, hor);
        ctx.lineTo(cx + spread * 3.5, canvas.height + 100);
        ctx.strokeStyle = `rgba(0,90,200,${a})`; ctx.lineWidth = 0.6; ctx.stroke();
      }
      for (let i = 0; i < 12; i++) {
        const t = i / 12;
        const y = hor + (canvas.height - hor + 100) * (t * t);
        const spread = 0.08 + t * 3.42;
        ctx.beginPath();
        ctx.moveTo(cx - canvas.width * spread / 2, y);
        ctx.lineTo(cx + canvas.width * spread / 2, y);
        ctx.strokeStyle = `rgba(0,90,200,${t * 0.38})`; ctx.lineWidth = 0.6; ctx.stroke();
      }

      // Horizon glow
      const hg = ctx.createLinearGradient(0, hor - 20, 0, hor + 20);
      hg.addColorStop(0, 'transparent');
      hg.addColorStop(0.5, 'rgba(0,160,255,0.45)');
      hg.addColorStop(1, 'transparent');
      ctx.fillStyle = hg;
      ctx.fillRect(0, hor - 20, canvas.width, 40);

      // Circuit traces
      traces.forEach(tr => {
        tr.progress = (tr.progress + 0.004) % 1;
        tr.segs.forEach((seg, si) => {
          const p1 = project(seg.x1, camY, seg.z1);
          const p2 = project(seg.x2, camY, seg.z2);
          if (!p1 || !p2 || p1.y < hor || p2.y < hor) return;
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(120,50,255,0.3)'; ctx.lineWidth = 0.8; ctx.stroke();
          const sp = tr.progress * tr.segs.length - si;
          if (sp > 0 && sp < 1) {
            const px = p1.x + (p2.x - p1.x) * sp;
            const py = p1.y + (p2.y - p1.y) * sp;
            ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(160,80,255,0.95)'; ctx.fill();
            const glow = ctx.createRadialGradient(px, py, 0, px, py, 8);
            glow.addColorStop(0, 'rgba(160,80,255,0.4)'); glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI*2); ctx.fill();
          }
        });
      });

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.z += p.vz; p.pulse += 0.025;
        if (p.x >  500) p.x = -500;
        if (p.x < -500) p.x =  500;
        if (p.z >  600) p.z = -100;
        if (p.z < -100) p.z =  600;
        if (p.y >  200) p.y = -300;
        if (p.y < -300) p.y =  200;
        const proj = project(p.x, p.y, p.z);
        if (!proj || proj.scale > 2) return;
        const a = Math.min(proj.scale, 0.95) * (0.55 + Math.sin(p.pulse) * 0.35);
        const r = p.r * proj.scale;
        const c = p.isCyan ? `rgba(0,210,255,${a})` : `rgba(170,90,255,${a})`;
        ctx.beginPath(); ctx.arc(proj.x, proj.y, r, 0, Math.PI*2);
        ctx.fillStyle = c; ctx.fill();
        const glow = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, r*5);
        glow.addColorStop(0, c); glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(proj.x, proj.y, r*5, 0, Math.PI*2); ctx.fill();
      });

      // Particle connections
      const projs = particles.map(p => project(p.x, p.y, p.z));
      for (let i = 0; i < particles.length; i++) {
        if (!projs[i]) continue;
        for (let j = i + 1; j < particles.length; j++) {
          if (!projs[j]) continue;
          const dist = Math.hypot(projs[i].x - projs[j].x, projs[i].y - projs[j].y);
          if (dist < 100) {
            const a = (1 - dist/100) * 0.28 * Math.min(projs[i].scale, projs[j].scale);
            ctx.beginPath(); ctx.moveTo(projs[i].x, projs[i].y); ctx.lineTo(projs[j].x, projs[j].y);
            ctx.strokeStyle = `rgba(80,190,255,${a})`; ctx.lineWidth = 0.6; ctx.stroke();
          }
        }
      }

      // Holographic screens
      screens.forEach((screen, i) => {
        const fy = screen.y + Math.sin(time * 0.018 + screen.phase) * 10;
        const p = project(screen.x, fy, screen.z);
        if (!p || p.scale > 1.8 || p.scale < 0.05) return;
        const alpha = Math.min(p.scale * 1.4, 0.88);
        drawScreen(p, screen, alpha);
      });

      // Geometric crystal (right quadrant)
      const crX = canvas.width * 0.71;
      const crY = canvas.height * 0.44 + Math.sin(time * 0.022) * 8;
      const crS = 65 + Math.sin(time * 0.018) * 4;

      const verts = [
        [0, -1.0],
        [0.87, 0.5], [-0.87, 0.5],
        [0.5, 0.2], [-0.5, 0.2], [0, -0.3],
      ];
      const faces2 = [
        { pts: [0, 1, 3], col: 'rgba(0,180,255,0.28)' },
        { pts: [0, 2, 4], col: 'rgba(80,120,255,0.22)' },
        { pts: [1, 2, 3], col: 'rgba(0,140,200,0.20)' },
        { pts: [3, 4, 5], col: 'rgba(0,100,180,0.18)' },
      ];
      faces2.forEach(f => {
        ctx.beginPath();
        f.pts.forEach((vi, i2) => {
          const [fx, fy2] = verts[vi];
          i2 === 0 ? ctx.moveTo(crX + fx*crS, crY + fy2*crS) : ctx.lineTo(crX + fx*crS, crY + fy2*crS);
        });
        ctx.closePath();
        ctx.fillStyle = f.col; ctx.fill();
        ctx.strokeStyle = 'rgba(0,220,255,0.75)'; ctx.lineWidth = 1.2; ctx.stroke();
      });
      const crGlow = ctx.createRadialGradient(crX, crY, 0, crX, crY, crS * 1.8);
      crGlow.addColorStop(0, 'rgba(0,180,255,0.18)');
      crGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = crGlow;
      ctx.beginPath(); ctx.arc(crX, crY, crS * 1.8, 0, Math.PI*2); ctx.fill();

      // Vignette
      const vig = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height*0.25, canvas.width/2, canvas.height/2, canvas.height);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(1,4,18,0.75)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
