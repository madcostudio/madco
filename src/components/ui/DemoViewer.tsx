"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, RotateCcw, X, Info } from "lucide-react";

// Types
type Hotspot = {
  yaw: number;
  pitch: number;
  kind: string;
  title: string;
  text: string;
};

type SceneSpec = {
  id: string;
  name: string;
  sub: string;
  points: number;
  spec: string;
  texture: string;
  palette: {
    ceiling: string;
    wall: string;
    floor: string;
    accent: string;
    window: string;
  };
  hotspots: Hotspot[];
};

// Data
const SCENES: SceneSpec[] = [
  {
    id: "cafe",
    name: "Café Esthétique",
    sub: "Café — high-retention social layout",
    points: 9,
    spec: "9 points · menu hotspots",
    texture: "generated", // To swap for real images: texture: '/tours/banyan-tree-cafe.jpg'
    palette: {
      ceiling: "#2c221a",
      wall: "#4a3320",
      floor: "#2a1e12",
      accent: "#ff2e2e",
      window: "#d49a5b",
    },
    hotspots: [
      { yaw: 45, pitch: 0, kind: "Menu", title: "Today's menu", text: "View our current offerings and specials." },
      { yaw: -30, pitch: -10, kind: "Booking", title: "Reserve a table", text: "Direct integration with your reservation system." },
      { yaw: 120, pitch: -5, kind: "Highlight", title: "The corner seat", text: "Our most requested spot for remote work." },
    ],
  },
  {
    id: "gym",
    name: "The Iron Forge Gym",
    sub: "Fitness facility — spatial trust",
    points: 12,
    spec: "12 points · equipment tags",
    texture: "generated", // e.g. '/tours/iron-forge.jpg'
    palette: {
      ceiling: "#1a1c1e",
      wall: "#2a2d32",
      floor: "#16181a",
      accent: "#ff2e2e",
      window: "#4a5568",
    },
    hotspots: [
      { yaw: 10, pitch: 5, kind: "Zone", title: "Free weights zone", text: "Premium rogue equipment ready to use." },
      { yaw: -80, pitch: -5, kind: "Trial", title: "Trial session", text: "Book a one-day pass to test the facility." },
      { yaw: 160, pitch: 0, kind: "Zone", title: "Cardio floor", text: "Top of the line treadmills and ellipticals." },
    ],
  },
  {
    id: "restaurant",
    name: "Aura Dining Room",
    sub: "Premium restaurant — atmosphere",
    points: 15,
    spec: "15 points · reservation links",
    texture: "generated", // e.g. '/tours/aura-dining.jpg'
    palette: {
      ceiling: "#120a06",
      wall: "#1f110a",
      floor: "#0a0604",
      accent: "#c8a24d",
      window: "#ff9933",
    },
    hotspots: [
      { yaw: -20, pitch: -10, kind: "Reservation", title: "Book this table", text: "Secure the best view in the house." },
      { yaw: 90, pitch: 0, kind: "Room", title: "Private dining", text: "An exclusive space for up to 12 guests." },
      { yaw: -140, pitch: 5, kind: "Menu", title: "Tasting menu", text: "Explore our seasonal 7-course pairing." },
    ],
  },
];

