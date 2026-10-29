'use client';
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  swaySpeed: number;
  swayOffset: number;
  opacity: number;
  maxOpacity: number;
  color: string;
  glowColor: string;
  life: number;
  maxLife: number;
  isAmbientOrb?: boolean;
  isEruptionBurst?: boolean;
}

export default function HeroEmberOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const emberCount = isMobile ? 45 : 75;
    const orbCount = isMobile ? 10 : 20;

    // Palette matching the volcanic eruption in the reference picture:
    // Molten gold, fiery incandescent orange, brilliant white-hot sparks, and crimson ember embers
    const volcanicColors = [
      { color: '254, 240, 138', glow: 'rgba(253, 224, 71, 0.95)' }, // yellow-200 (white-hot core)
      { color: '251, 191, 36', glow: 'rgba(245, 158, 11, 0.9)' },   // amber-400
      { color: '249, 115, 22', glow: 'rgba(234, 88, 12, 0.85)' },   // orange-500
      { color: '239, 68, 68', glow: 'rgba(225, 29, 72, 0.75)' },    // crimson / rose
    ];

    // Forest ambient delta orbs near the lush foliage (visible in reference image)
    const orbColors = [
      { color: '6, 182, 212', glow: 'rgba(6, 182, 212, 0.65)' },    // cyan-500
      { color: '234, 179, 8', glow: 'rgba(234, 179, 8, 0.65)' },    // amber-500
      { color: '52, 211, 153', glow: 'rgba(16, 185, 129, 0.55)' },  // emerald-400
    ];

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Creates an ember shooting up from the volcanic stump caldera
    const createVolcanicEmber = (initialWarmup = false): Particle => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Volcanic caldera mouth: center 42% to 58% horizontal, 47% to 54% vertical
      const originX = width * (0.50 + (Math.random() - 0.5) * 0.16);
      const originY = height * (0.47 + Math.random() * 0.07);

      const theme = volcanicColors[Math.floor(Math.random() * volcanicColors.length)];
      const maxLife = 120 + Math.random() * 150;
      const isBurst = Math.random() < 0.25;

      return {
        x: originX,
        y: initialWarmup ? originY - Math.random() * (height * 0.42) : originY,
        size: isBurst ? 2.4 + Math.random() * 2.2 : 1.2 + Math.random() * 1.8,
        speedY: -(isBurst ? 1.4 + Math.random() * 2.0 : 0.75 + Math.random() * 1.4),
        speedX: (Math.random() - 0.5) * 0.6,
        swaySpeed: 0.02 + Math.random() * 0.03,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: initialWarmup ? 0.2 + Math.random() * 0.7 : 0,
        maxOpacity: 0.65 + Math.random() * 0.35,
        color: theme.color,
        glowColor: theme.glow,
        life: initialWarmup ? Math.floor(Math.random() * maxLife) : 0,
        maxLife,
        isEruptionBurst: isBurst,
      };
    };

    // Creates a gentle forest firefly/orb along the sides
    const createOrb = (initialWarmup = false): Particle => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const isLeft = Math.random() > 0.5;
      const originX = isLeft
        ? width * (0.03 + Math.random() * 0.24)
        : width * (0.73 + Math.random() * 0.24);
      const originY = height * (0.22 + Math.random() * 0.58);

      const theme = orbColors[Math.floor(Math.random() * orbColors.length)];
      const maxLife = 240 + Math.random() * 200;

      return {
        x: originX,
        y: initialWarmup ? originY + (Math.random() - 0.5) * 60 : originY,
        size: 1.8 + Math.random() * 2.6,
        speedY: -(0.1 + Math.random() * 0.22),
        speedX: (Math.random() - 0.5) * 0.2,
        swaySpeed: 0.008 + Math.random() * 0.015,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: initialWarmup ? 0.2 + Math.random() * 0.5 : 0,
        maxOpacity: 0.35 + Math.random() * 0.45,
        color: theme.color,
        glowColor: theme.glow,
        life: initialWarmup ? Math.floor(Math.random() * maxLife) : 0,
        maxLife,
        isAmbientOrb: true,
      };
    };

    // Initialize particles across their lifecycle so they appear immediately
    particles = [
      ...Array.from({ length: emberCount }, () => createVolcanicEmber(true)),
      ...Array.from({ length: orbCount }, () => createOrb(true)),
    ];

    let lastTime = performance.now();

    const render = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 16.666, 2.5);
      lastTime = currentTime;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Dynamic Volcanic Heart Pulsing Aura at the Crater
      const craterX = width * 0.50;
      const craterY = height * 0.49;
      const pulseTime = currentTime * 0.003;
      const pulseRadius = 55 + Math.sin(pulseTime) * 12;

      const craterGrad = ctx.createRadialGradient(craterX, craterY, 4, craterX, craterY, pulseRadius);
      craterGrad.addColorStop(0, 'rgba(255, 243, 199, 0.45)');
      craterGrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.25)');
      craterGrad.addColorStop(0.75, 'rgba(239, 68, 68, 0.12)');
      craterGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.fillStyle = craterGrad;
      ctx.beginPath();
      ctx.ellipse(craterX, craterY, pulseRadius * 1.6, pulseRadius * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Render rising volcanic embers & floating delta orbs
      particles.forEach((p, idx) => {
        p.life += delta;
        p.y += p.speedY * delta;
        p.x += (p.speedX + Math.sin(p.swayOffset + p.life * p.swaySpeed) * 0.4) * delta;

        // Lifecycle fade
        const progress = p.life / p.maxLife;
        if (progress < 0.15) {
          p.opacity = (progress / 0.15) * p.maxOpacity;
        } else if (progress > 0.65) {
          p.opacity = ((1 - progress) / 0.35) * p.maxOpacity;
        } else {
          // Organic flame flicker
          p.opacity = p.maxOpacity * (0.85 + Math.sin(p.life * 0.14) * 0.15);
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
        ctx.shadowBlur = p.isAmbientOrb ? 12 : p.isEruptionBurst ? 14 : 8;
        ctx.shadowColor = p.glowColor;
        ctx.fillStyle = `rgb(${p.color})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra incandescent white core for erupting embers
        if (p.size > 2.0 && !p.isAmbientOrb) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Respawn when life expires or moves out of bounds
        if (p.life >= p.maxLife || p.y < height * 0.10 || p.y > height + 20) {
          particles[idx] = p.isAmbientOrb ? createOrb(false) : createVolcanicEmber(false);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-15"
      aria-hidden="true"
    />
  );
}
