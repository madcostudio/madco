"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MotionValue, useSpring } from "framer-motion";

interface TinyPlanetHeroProps {
  src?: string;
  scrollProgress: MotionValue<number>;
}

export function TinyPlanetHero({
  src = "/dealership_360.jpg",
  scrollProgress,
}: TinyPlanetHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRegularView, setIsRegularView] = useState(false);

  // Smooth spring physics for camera transformation driven by scroll
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Initialize Scene & Camera
    const scene = new THREE.Scene();
    // Start with wide FOV for Tiny Planet
    const camera = new THREE.PerspectiveCamera(135, width / height, 0.1, 1500);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // 2. Spherical Geometry for 360 Equirectangular Projection
    const geometry = new THREE.SphereGeometry(600, 72, 48);
    // Invert geometry for interior rendering
    geometry.scale(-1, 1, 1);

    // 3. Load Texture
    const textureLoader = new THREE.TextureLoader();
    let texture: THREE.Texture | null = null;
    let sphereMaterial: THREE.MeshBasicMaterial | null = null;
    let mesh: THREE.Mesh | null = null;

    textureLoader.load(src, (loadedTexture) => {
      texture = loadedTexture;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      sphereMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
      });
      mesh = new THREE.Mesh(geometry, sphereMaterial);
      scene.add(mesh);
      setIsLoaded(true);
    });

    // 4. Mouse / Pointer tracking and drag interactions
    let normMouseX = 0;
    let normMouseY = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let dragLonOffset = 0;
    let dragLatOffset = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized coordinates: -1 to +1 from screen center
      normMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      normMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const handlePointerDown = (e: PointerEvent) => {
      const progress = Number(smoothProgress.get()) || 0;
      if (progress < 0.3) return; // Only allow drag pan in/near regular view
      isDragging = true;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointerX;
      const deltaY = e.clientY - previousPointerY;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;

      // Responsive dragging sensitivity
      dragLonOffset -= deltaX * 0.25;
      dragLatOffset += deltaY * 0.2;
      dragLatOffset = Math.max(-45, Math.min(45, dragLatOffset));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // 5. Animation Loop
    let animationFrameId = 0;
    let baseLon = 180;
    let currentLon = 180;
    let currentLat = -88;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const progress = Number(smoothProgress.get()) || 0; // 0 (Tiny Planet) -> 1 (Regular View)
      setIsRegularView(progress > 0.4);

      // Interpolate FOV: 135° (Tiny Planet) -> 75° (Standard View)
      const currentFov = THREE.MathUtils.lerp(135, 75, progress);
      camera.fov = currentFov;
      camera.updateProjectionMatrix();

      // High sensitivity pointer look scaling:
      // Tiny planet (progress=0): subtle tilt (±15° yaw, ±6° lat)
      // Regular view (progress=1): high sensitivity panoramic pan (±160° yaw, ±40° pitch)
      const sensitivityYaw = THREE.MathUtils.lerp(15, 160, progress);
      const sensitivityPitch = THREE.MathUtils.lerp(6, 40, progress);

      // Edge continuous pan when mouse moves near edges in regular view
      let edgePanVelocity = 0;
      if (progress > 0.4 && Math.abs(normMouseX) > 0.5) {
        const edgeIntensity = (Math.abs(normMouseX) - 0.5) / 0.5;
        edgePanVelocity = Math.sign(normMouseX) * edgeIntensity * 0.45 * progress;
      }

      baseLon += 0.02 + edgePanVelocity;

      // Calculate target spherical coordinates
      const targetLatitudeBase = THREE.MathUtils.lerp(-88, 0, progress);
      const targetLatitude = targetLatitudeBase - normMouseY * sensitivityPitch + dragLatOffset;
      const clampedLat = Math.max(-89, Math.min(85, targetLatitude));

      const targetLongitude = baseLon + normMouseX * sensitivityYaw + dragLonOffset;

      // Smooth camera interpolation for buttery 60fps tracking
      currentLat += (clampedLat - currentLat) * 0.1;
      currentLon += (targetLongitude - currentLon) * 0.1;

      // Convert spherical angles to 3D Cartesian coordinates
      const phi = THREE.MathUtils.degToRad(90 - currentLat);
      const theta = THREE.MathUtils.degToRad(currentLon);

      const target = new THREE.Vector3();
      target.x = 500 * Math.sin(phi) * Math.sin(theta);
      target.y = 500 * Math.cos(phi);
      target.z = 500 * Math.sin(phi) * Math.cos(theta);

      camera.lookAt(target);
      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize handler
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      width = entry.contentRect.width;
      height = entry.contentRect.height;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      resizeObserver.disconnect();

      geometry.dispose();
      if (sphereMaterial) sphereMaterial.dispose();
      if (texture) texture.dispose();
      renderer.dispose();
    };
  }, [src, smoothProgress]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full z-0 overflow-hidden ${
        isRegularView ? "pointer-events-auto cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
    >
      {/* 360 WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Atmospheric dark gradient overlays to keep text crisp and readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,8,0.8)_100%)] pointer-events-none" />
    </div>
  );
}
