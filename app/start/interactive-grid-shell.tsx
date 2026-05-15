'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import * as THREE from 'three';

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec2 iMouse;
  uniform float iGridSize;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec2 mouse = (iMouse - 0.5 * iResolution.xy) / iResolution.y;
    float t = iTime * 0.14;

    float mouseDist = length(uv - mouse);
    float mouseField = smoothstep(0.36, 0.0, mouseDist);
    vec2 direction = normalize(uv - mouse + 0.0001);
    float warp = sin(mouseDist * 18.0 - t * 5.0) * 0.032 * mouseField;
    vec2 warpedUv = uv + direction * warp;

    vec2 pixel = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);
    vec2 gridCoord = (pixel + direction * warp * iResolution.y) / iGridSize;
    vec2 gridFrac = fract(gridCoord);
    vec2 gridDistance = min(gridFrac, 1.0 - gridFrac) * iGridSize;
    float line = 1.0 - smoothstep(0.2, 0.72, min(gridDistance.x, gridDistance.y));

    vec3 gridColor = vec3(0.082, 0.078, 0.098);
    vec3 brandOrange = vec3(0.988, 0.431, 0.125);

    float pulse = sin(warpedUv.x * 18.0 + t * 4.0) * sin(warpedUv.y * 18.0 - t * 3.2);
    pulse = smoothstep(0.78, 1.0, pulse);
    float cursorGlow = smoothstep(0.18, 0.0, mouseDist) * 0.55;
    float noise = random(warpedUv + t) * 0.018;

    vec3 color = gridColor * line * 0.42;
    color += brandOrange * pulse * line * 0.62;
    color += brandOrange * cursorGlow * 0.16;
    color += gridColor * noise;

    float alpha = line * 0.052 + pulse * line * 0.18 + cursorGlow * 0.09 + noise;
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.28));
  }
`;

export function InteractiveGridShell({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(1, 1) },
      iMouse: { value: new THREE.Vector2(0, 0) },
      iGridSize: { value: 112 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      material.dispose();
      geometry.dispose();
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.className =
      'pointer-events-none absolute inset-0 h-full w-full';
    container.appendChild(renderer.domElement);

    const setMouseFromEvent = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      uniforms.iMouse.value.set(
        event.clientX - rect.left,
        rect.height - (event.clientY - rect.top),
      );
    };

    const resize = () => {
      if (!renderer) return;
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      renderer.setSize(width, height, false);
      uniforms.iResolution.value.set(width, height);
      uniforms.iMouse.value.set(width * 0.5, height * 0.55);
    };

    const animate = () => {
      if (!renderer) return;
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener('pointermove', setMouseFromEvent, { passive: true });
    resize();
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', setMouseFromEvent);
      resizeObserver.disconnect();
      if (renderer?.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      material.dispose();
      geometry.dispose();
      renderer?.dispose();
    };
  }, [reducedMotion]);

  return (
    <section className="relative overflow-hidden bg-[#F0EFED]">
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(21,20,25,0.019)_1px,transparent_1px),linear-gradient(180deg,rgba(21,20,25,0.017)_1px,transparent_1px)] bg-[size:112px_112px]"
      />
      {children}
    </section>
  );
}
