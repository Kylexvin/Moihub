import React, { useState, useEffect, useCallback } from 'react';

// Previous constants and utility functions remain the same
const GRAVITY = 0.15;
const FRICTION = 0.99;
const randomRange = (min, max) => Math.random() * (max - min) + min;
const getRandomColor = () => {
  const colors = [
    '#ff0000', '#ffa500', '#ffff00', '#00ff00', '#00ffff', '#ff69b4',
    '#ff1493', '#9400d3', '#4b0082', '#ffffff'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Previous Particle component remains the same
const Particle = ({ x, y, color, type, pattern = 'circle' }) => {
  const [particles, setParticles] = useState(() => {
    const count = type === 'explosion' ? 100 : 1;
    return Array.from({ length: count }, (_, i) => {
      const angle = pattern === 'circle' 
        ? (i * Math.PI * 2) / count
        : randomRange(0, Math.PI * 2);
      const velocity = type === 'explosion' ? randomRange(2, 4) : randomRange(6, 8);
      return {
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        alpha: 1,
        size: type === 'explosion' ? randomRange(0.8, 2.5) : 2,
        sparkle: Math.random() > 0.5,
        twinkleSpeed: randomRange(0.03, 0.08)
      };
    });
  });

  useEffect(() => {
    let frame;
    const animate = () => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vx: p.vx * FRICTION,
            vy: p.vy * FRICTION + GRAVITY,
            alpha: p.alpha * 0.97,
            size: p.size * 0.98,
            sparkle: p.sparkle ? Math.sin(Date.now() * p.twinkleSpeed) * 0.5 + 0.5 : 1
          }))
          .filter(p => p.alpha > 0.1)
      );
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <g>
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.size * (p.sparkle ? p.sparkle : 1)}
          fill={color}
          opacity={p.alpha}
        >
          {p.sparkle && (
            <animate
              attributeName="opacity"
              values={`${p.alpha};${p.alpha * 0.5};${p.alpha}`}
              dur="0.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      ))}
    </g>
  );
};

// Previous Firework component remains the same
const Firework = ({ x, y, pattern }) => {
  const [stage, setStage] = useState('launch');
  const [color] = useState(getRandomColor);
  const [trailColor] = useState(getRandomColor);

  useEffect(() => {
    if (stage === 'launch') {
      const height = randomRange(20, 40);
      setTimeout(() => setStage('explosion'), 1000 * (height / 60));
    }
  }, [stage]);

  return (
    <>
      {stage === 'launch' && <Particle x={x} y={y} color={trailColor} type="trail" />}
      {stage === 'explosion' && <Particle x={x} y={y - 30} color={color} type="explosion" pattern={pattern} />}
    </>
  );
};

// Main component with original styling
const SpectacularFireworks = () => {
  const [fireworks, setFireworks] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const patterns = ['circle', 'random'];

  const launchFirework = useCallback(() => {
    const x = randomRange(20, 80);
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    setFireworks(prev => [...prev, { id: Date.now(), x, pattern }]);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const minInterval = 400;
    const maxInterval = 1200;
    let timeout;

    const scheduleNext = () => {
      const delay = randomRange(minInterval, maxInterval);
      timeout = setTimeout(() => {
        launchFirework();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => clearTimeout(timeout);
  }, [isActive, launchFirework]);

  useEffect(() => {
    const cleanup = setTimeout(() => {
      setIsActive(false);
      setFireworks([]);
    }, 12000);

    return () => clearTimeout(cleanup);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[999999] pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'transparent',
        zIndex: 999999, // Ensure it's above everything!
        pointerEvents: 'none',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect width="100" height="100" fill="transparent" />
        {fireworks.map(fw => (
          <Firework key={fw.id} x={fw.x} y={80} pattern={fw.pattern} />
        ))}
      </svg>
    </div>
  );
};

export default SpectacularFireworks;