// Procedural Generator
function generatePanoramaTexture(scene: SceneSpec): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 4096;
  canvas.height = 2048;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const w = canvas.width;
  const h = canvas.height;

  // Backgrounds
  const ceilingHeight = h * 0.31;
  const floorY = h * 0.68;

  // Ceiling
  ctx.fillStyle = scene.palette.ceiling;
  ctx.fillRect(0, 0, w, ceilingHeight);
  // Floor
  ctx.fillStyle = scene.palette.floor;
  ctx.fillRect(0, floorY, w, h - floorY);
  // Walls
  ctx.fillStyle = scene.palette.wall;
  ctx.fillRect(0, ceilingHeight, w, floorY - ceilingHeight);

  // Soften poles
  const gradTop = ctx.createLinearGradient(0, 0, 0, ceilingHeight * 0.5);
  gradTop.addColorStop(0, "#000000");
  gradTop.addColorStop(1, "transparent");
  ctx.fillStyle = gradTop;
  ctx.fillRect(0, 0, w, ceilingHeight * 0.5);

  const gradBottom = ctx.createLinearGradient(0, h, 0, h - (h - floorY) * 0.5);
  gradBottom.addColorStop(0, "#000000");
  gradBottom.addColorStop(1, "transparent");
  ctx.fillStyle = gradBottom;
  ctx.fillRect(0, h - (h - floorY) * 0.5, w, (h - floorY) * 0.5);

  // 8 bays
  const numBays = 8;
  const bayW = w / numBays;
  for (let i = 0; i < numBays; i++) {
    const x = i * bayW;
    if (i % 2 === 0) {
      // Window bay
      const winW = bayW * 0.7;
      const winX = x + (bayW - winW) / 2;
      const winY = ceilingHeight + 100;
      const winH = floorY - winY;
      
      const gradWin = ctx.createLinearGradient(0, winY, 0, winY + winH);
      gradWin.addColorStop(0, scene.palette.window);
      gradWin.addColorStop(1, scene.palette.wall);
      ctx.fillStyle = gradWin;
      ctx.fillRect(winX, winY, winW, winH);

      // Light spill on floor
      ctx.fillStyle = scene.palette.window + "20"; // very transparent
      ctx.fillRect(winX - 50, floorY, winW + 100, 400);
    } else {
      // Solid bay with accent strip
      ctx.fillStyle = scene.palette.accent;
      ctx.fillRect(x + bayW * 0.1, floorY - 20, bayW * 0.8, 10);
      
      // Pendant lamp
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x + bayW / 2, ceilingHeight - 150, 40, 0, Math.PI * 2);
      ctx.fill();
      
      const glow = ctx.createRadialGradient(x + bayW / 2, ceilingHeight - 150, 40, x + bayW / 2, ceilingHeight - 150, 200);
      glow.addColorStop(0, "#ffffff40");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x + bayW / 2, ceilingHeight - 150, 200, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Counter/Island across part of the room (e.g. front bay)
  ctx.fillStyle = "#111111";
  ctx.fillRect(w * 0.35, floorY - 150, w * 0.3, 300);
  ctx.fillStyle = scene.palette.accent;
  ctx.fillRect(w * 0.35, floorY - 150, w * 0.3, 10);

  // Film grain overlay
  const idata = ctx.getImageData(0, 0, w, h);
  const data = idata.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = (Math.random() - 0.5) * 10;
    data[i] = Math.min(255, Math.max(0, data[i] + val));
    data[i+1] = Math.min(255, Math.max(0, data[i+1] + val));
    data[i+2] = Math.min(255, Math.max(0, data[i+2] + val));
  }
  ctx.putImageData(idata, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function DemoViewer() {
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [hotspotDOMs, setHotspotDOMs] = useState<({ id: number, x: number, y: number, visible: boolean, leftSide: boolean } & Hotspot)[]>([]);
  const [openTooltip, setOpenTooltip] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  // Camera Control State
  const camState = useRef({
    lon: 90,
    lat: 0,
    targetLon: 90,
    targetLat: 0,
    fov: 75,
    targetFov: 75,
    isUserInteracting: false,
    onPointerDownPointerX: 0,
    onPointerDownPointerY: 0,
    onPointerDownLon: 0,
    onPointerDownLat: 0,
    pointers: [] as { id: number; x: number; y: number }[],
    pinchStartDist: 0,
    pinchStartFov: 0,
    frameId: 0
  });

  const activeScene = SCENES[activeSceneIdx];

  useEffect(() => {
    // Respect reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setAutoRotate(false);
    }
  }, []);

  // Init Three.js
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(camState.current.fov, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    const geometry = new THREE.SphereGeometry(500, 64, 40);
    geometry.scale(-1, 1, 1); // Inside out
    
    // Load initial texture
    const texture = activeScene.texture === "generated" 
      ? generatePanoramaTexture(activeScene) 
      : new THREE.TextureLoader().load(activeScene.texture); // In case they use real URLs

    const material = new THREE.MeshBasicMaterial({ map: texture });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Hotspot vectors cache
    let hotspotVectors = activeScene.hotspots.map(hs => {
      const phi = THREE.MathUtils.degToRad(90 - hs.pitch);
      const theta = THREE.MathUtils.degToRad(hs.yaw);
      const r = 420;
      return {
        ...hs,
        vec: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        )
      };
    });

    // Render loop
    const animate = () => {
      camState.current.frameId = requestAnimationFrame(animate);

      if (autoRotate && !camState.current.isUserInteracting) {
        camState.current.targetLon += 0.1;
      }

      // Lerp camera
      camState.current.lon += (camState.current.targetLon - camState.current.lon) * 0.09;
      camState.current.lat += (camState.current.targetLat - camState.current.lat) * 0.09;
      camState.current.fov += (camState.current.targetFov - camState.current.fov) * 0.15;
      
      camState.current.lat = Math.max(-85, Math.min(85, camState.current.lat));
      camera.fov = camState.current.fov;
      camera.updateProjectionMatrix();

      const phi = THREE.MathUtils.degToRad(90 - camState.current.lat);
      const theta = THREE.MathUtils.degToRad(camState.current.lon);

      const targetVector = new THREE.Vector3(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(targetVector);

      renderer.render(scene, camera);

      // Project hotspots
      if (containerRef.current) {
        const cw = containerRef.current.clientWidth;
        const ch = containerRef.current.clientHeight;
        const hw = cw / 2;
        const hh = ch / 2;

        const projected = hotspotVectors.map((hs, i) => {
          const v = hs.vec.clone();
          
          // Check if behind camera
          const camDir = new THREE.Vector3().subVectors(targetVector, camera.position).normalize();
          const dot = camDir.dot(v.clone().normalize());
          
          v.project(camera);
          const x = (v.x * hw) + hw;
          const y = -(v.y * hh) + hh;
          
          // Visible if in front (dot > 0) and on screen
          const visible = dot > 0 && x > -50 && x < cw + 50 && y > -50 && y < ch + 50;
          const leftSide = x > cw * 0.7; // Flip tooltip if too far right

          return {
            id: i,
            ...hs,
            x,
            y,
            visible,
            leftSide
          };
        });

        setHotspotDOMs(projected);
        
        // Auto close tooltip if it goes off screen
        setOpenTooltip(prev => {
          if (prev !== null) {
            const hs = projected[prev];
            if (!hs || !hs.visible) return null;
          }
          return prev;
        });
      }
    };

    animate();

    // Resize Observer
    const ro = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    ro.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(camState.current.frameId);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Scene Switch
  useEffect(() => {
    if (!materialRef.current) return;
    const oldTexture = materialRef.current.map;
    
    const newTexture = activeScene.texture === "generated" 
      ? generatePanoramaTexture(activeScene) 
      : new THREE.TextureLoader().load(activeScene.texture);
      
    materialRef.current.map = newTexture;
    materialRef.current.needsUpdate = true;
    
    if (oldTexture) oldTexture.dispose();
    setOpenTooltip(null);

    // Update hotspots cache
    if (cameraRef.current && containerRef.current) {
      // Re-bind animate loop variables in next frame cycle organically via state render, 
      // but actually we need to update the ref data read by the loop.
      // Easiest is to force a small timeout or just let React handle it. 
      // But `hotspotVectors` was captured in the first useEffect. 
      // To fix this without recreating the whole THREE scene, we can store hotspotVectors in a ref.
    }
  }, [activeScene]);

  // We need to keep hotspot vectors in a ref so the animate loop uses the latest.
  const hotspotVectorsRef = useRef<{vec: THREE.Vector3}[]>([]);
  useEffect(() => {
    hotspotVectorsRef.current = activeScene.hotspots.map(hs => {
      const phi = THREE.MathUtils.degToRad(90 - hs.pitch);
      const theta = THREE.MathUtils.degToRad(hs.yaw);
      const r = 420;
      return {
        ...hs,
        vec: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        )
      };
    });
  }, [activeScene]);

  // Patch animate loop to use ref
  useEffect(() => {
    const originalAnimate = () => {
       // Using requestAnimationFrame inside effect is tricky with stale closures.
       // We can just rely on the existing loop picking up the new state if we didn't closure it.
       // Actually, the closure in the first useEffect captured `hotspotVectors`. 
       // I should fix the first useEffect to read from `hotspotVectorsRef.current` and `SCENES[activeSceneIdxRef.current].hotspots`.
    };
  }, []);

  // Update loop to use refs for scene data
  const activeSceneRef = useRef(activeScene);
  useEffect(() => { activeSceneRef.current = activeScene; }, [activeScene]);

  // Handlers
  const handleInteract = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setAutoRotate(false);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    handleInteract();
    if (e.pointerType === "mouse") e.preventDefault();
    containerRef.current?.focus();

    camState.current.isUserInteracting = true;
    camState.current.pointers.push({ id: e.pointerId, x: e.clientX, y: e.clientY });

    if (camState.current.pointers.length === 1) {
      camState.current.onPointerDownPointerX = e.clientX;
      camState.current.onPointerDownPointerY = e.clientY;
      camState.current.onPointerDownLon = camState.current.targetLon;
      camState.current.onPointerDownLat = camState.current.targetLat;
    } else if (camState.current.pointers.length === 2) {
      const p1 = camState.current.pointers[0];
      const p2 = camState.current.pointers[1];
      camState.current.pinchStartDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      camState.current.pinchStartFov = camState.current.targetFov;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!camState.current.isUserInteracting) return;

    const pIdx = camState.current.pointers.findIndex(p => p.id === e.pointerId);
    if (pIdx !== -1) {
      camState.current.pointers[pIdx].x = e.clientX;
      camState.current.pointers[pIdx].y = e.clientY;
    }

    if (camState.current.pointers.length === 1) {
      const fovFactor = camState.current.targetFov / 75;
      camState.current.targetLon = (camState.current.onPointerDownPointerX - e.clientX) * 0.1 * fovFactor + camState.current.onPointerDownLon;
      camState.current.targetLat = (e.clientY - camState.current.onPointerDownPointerY) * 0.1 * fovFactor + camState.current.onPointerDownLat;
    } else if (camState.current.pointers.length === 2) {
      const p1 = camState.current.pointers[0];
      const p2 = camState.current.pointers[1];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      const distDelta = camState.current.pinchStartDist - dist;
      camState.current.targetFov = Math.max(38, Math.min(92, camState.current.pinchStartFov + distDelta * 0.1));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    camState.current.pointers = camState.current.pointers.filter(p => p.id !== e.pointerId);
    if (camState.current.pointers.length === 0) {
      camState.current.isUserInteracting = false;
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    handleInteract();
    camState.current.targetFov = Math.max(38, Math.min(92, camState.current.targetFov + e.deltaY * 0.05));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleInteract();
    const speed = 5;
    if (e.key === "ArrowUp") camState.current.targetLat += speed;
    if (e.key === "ArrowDown") camState.current.targetLat -= speed;
    if (e.key === "ArrowLeft") camState.current.targetLon -= speed;
    if (e.key === "ArrowRight") camState.current.targetLon += speed;
    if (e.key === "=" || e.key === "+") camState.current.targetFov = Math.max(38, camState.current.targetFov - speed);
    if (e.key === "-") camState.current.targetFov = Math.min(92, camState.current.targetFov + speed);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Fix loop using refs in an inner effect to rebind safely
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (autoRotate && !camState.current.isUserInteracting) {
        camState.current.targetLon += 0.1;
      }
      camState.current.lon += (camState.current.targetLon - camState.current.lon) * 0.09;
      camState.current.lat += (camState.current.targetLat - camState.current.lat) * 0.09;
      camState.current.fov += (camState.current.targetFov - camState.current.fov) * 0.15;
      camState.current.lat = Math.max(-85, Math.min(85, camState.current.lat));
      
      const camera = cameraRef.current!;
      camera.fov = camState.current.fov;
      camera.updateProjectionMatrix();

      const phi = THREE.MathUtils.degToRad(90 - camState.current.lat);
      const theta = THREE.MathUtils.degToRad(camState.current.lon);
      const targetVector = new THREE.Vector3(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(targetVector);
      rendererRef.current!.render(sceneRef.current!, camera);

      // Project hotspots using active scene ref
      if (containerRef.current) {
        const cw = containerRef.current.clientWidth;
        const ch = containerRef.current.clientHeight;
        const hw = cw / 2;
        const hh = ch / 2;

        const projected = hotspotVectorsRef.current.map((hs, i) => {
          const v = hs.vec.clone();
          const camDir = new THREE.Vector3().subVectors(targetVector, camera.position).normalize();
          const dot = camDir.dot(v.clone().normalize());
          v.project(camera);
          const x = (v.x * hw) + hw;
          const y = -(v.y * hh) + hh;
          const visible = dot > 0 && x > -50 && x < cw + 50 && y > -50 && y < ch + 50;
          const leftSide = x > cw * 0.6;
          
          return {
            id: i,
            ...activeSceneRef.current.hotspots[i],
            x, y, visible, leftSide
          };
        });
        setHotspotDOMs(projected);
      }
    };
    
    // Stop old loop started by previous effect
    cancelAnimationFrame(camState.current.frameId);
    animate();
    
    return () => cancelAnimationFrame(frame);
  }, [autoRotate]); // Rebind when autoRotate changes

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* Scene Switcher Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
        {SCENES.map((scene, idx) => (
          <button
            key={scene.id}
            onClick={() => setActiveSceneIdx(idx)}
            className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
              activeSceneIdx === idx 
              ? "bg-white text-black border-white" 
              : "bg-surface-2 text-text-secondary border-white/5 hover:border-white/20 hover:text-white"
            }`}
          >
            {scene.name}
          </button>
        ))}
      </div>

      {/* Viewer Container */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/5] md:aspect-video bg-black rounded-xl overflow-hidden border border-white/10 group focus:outline-none focus:ring-2 focus:ring-mad-red/50"
        tabIndex={0}
        role="application"
        aria-label="360 degree spatial demonstration viewer. Use arrow keys to look around."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" />

        {/* Top Badges */}
        <div className="absolute top-4 md:top-6 left-4 md:left-6 flex gap-3 z-10 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md text-white font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full uppercase border border-white/10">
            CONCEPT
          </div>
        </div>
        <div className="absolute top-4 md:top-6 right-4 md:right-6 z-10 pointer-events-none">
          <div className="flex items-center gap-2 bg-electric-azure/10 border border-electric-azure/30 backdrop-blur-md text-electric-azure font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full uppercase font-bold shadow-[0_0_15px_rgba(41,163,255,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-electric-azure animate-pulse" />
            360° LIVE
          </div>
        </div>

        {/* Drag to Look Hint */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 text-white font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-full animate-bounce">
                Drag to Look
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hotspots */}
        {hotspotDOMs.map(hs => (
          <div 
            key={hs.id}
            className="absolute z-20 transition-opacity duration-200"
            style={{ 
              left: `${hs.x}px`, 
              top: `${hs.y}px`,
              opacity: hs.visible ? 1 : 0,
              pointerEvents: hs.visible ? "auto" : "none",
            }}
          >
            {/* Marker */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleInteract();
                setOpenTooltip(openTooltip === hs.id ? null : hs.id);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-[34px] md:h-[34px] rounded-full bg-mad-red/40 border border-mad-red flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform group/btn focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={`Open hotspot: ${hs.title}`}
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full group-hover/btn:scale-125 transition-transform" />
              {/* Pulse ring respects reduced motion by default if not animate-ping */}
              <div className="absolute inset-0 rounded-full border border-mad-red animate-ping opacity-50 [animation-duration:2s]" />
            </button>

            {/* Tooltip */}
            <AnimatePresence>
              {openTooltip === hs.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: hs.leftSide ? -20 : 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`absolute top-1/2 -translate-y-1/2 w-48 md:w-56 p-4 rounded-xl shadow-2xl z-30 ${
                    hs.leftSide ? 'right-full mr-4 md:mr-6' : 'left-full ml-4 md:ml-6'
                  }`}
                  style={{
                    backgroundColor: "rgba(18,18,20,0.82)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)"
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setOpenTooltip(null)}
                    className="absolute top-2 right-2 p-1 text-white/50 hover:text-white transition-colors rounded focus:outline-none focus:ring-1 focus:ring-white"
                    aria-label="Close tooltip"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="font-mono text-[9px] text-championship-gold uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
                    <Info className="w-3 h-3" />
                    {hs.kind}
                  </div>
                  <h4 className="font-sans font-bold text-sm text-white mb-1 leading-tight">{hs.title}</h4>
                  <p className="font-sans text-xs text-text-secondary leading-relaxed">{hs.text}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Bottom Bar */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 flex justify-between items-end z-10 pointer-events-none">
          
          {/* Info */}
          <div className="flex flex-col gap-1 pointer-events-auto">
            <div className="font-mono text-xs text-white/70 uppercase tracking-widest hidden sm:block">
              {activeScene.name} <span className="text-mad-red mx-1">—</span> {activeScene.points} points
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 pointer-events-auto">
            <button 
              onClick={() => {
                handleInteract();
                setAutoRotate(!autoRotate);
              }}
              className={`p-2 rounded-md transition-colors border ${autoRotate ? 'bg-white/10 border-white/20 text-white' : 'bg-black/40 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
              aria-label="Toggle auto-rotation"
              title="Auto-rotate"
            >
              <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '4s' }} />
            </button>
            <button 
              onClick={() => {
                handleInteract();
                camState.current.targetLon = 90;
                camState.current.targetLat = 0;
                camState.current.targetFov = 75;
              }}
              className="p-2 bg-black/40 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white rounded-md transition-colors"
              aria-label="Reset view"
              title="Reset view"
            >
              <span className="font-mono text-xs font-bold leading-none px-1">R</span>
            </button>
            <button 
              onClick={toggleFullscreen}
              className="p-2 bg-black/40 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white rounded-md transition-colors"
              aria-label="Toggle fullscreen"
              title="Fullscreen"
            >
              <Expand className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Meta Content Below Viewer */}
      <div className="mt-6 flex flex-col gap-1">
        <h3 className="font-sans font-black text-2xl text-white uppercase tracking-tight">{activeScene.name}</h3>
        <p className="text-text-secondary text-sm font-sans">{activeScene.sub}</p>
        <p className="text-mad-red font-mono text-[10px] tracking-widest uppercase mt-2">{activeScene.spec}</p>
      </div>

    </div>
  );
}
