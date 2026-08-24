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
    renderer.toneMappingExposure = 1.2;

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

    // 4. Mouse subtle interaction offset
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 15;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 8;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 5. Animation Loop
    let animationFrameId = 0;
    let baseLon = 180;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const progress = Number(smoothProgress.get()) || 0; // 0 (Tiny Planet) -> 1 (Normal View)

      // Interpolate FOV: 135° (Tiny Planet) -> 75° (Standard View)
      const currentFov = THREE.MathUtils.lerp(135, 75, progress);
      camera.fov = currentFov;
      camera.updateProjectionMatrix();

      // Interpolate Latitude: -88° (Looking down for planet) -> 0° (Eye level horizon)
      const targetLat = THREE.MathUtils.lerp(-88, 0, progress) + mouseY * progress;

      // Slow idle ambient rotation
      baseLon += 0.02;
      const targetLon = baseLon + THREE.MathUtils.lerp(0, 45, progress) + mouseX * progress;

      // Convert spherical angles to target vector
      const phi = THREE.MathUtils.degToRad(90 - targetLat);
      const theta = THREE.MathUtils.degToRad(targetLon);

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
      resizeObserver.disconnect();

      geometry.dispose();
      if (sphereMaterial) sphereMaterial.dispose();
      if (texture) texture.dispose();
      renderer.dispose();
    };
  }, [src, smoothProgress]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {/* 360 WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Atmospheric dark gradient overlays to keep text crisp and readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/35 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,8,0.85)_100%)] pointer-events-none" />
    </div>
  );
}
