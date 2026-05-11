'use client';

import { useRef, useEffect } from 'react';

interface CrystallineCubeProps {
  className?: string;
  size?: number;
  dotColor?: string;
  mouseX?: number;
  mouseY?: number;
  mouseActive?: boolean;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function CrystallineCube({
  className = '',
  size = 280,
  dotColor = 'rgba(255, 255, 255,',
  mouseX,
  mouseY,
  mouseActive,
}: CrystallineCubeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  // Update internal mouse state from props if they exist
  useEffect(() => {
    if (mouseX !== undefined && mouseY !== undefined) {
      mouseRef.current = { x: mouseX, y: mouseY, active: !!mouseActive };
    }
  }, [mouseX, mouseY, mouseActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const GLOBAL_SPEED = 0.35;
    const centerX = size / 2;
    const centerY = size / 2;
    const fov = 250;
    const gridSize = 7;
    const spacing = size * 0.055;
    const cubeHalfSize = ((gridSize - 1) * spacing) / 2;
    const maxDist = Math.hypot(cubeHalfSize, cubeHalfSize, cubeHalfSize);

    // Disperse settings
    const disperseRadius = size * 0.35;
    const disperseStrength = size * 0.15;

    const points: { x: number; y: number; z: number }[] = [];
    for (let x = 0; x < gridSize; x++)
      for (let y = 0; y < gridSize; y++)
        for (let z = 0; z < gridSize; z++)
          points.push({
            x: x * spacing - cubeHalfSize,
            y: y * spacing - cubeHalfSize,
            z: z * spacing - cubeHalfSize,
          });

    // Track displaced positions for smooth lerp
    const displaced: { x: number; y: number }[] = points.map(() => ({ x: 0, y: 0 }));

    let time = 0;
    let lastTime = 0;

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999, active: false };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    function animate(timestamp: number) {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.0003 * GLOBAL_SPEED;

      ctx!.clearRect(0, 0, size, size);

      const rotX = time * 2;
      const rotY = time * 3;
      const waveRadius = (timestamp * 0.04 * GLOBAL_SPEED) % (maxDist * 1.5);
      const waveWidth = 40;
      const displacementMagnitude = 10;
      const pointsToDraw: { x: number; y: number; z: number; size: number; opacity: number }[] = [];

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mouseRef.current.active;

      points.forEach((p_orig, idx) => {
        let { x, y, z } = p_orig;
        const distFromCenter = Math.hypot(x, y, z);
        const distToWave = Math.abs(distFromCenter - waveRadius);
        let displacementAmount = 0;

        if (distToWave < waveWidth / 2) {
          const wavePhase = (distToWave / (waveWidth / 2)) * (Math.PI / 2);
          displacementAmount = easeInOutCubic(Math.cos(wavePhase)) * displacementMagnitude;
        }

        if (displacementAmount > 0 && distFromCenter > 0) {
          const ratio = (distFromCenter + displacementAmount) / distFromCenter;
          x *= ratio;
          y *= ratio;
          z *= ratio;
        }

        // Rotate Y
        const cY = Math.cos(rotY);
        const sY = Math.sin(rotY);
        let tX = x * cY - z * sY;
        let tZ = x * sY + z * cY;
        x = tX;
        z = tZ;

        // Rotate X
        const cX = Math.cos(rotX);
        const sX = Math.sin(rotX);
        const tY = y * cX - z * sX;
        tZ = y * sX + z * cX;
        y = tY;
        z = tZ;

        const scale = fov / (fov + z);
        let pX = centerX + x * scale;
        let pY = centerY + y * scale;

        let bloomAmount = 0;

        // Mouse disperse effect and bloom
        if (mouseActive) {
          const dxm = pX - mx;
          const dym = pY - my;
          const distToMouse = Math.sqrt(dxm * dxm + dym * dym);

          if (distToMouse < disperseRadius && distToMouse > 0) {
            const force = (disperseRadius - distToMouse) / disperseRadius;
            const angle = Math.atan2(dym, dxm);
            const targetOffX = Math.cos(angle) * force * (size * 0.22);
            const targetOffY = Math.sin(angle) * force * (size * 0.22);
            displaced[idx].x += (targetOffX - displaced[idx].x) * 0.15;
            displaced[idx].y += (targetOffY - displaced[idx].y) * 0.15;
            bloomAmount = force * 0.8;
          } else {
            displaced[idx].x += (0 - displaced[idx].x) * 0.08;
            displaced[idx].y += (0 - displaced[idx].y) * 0.08;
          }
        } else {
          displaced[idx].x += (0 - displaced[idx].x) * 0.08;
          displaced[idx].y += (0 - displaced[idx].y) * 0.08;
        }

        pX += displaced[idx].x;
        pY += displaced[idx].y;

        const waveInfluence = displacementAmount / displacementMagnitude;
        const dotSize = (1.5 + waveInfluence * 2.5 + bloomAmount * 3) * scale;
        const opacity = Math.max(0.1, scale * 0.7 + waveInfluence * 0.4 + bloomAmount * 0.5);

        if (dotSize > 0.1) {
          pointsToDraw.push({ x: pX, y: pY, z, size: dotSize, opacity });
        }
      });

      // Sort back-to-front for proper depth
      pointsToDraw
        .sort((a, b) => a.z - b.z)
        .forEach((p) => {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx!.fillStyle = `${dotColor} ${p.opacity})`;
          ctx!.fill();
        });

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [size, dotColor]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
