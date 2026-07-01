"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { Info, Move, X, Maximize, Minimize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Hotspot {
  id: string;
  lat: number; // Latitude coordinate (-85 to 85)
  lon: number; // Longitude coordinate (0 to 360)
  label: string;
  description: string;
}

interface PanoramaProps {
  src: string;
  hotspots?: Hotspot[];
}

export function Panorama({ src, hotspots = [] }: PanoramaProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when in fullscreen preview
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);
  
  // Track computed screen positions of hotspots
  const [hotspotPositions, setHotspotPositions] = useState<{
    [key: string]: { x: number; y: number; visible: boolean };
  }>({});

  useEffect(() => {
    if (!mountRef.current || !canvasRef.current) return;

    const container = mountRef.current;
    const canvas = canvasRef.current;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Initialize Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, 1, 1100);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // 2. Create Spherical Panorama Geometry
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // Invert geometry so texture renders on the inside
    geometry.scale(-1, 1, 1);

    // 3. Load Texture
    const textureLoader = new THREE.TextureLoader();
    let texture: THREE.Texture | null = null;
    let sphereMaterial: THREE.MeshBasicMaterial | null = null;
    let mesh: THREE.Mesh | null = null;

    textureLoader.load(src, (loadedTexture) => {
      texture = loadedTexture;
      texture.colorSpace = THREE.SRGBColorSpace;
      
      sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
      mesh = new THREE.Mesh(geometry, sphereMaterial);
      scene.add(mesh);
    });

    // Camera look-at angles (lat/lon)
    let lat = 0;
    let lon = 180; // Start centered
    let onPointerDownLat = 0;
    let onPointerDownLon = 0;
    let onPointerDownPointerX = 0;
    let onPointerDownPointerY = 0;
    let isUserInteracting = false;

    // Auto rotation parameters
    let autoRotateSpeed = 0.04;
    let idleTimer = 0;

    // 4. Input Listeners for Drag-to-Look
    const onPointerDown = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      
      isUserInteracting = true;
      setShowGuide(false);
      idleTimer = 0;

      onPointerDownPointerX = event.clientX;
      onPointerDownPointerY = event.clientY;

      onPointerDownLon = lon;
      onPointerDownLat = lat;

      container.setPointerCapture(event.pointerId);
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerup", onPointerUp);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.isPrimary === false) return;

      const clientX = event.clientX;
      const clientY = event.clientY;

      // Boost sensitivity for touch/mobile devices for effortless swiping
      const isTouch = event.pointerType === "touch" || (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches);
      const factor = (camera.fov / 500) * (isTouch ? 4.1 : 1.5);

      lon = (onPointerDownPointerX - clientX) * factor + onPointerDownLon;
      lat = (clientY - onPointerDownPointerY) * factor + onPointerDownLat;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      
      isUserInteracting = false;
      container.releasePointerCapture(event.pointerId);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
    };

    container.addEventListener("pointerdown", onPointerDown);

    // 5. Animation Loop
    let animationFrameId = 0;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Clamp latitude to avoid camera flipping over poles
      lat = Math.max(-85, Math.min(85, lat));

      // Invert coordinates for correct pan alignment
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);

      // Slow auto-rotate if not interacting
      if (!isUserInteracting) {
        idleTimer += 1;
        if (idleTimer > 180) { // wait ~3 seconds of inactivity before auto-rotating
          lon += autoRotateSpeed;
        }
      }

      // Convert spherical angles to 3D target vector
      const target = new THREE.Vector3();
      target.x = 500 * Math.sin(phi) * Math.sin(theta);
      target.y = 500 * Math.cos(phi);
      target.z = 500 * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(target);

      renderer.render(scene, camera);

      // 6. Project 3D Hotspot positions to HTML screen percentages
      const computedPositions: typeof hotspotPositions = {};
      
      hotspots.forEach((spot) => {
        const spotVector = new THREE.Vector3();
        const spotPhi = THREE.MathUtils.degToRad(90 - spot.lat);
        const spotTheta = THREE.MathUtils.degToRad(spot.lon);
        
        // Place hotspot slightly inside sphere radius
        spotVector.x = 480 * Math.sin(spotPhi) * Math.sin(spotTheta);
        spotVector.y = 480 * Math.cos(spotPhi);
        spotVector.z = 480 * Math.sin(spotPhi) * Math.cos(spotTheta);
        
        // Project onto camera projection coordinate matrix
        spotVector.project(camera);
        
        // Check if hotspot is behind camera view plane
        const isBehind = spotVector.z > 1;

        // Convert normalized device coordinates to CSS percentages (0 - 100)
        const posX = (spotVector.x * 0.5 + 0.5) * 100;
        const posY = (-(spotVector.y) * 0.5 + 0.5) * 100;

        computedPositions[spot.id] = {
          x: posX,
          y: posY,
          visible: !isBehind && posX >= 0 && posX <= 100 && posY >= 0 && posY <= 100
        };
      });

      setHotspotPositions(computedPositions);
    };

    animate();

    // 7. Resize Observer for fluid canvas adjustment
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

    // Cleanup Resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("pointerdown", onPointerDown);
      resizeObserver.disconnect();
      
      geometry.dispose();
      if (sphereMaterial) sphereMaterial.dispose();
      if (texture) texture.dispose();
      renderer.dispose();
    };
  }, [src, hotspots, isFullscreen]);

  const content = (
    <div 
      ref={mountRef}
      className={`${
        isFullscreen 
          ? "fixed inset-0 w-screen h-screen z-[9999] rounded-none border-0 bg-black touch-none" 
          : "relative h-[480px] md:h-[600px] w-full rounded-xl border border-white/8 touch-none"
      } overflow-hidden bg-surface-1 cursor-grab active:cursor-grabbing select-none transition-all duration-300`}
      style={{
        boxShadow: isFullscreen ? "none" : "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.5)"
      }}
    >
      {/* WebGL Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full outline-none" />

      {/* Floating projected Hotspot buttons */}
      {hotspots.map((spot) => {
        const pos = hotspotPositions[spot.id];
        if (!pos || !pos.visible) return null;
        
        return (
          <button
            key={spot.id}
            className="absolute z-20 flex h-8 w-8 items-center justify-center rounded-full bg-mad-red text-white shadow-lg cursor-pointer transition-transform hover:scale-125 focus:outline-none"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActiveHotspot(spot);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
          >
            {/* Glowing heartbeat pulse ring */}
            <span className="absolute -inset-1.5 animate-ping rounded-full bg-mad-red/40" />
            <Info className="h-4 w-4" />
          </button>
        );
      })}

      {/* Visual Instruction Overlay */}
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs font-mono tracking-widest text-white/85 uppercase backdrop-blur-md border border-white/10 z-30"
          >
            <Move className="h-4 w-4 animate-pulse text-mad-red" />
            <span>Click &amp; drag to explore 360°</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassmorphic Tooltip Popup on Hotspot click */}
      <AnimatePresence>
        {activeHotspot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute bottom-4 right-4 z-40 max-w-xs md:max-w-sm rounded-lg p-5 text-left border-l-2 border-l-mad-red shadow-2xl"
            style={{
              background: "rgba(15, 15, 16, 0.8)",
              backdropFilter: "blur(20px) saturate(120%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.6)"
            }}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <h4 className="font-mono text-xs tracking-widest text-championship-gold uppercase font-bold">
                {activeHotspot.label}
              </h4>
              <button 
                onClick={() => setActiveHotspot(null)}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed font-sans">
              {activeHotspot.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_80px_rgba(0,0,0,0.75)]" />

      {/* Fullscreen Toggle Button */}
      <button
        onPointerDown={(e) => {
          e.stopPropagation();
          setIsFullscreen(!isFullscreen);
        }}
        className="absolute bottom-6 right-6 z-30 p-2 rounded-full cursor-pointer bg-transparent hover:bg-white/15 active:scale-90 transition-all"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="square" className="h-5 w-5 text-white">
            {/* Top Right L-line pointing inward */}
            <path d="M20 9h-5V4" />
            {/* Bottom Left L-line pointing inward */}
            <path d="M4 15h5v5" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="square" className="h-5 w-5 text-black">
            {/* Top Right L-line pointing outward */}
            <path d="M15 4h5v5" />
            {/* Bottom Left L-line pointing outward */}
            <path d="M9 20H4v-5" />
          </svg>
        )}
      </button>
    </div>
  );

  if (isFullscreen && mounted) {
    return createPortal(content, document.body);
  }

  return content;
}
