'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
	sectionRef?: React.RefObject<HTMLElement | null>;
};

export function DottedSurface({ className, sectionRef, ...props }: DottedSurfaceProps) {
	const { theme } = useTheme();

	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		particles: THREE.Points[];
		animationId: number;
		count: number;
	} | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const SEPARATION = 80;
		const AMOUNTX = prefersReducedMotion ? 32 : 42;
		const AMOUNTY = prefersReducedMotion ? 18 : 24;

		const isDark = theme === 'dark';

		const scene = new THREE.Scene();
		scene.fog = new THREE.Fog(isDark ? 0x1a1a1a : 0xf0efed, 500, 2000);

		const camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			1,
			2000,
		);
		camera.position.set(0, 200, 500);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: false,
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x000000, 0);

		container.appendChild(renderer.domElement);

		const geometry = new THREE.BufferGeometry();
		const positions: number[] = [];
		const colors: number[] = [];

		const dotColor = isDark
			? [0.78, 0.78, 0.78]
			: [0.15, 0.15, 0.15];

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const y = 0;
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
				positions.push(x, y, z);
				colors.push(...dotColor);
			}
		}

		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: 4,
			vertexColors: true,
			transparent: true,
			opacity: 1,
			sizeAttenuation: true,
		});

		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId = 0;
		let observer: IntersectionObserver | null = null;
		let isVisible = false;

		const renderFrame = () => {
			const positionAttribute = geometry.attributes.position;
			const posArray = positionAttribute.array as Float32Array;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					const index = i * 3;
					posArray[index + 1] =
						Math.sin((ix + count) * 0.3) * 50 +
						Math.sin((iy + count) * 0.5) * 50;
					i++;
				}
			}

			positionAttribute.needsUpdate = true;

			if (sectionRef?.current) {
				const rect = sectionRef.current.getBoundingClientRect();
				const sectionH = sectionRef.current.offsetHeight;
				const progress = Math.max(0, Math.min(1, -rect.top / (sectionH - window.innerHeight || sectionH)));
				// Cap at 80% scroll so camera settles early and holds
				const cappedProgress = Math.min(progress / 0.8, 1);
				camera.position.y = 200 + cappedProgress * 100;
				camera.position.z = 500 - cappedProgress * 30;
				camera.lookAt(0, 0, 0);
			}

			renderer.render(scene, camera);
			if (!prefersReducedMotion) {
				count += 0.045;
			}
		};

		const animate = () => {
			if (!isVisible) {
				animationId = 0;
				return;
			}

			renderFrame();
			animationId = requestAnimationFrame(animate);
			if (sceneRef.current) {
				sceneRef.current.animationId = animationId;
			}
		};

		const start = () => {
			if (animationId || prefersReducedMotion) return;
			isVisible = true;
			animationId = requestAnimationFrame(animate);
		};

		const stop = () => {
			isVisible = false;
			if (animationId) {
				cancelAnimationFrame(animationId);
				animationId = 0;
			}
		};

		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderFrame();
		};

		window.addEventListener('resize', handleResize);
		renderFrame();

		sceneRef.current = {
			scene,
			camera,
			renderer,
			particles: [points],
			animationId,
			count,
		};

		if (!prefersReducedMotion) {
			observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						start();
					} else {
						stop();
					}
				},
				{ threshold: 0.05 },
			);
			observer.observe(container);
		}

		return () => {
			window.removeEventListener('resize', handleResize);
			observer?.disconnect();
			stop();
			if (sceneRef.current) {
				sceneRef.current.scene.traverse((object) => {
					if (object instanceof THREE.Points) {
						object.geometry.dispose();
						if (Array.isArray(object.material)) {
							object.material.forEach((m) => m.dispose());
						} else {
							object.material.dispose();
						}
					}
				});
				sceneRef.current.renderer.dispose();
				if (container && sceneRef.current.renderer.domElement) {
					container.removeChild(sceneRef.current.renderer.domElement);
				}
			}
		};
	}, [theme, sectionRef]);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none absolute inset-0', className)}
			{...props}
		/>
	);
}
