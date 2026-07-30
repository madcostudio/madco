"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, RotateCcw, X, Info, MapPin, ChevronUp, ChevronLeft, ChevronRight, Camera, Route, Image as ImageIcon, QrCode, MonitorSmartphone, Plus, Minus, ExternalLink, Compass, Coffee, Utensils, Dumbbell, Scissors, Stethoscope, Building, Store, PartyPopper, Briefcase, Home, Warehouse } from "lucide-react";
import { TOURS, TourData, Hotspot, NodeLink } from "@/lib/tours.config";

// Load texture helper
const textureLoader = new THREE.TextureLoader();
function loadPanoTexture(url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    textureLoader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        resolve(tex);
      },
      undefined,
      reject
    );
  });
}

// --- Viewer Component ---

function Viewer({ tour, activeNodeIdx, onNodeChange }: { tour: TourData, activeNodeIdx: number, onNodeChange: (idx: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [openTooltip, setOpenTooltip] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Transition veil
  const [veilOpacity, setVeilOpacity] = useState(1); // Start veiled while loading
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Markers mapped to DOM
  const [hotspotDOMs, setHotspotDOMs] = useState<({id:number, x:number, y:number, visible:boolean, leftSide:boolean} & Hotspot)[]>([]);
  const [linkDOMs, setLinkDOMs] = useState<({id:number, x:number, y:number, visible:boolean, scale:number} & NodeLink)[]>([]);

  const node = tour.nodes[activeNodeIdx];

  // Refs for Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  const camState = useRef({
    lon: 90, lat: 0, targetLon: 90, targetLat: 0, fov: 75, targetFov: 75,
    isUserInteracting: false, frameId: 0,
    pointers: [] as { id: number; x: number; y: number }[],
    onDownX: 0, onDownY: 0, onDownLon: 0, onDownLat: 0,
    pinchDist: 0, pinchFov: 0
  });

  const nodeRef = useRef(node);
  useEffect(() => { nodeRef.current = node; }, [node]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setAutoRotate(false);
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
    geometry.scale(-1, 1, 1);
    
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    materialRef.current = material;

    scene.add(new THREE.Mesh(geometry, material));

    const animate = () => {
      camState.current.frameId = requestAnimationFrame(animate);

      if (autoRotate && !camState.current.isUserInteracting) {
        camState.current.targetLon += 0.05;
      }

      camState.current.lon += (camState.current.targetLon - camState.current.lon) * 0.09;
      camState.current.lat += (camState.current.targetLat - camState.current.lat) * 0.09;
      camState.current.fov += (camState.current.targetFov - camState.current.fov) * 0.15;
      camState.current.lat = Math.max(-70, Math.min(70, camState.current.lat));
      
      camera.fov = camState.current.fov;
      camera.updateProjectionMatrix();

      const phi = THREE.MathUtils.degToRad(90 - camState.current.lat);
      const theta = THREE.MathUtils.degToRad(camState.current.lon);
      const targetVec = new THREE.Vector3(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(targetVec);

      renderer.render(scene, camera);

      // DOM Projections
      if (containerRef.current && !isTransitioning) {
        const cw = containerRef.current.clientWidth;
        const ch = containerRef.current.clientHeight;
        const camDir = new THREE.Vector3().subVectors(targetVec, camera.position).normalize();

        // Links (Floor arrows)
        const lDOMs = nodeRef.current.links.map((lk, i) => {
          const r = 430;
          const pitch = -0.42; // on the floor
          const yaw = lk.yaw;
          
          const pos = new THREE.Vector3(
            r * Math.cos(pitch) * Math.sin(yaw),
            r * Math.sin(pitch),
            r * Math.cos(pitch) * Math.cos(yaw)
          );
          
          const dot = camDir.dot(pos.clone().normalize());
          const scale = Math.max(0.4, Math.min(1, dot * 1.5));
          
          const v = pos.clone().project(camera);
          const behind = v.z > 1;
          
          const x = ((v.x + 1) / 2) * cw;
          const y = ((-v.y + 1) / 2) * ch;
          
          const visible = !behind && x > -100 && x < cw + 100 && y > -100 && y < ch + 100;
          return { id: i, ...lk, x, y, visible, scale };
        });
        setLinkDOMs(lDOMs);

        // Hotspots (Info markers)
        const hDOMs = (nodeRef.current.hotspots || []).map((hs, i) => {
          const r = 420;
          const pitch = hs.pitch;
          const yaw = hs.yaw;
          
          const pos = new THREE.Vector3(
            r * Math.cos(pitch) * Math.sin(yaw),
            r * Math.sin(pitch),
            r * Math.cos(pitch) * Math.cos(yaw)
          );
          
          const v = pos.clone().project(camera);
          const behind = v.z > 1;
          
          const x = ((v.x + 1) / 2) * cw;
          const y = ((-v.y + 1) / 2) * ch;
          
          const visible = !behind && x > -50 && x < cw + 50 && y > -50 && y < ch + 50;
          const leftSide = x > cw - 280;
          return { id: i, ...hs, x, y, visible, leftSide };
        });
        setHotspotDOMs(hDOMs);
      }
    };

    animate();

    const ro = new ResizeObserver(entries => {
      for (let entry of entries) {
        camera.aspect = entry.contentRect.width / entry.contentRect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(entry.contentRect.width, entry.contentRect.height);
      }
    });
    ro.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(camState.current.frameId);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Init once

  // Handle Node Swap (Initial or Navigation)
  useEffect(() => {
    let active = true;

    async function loadNodeTexture() {
      if (!materialRef.current) return;
      
      setVeilOpacity(1);
      setIsTransitioning(true);
      setOpenTooltip(null);
      setLinkDOMs([]);
      setHotspotDOMs([]);
      setErrorMsg(null);
      setIsLoading(true);

      if (!node._tex) {
        try {
          node._tex = await loadPanoTexture(node.pano);
        } catch (e) {
          console.error("Failed to load pano:", node.pano, e);
          if (active) {
            setErrorMsg("Tour image failed to load");
            setIsLoading(false);
          }
          return;
        }
      }
      
      if (!active) return;

      materialRef.current.map = node._tex || null;
      materialRef.current.needsUpdate = true;
      
      camState.current.targetLat = 0;
      camState.current.targetFov = 75;

      setTimeout(() => {
        if (!active) return;
        setVeilOpacity(0);
        setIsTransitioning(false);
        setIsLoading(false);
        
        // Preload next nodes in background
        node.links.forEach(link => {
          const targetNode = tour.nodes.find(n => n.id === link.to);
          if (targetNode && !targetNode._tex) {
            loadPanoTexture(targetNode.pano).then(tex => { targetNode._tex = tex; }).catch(() => {});
          }
        });
      }, 50);
    }

    loadNodeTexture();

    return () => { active = false; };
  }, [node, tour.nodes]);

  // Transition handler for clicks
  const handleLinkClick = (targetNodeId: string) => {
    if (isTransitioning) return;
    const targetIdx = tour.nodes.findIndex(n => n.id === targetNodeId);
    if (targetIdx === -1) return;
    
    handleInteract();
    
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      onNodeChange(targetIdx);
      return;
    }

    // Dolly & Veil Transition
    setIsTransitioning(true);
    camState.current.targetFov -= 10;
    setVeilOpacity(1);
    
    setTimeout(() => {
      onNodeChange(targetIdx); // This triggers the useEffect above
    }, 280);
  };

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
      camState.current.onDownX = e.clientX; camState.current.onDownY = e.clientY;
      camState.current.onDownLon = camState.current.targetLon; camState.current.onDownLat = camState.current.targetLat;
    } else if (camState.current.pointers.length === 2) {
      const p1 = camState.current.pointers[0]; const p2 = camState.current.pointers[1];
      camState.current.pinchDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      camState.current.pinchFov = camState.current.targetFov;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!camState.current.isUserInteracting) return;
    const pIdx = camState.current.pointers.findIndex(p => p.id === e.pointerId);
    if (pIdx !== -1) {
      camState.current.pointers[pIdx].x = e.clientX; camState.current.pointers[pIdx].y = e.clientY;
    }

    if (camState.current.pointers.length === 1) {
      const fovFactor = camState.current.targetFov / 75;
      camState.current.targetLon = (camState.current.onDownX - e.clientX) * 0.1 * fovFactor + camState.current.onDownLon;
      camState.current.targetLat = (e.clientY - camState.current.onDownY) * 0.1 * fovFactor + camState.current.onDownLat;
    } else if (camState.current.pointers.length === 2) {
      const p1 = camState.current.pointers[0]; const p2 = camState.current.pointers[1];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      const delta = camState.current.pinchDist - dist;
      camState.current.targetFov = Math.max(40, Math.min(92, camState.current.pinchFov + delta * 0.1));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    camState.current.pointers = camState.current.pointers.filter(p => p.id !== e.pointerId);
    if (camState.current.pointers.length === 0) camState.current.isUserInteracting = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    handleInteract();
    camState.current.targetFov = Math.max(40, Math.min(92, camState.current.targetFov + e.deltaY * 0.05));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleInteract();
    const speed = 5;
    if (e.key === "ArrowUp") camState.current.targetLat += speed;
    if (e.key === "ArrowDown") camState.current.targetLat -= speed;
    if (e.key === "ArrowLeft") camState.current.targetLon -= speed;
    if (e.key === "ArrowRight") camState.current.targetLon += speed;
    if (e.key === "=" || e.key === "+") camState.current.targetFov = Math.max(40, camState.current.targetFov - speed);
    if (e.key === "-") camState.current.targetFov = Math.min(92, camState.current.targetFov + speed);
  };

  return (
    <div className="w-full flex flex-col font-sans relative">
      
      {/* 360 Viewer */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/5] md:aspect-video bg-black rounded-xl overflow-hidden border border-white/10 group focus:outline-none focus:ring-2 focus:ring-mad-red/50"
        tabIndex={0}
        role="application"
        aria-label="Interactive multi-node spatial tour. Use arrow keys to look around."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" style={{ zIndex: 0 }} />

        {/* Transition Veil */}
        <div 
          className="absolute inset-0 bg-black pointer-events-none z-10 transition-opacity duration-[280ms] ease-in-out"
          style={{ opacity: veilOpacity }}
        />

        {/* Top-Left Overlay Card (Google Maps Style) */}
        <div className="absolute top-4 md:top-6 left-4 md:left-6 z-[11] flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-md border border-white/20 p-4 rounded-lg shadow-lg flex flex-col gap-1 w-64 pointer-events-auto">
            <h3 className="font-sans font-bold text-black text-lg leading-tight">{tour.name}</h3>
            <p className="font-sans text-xs text-black/60 mb-1">{tour.sub}</p>
            <div className="relative group/tooltip inline-block mt-1">
              <a 
                href={tour.googleMapsUrl || "#"} 
                className={`flex items-center gap-1 font-sans text-xs font-semibold ${tour.googleMapsUrl ? 'text-electric-azure hover:underline' : 'text-black/40 cursor-not-allowed'}`}
                onClick={(e) => { if (!tour.googleMapsUrl) e.preventDefault(); }}
              >
                View on Google Maps <ExternalLink className="w-3 h-3" />
              </a>
              {!tour.googleMapsUrl && (
                <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-black text-white text-[10px] rounded shadow-xl opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-50">
                  This is a demo. Client tours link directly to their Google Maps profile.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top-Right DEMO Tag */}
        <div className="absolute top-4 md:top-6 right-4 md:right-6 z-[11] pointer-events-none">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-championship-gold/30 text-championship-gold font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full uppercase font-bold shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-championship-gold animate-pulse" />
            DEMONSTRATION
          </div>
        </div>

        {/* Error overlay */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-[20]"
            >
              <div className="flex flex-col items-center gap-4 text-center p-6">
                <div className="w-12 h-12 rounded-full border border-mad-red flex items-center justify-center bg-mad-red/20 text-mad-red">
                  <X className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-white text-lg">{errorMsg}</h3>
                  <p className="text-text-secondary text-sm mt-1">Please refresh the page or try another space.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Spinner */}
        <AnimatePresence>
          {isLoading && !errorMsg && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-[19]"
            >
              <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-mad-red animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drag Hint */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-[12]"
            >
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 text-white font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-full animate-bounce shadow-xl">
                Drag to Look
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Hotspots (Gold) */}
        {hotspotDOMs.map(hs => (
          <div 
            key={`hs-${hs.id}`}
            className="absolute z-[8] transition-opacity duration-200"
            style={{ left: `${hs.x}px`, top: `${hs.y}px`, opacity: hs.visible ? 1 : 0, pointerEvents: hs.visible ? "auto" : "none" }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); handleInteract(); setOpenTooltip(openTooltip === hs.id ? null : hs.id); }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full bg-championship-gold/40 border border-championship-gold flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={`Open info: ${hs.title}`}
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
              <div className="absolute inset-0 rounded-full border border-championship-gold animate-ping opacity-50 [animation-duration:2s]" />
            </button>
            <AnimatePresence>
              {openTooltip === hs.id && hs.visible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: hs.leftSide ? -20 : 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  className={`absolute top-1/2 -translate-y-1/2 w-48 md:w-56 p-4 rounded-xl shadow-2xl z-[9] ${hs.leftSide ? 'right-full mr-6' : 'left-full ml-6'}`}
                  style={{ backgroundColor: "rgba(18,18,20,0.82)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onClick={e => e.stopPropagation()}
                >
                  <button onClick={() => setOpenTooltip(null)} className="absolute top-2 right-2 p-1 text-white/50 hover:text-white rounded">
                    <X className="w-3 h-3" />
                  </button>
                  <div className="font-mono text-[9px] text-championship-gold uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1.5">
                    <Info className="w-3 h-3" /> {hs.kind}
                  </div>
                  <h4 className="font-sans font-bold text-sm text-white mb-1 leading-tight">{hs.title}</h4>
                  <p className="font-sans text-xs text-text-secondary leading-relaxed">{hs.text}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Floor Links (Red Arrows) */}
        {linkDOMs.map(lk => (
          <div 
            key={`lk-${lk.id}`}
            className="absolute z-[4] transition-all duration-100 group/link"
            style={{ 
              left: `${lk.x}px`, top: `${lk.y}px`, 
              opacity: lk.visible ? 1 : 0, 
              pointerEvents: lk.visible ? "auto" : "none",
              transform: `scale(${lk.scale})`
            }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); handleLinkClick(lk.to); }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-[62px] h-[62px] rounded-full flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-white transition-transform hover:-translate-y-3 duration-[2.4s] ease-in-out"
              style={{
                background: "radial-gradient(circle, rgba(255,46,46,0.6) 0%, rgba(255,46,46,0) 70%)",
                boxShadow: "0 0 30px rgba(255,46,46,0.4)"
              }}
              aria-label={lk.label}
            >
              <div className="w-12 h-12 rounded-full border border-mad-red/50 flex items-center justify-center backdrop-blur-sm bg-black/20 group-hover/link:bg-mad-red/40 group-hover/link:border-mad-red transition-colors">
                <ChevronUp className="w-6 h-6 text-white" />
              </div>
            </button>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/link:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded font-mono text-[10px] text-white whitespace-nowrap pointer-events-none">
              {lk.label}
            </div>
          </div>
        ))}

        {/* Bottom Bar (Location Info & Vertical Controls) */}
        <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 flex justify-between items-end z-[12] pointer-events-none">
          
          {/* Bottom Left: Position Info */}
          <div className="flex flex-col gap-1 pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-electric-azure" />
              <div className="font-sans text-sm text-white font-bold">{node.label}</div>
            </div>
            <div className="font-mono text-[9px] text-white/50 uppercase tracking-widest ml-5">
              Position {activeNodeIdx + 1} of {tour.nodes.length}
            </div>
          </div>

          {/* Bottom Right: Google-Style Vertical Controls */}
          <div className="flex flex-col gap-2 pointer-events-auto">
            {/* Compass / Auto-rotate */}
            <button 
              onClick={() => setAutoRotate(!autoRotate)} 
              className={`w-10 h-10 flex items-center justify-center rounded bg-black/80 backdrop-blur-md border border-white/10 transition-colors shadow-lg group ${autoRotate ? 'text-electric-azure border-electric-azure/30' : 'text-white/70 hover:text-electric-azure hover:border-electric-azure/30'}`}
              aria-label="Toggle auto-rotate"
              title="Auto-rotate"
            >
              <Compass className={`w-5 h-5 transition-transform duration-[3s] linear ${autoRotate ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Zoom Stack */}
            <div className="flex flex-col bg-black/80 backdrop-blur-md border border-white/10 rounded shadow-lg overflow-hidden">
              <button 
                onClick={() => { camState.current.targetFov = Math.max(40, camState.current.targetFov - 15); handleInteract(); }}
                className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-electric-azure hover:bg-white/5 transition-colors border-b border-white/10"
                aria-label="Zoom in"
                title="Zoom in"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button 
                onClick={() => { camState.current.targetFov = Math.min(92, camState.current.targetFov + 15); handleInteract(); }}
                className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-electric-azure hover:bg-white/5 transition-colors"
                aria-label="Zoom out"
                title="Zoom out"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>

            {/* Fullscreen */}
            <button 
              onClick={() => { if(!document.fullscreenElement) { containerRef.current?.requestFullscreen(); setIsFullscreen(true); } else { document.exitFullscreen(); setIsFullscreen(false); } }} 
              className="w-10 h-10 flex items-center justify-center rounded bg-black/80 backdrop-blur-md border border-white/10 text-white/70 hover:text-electric-azure hover:border-electric-azure/30 transition-colors shadow-lg"
              aria-label="Toggle fullscreen"
              title="Toggle fullscreen"
            >
              <Expand className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Caption Strip */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-white/5 pb-4">
        <div>
          <h3 className="font-sans font-black text-2xl text-white uppercase tracking-tight">{tour.name}</h3>
          <p className="text-text-secondary text-sm font-sans">{tour.sub}</p>
        </div>
        <p className="text-mad-red font-mono text-[10px] tracking-widest uppercase">{tour.spec}</p>
      </div>

    </div>
  );
}

// --- Main Showcase Component ---

function TourCard({ tour, isActive, onClick }: { tour: TourData, isActive: boolean, onClick: () => void }) {
  const [thumbUrl, setThumbUrl] = useState("");

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 225; // 16:9
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Crop the horizon: draw the middle section of the panorama
        const srcW = img.width * 0.3; // 30% of width
        const srcH = srcW * (225 / 400); // matching aspect ratio
        const srcX = (img.width - srcW) / 2;
        const srcY = (img.height - srcH) / 2;
        
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, 400, 225);
        setThumbUrl(canvas.toDataURL("image/jpeg", 0.7));
      }
    };
    img.src = tour.nodes[0].pano;
  }, [tour]);

  return (
    <button
      onClick={onClick}
      aria-current={isActive ? "true" : "false"}
      className={`group relative text-left bg-surface-2 border rounded-xl overflow-hidden flex flex-col transition-all duration-300 ${
        isActive ? "border-mad-red ring-1 ring-mad-red shadow-lg shadow-mad-red/10" : "border-white/5 hover:border-mad-red/50 hover:-translate-y-1"
      }`}
    >
      <div className="relative h-40 w-full bg-black">
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white font-mono text-[9px] tracking-widest px-2 py-1 rounded uppercase border border-white/10 z-10">
          CONCEPT
        </div>
        <div className="absolute bottom-3 left-3 bg-white/90 text-black font-mono text-[9px] tracking-widest px-2 py-1 rounded uppercase font-bold z-10">
          {tour.nodes.length} POSITIONS
        </div>
        {thumbUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbUrl} alt={tour.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity saturate-[1.2]" />
        )}
      </div>
      <div className="p-5 flex flex-col grow">
        <h4 className="font-sans font-bold text-base text-white uppercase tracking-tight mb-1">{tour.name}</h4>
        <p className="text-text-secondary text-xs mb-3 line-clamp-2">{tour.sub}</p>
        <p className="text-mad-red text-[9px] font-mono tracking-widest uppercase mt-auto">{tour.spec}</p>
      </div>
    </button>
  );
}

export function SpatialDemonstrations() {
  const [activeTourId, setActiveTourId] = useState<string>(TOURS[0]?.id || "");
  const [activeNodeIdx, setActiveNodeIdx] = useState(0);
  const viewerRef = useRef<HTMLDivElement>(null);

  const activeTour = TOURS.find(t => t.id === activeTourId) || TOURS[0];

  const handleTourSelect = (id: string) => {
    setActiveTourId(id);
    setActiveNodeIdx(0);
    viewerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };


  return (
    <section className="px-6 md:px-12 xl:px-24 py-16 bg-surface-1 border-t border-white/5" ref={viewerRef}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col gap-3 mb-8">
          <span className="font-mono text-xs tracking-widest text-mad-red uppercase">// SPATIAL DEMONSTRATIONS</span>
          <h2 className="font-sans font-black text-4xl md:text-5xl uppercase tracking-tighter text-white">Walk the space.</h2>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl leading-relaxed">
            This is a full tour, not a single photo. Drag to look around, then step through the arrows on the floor to move from the entrance to the counter to the best seat in the house.
          </p>
        </div>
        
        {/* Viewer */}
        {activeTour && <Viewer tour={activeTour} activeNodeIdx={activeNodeIdx} onNodeChange={setActiveNodeIdx} />}
        
        {/* Category Grid */}
        <div className="mt-16 mb-6">
          <h3 className="font-sans font-bold text-xl text-white uppercase tracking-tight">Spaces we build for</h3>
          <p className="text-text-secondary text-sm">Industries where spatial presence drives revenue.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { icon: Coffee, label: "Cafés", href: "https://www.google.com/maps/@40.7360446,-73.9870871,3a,90y,130.73h,82.01t/data=!3m8!1e1!3m6!1sCIHM0ogKEICAgICEiPaUEw!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAFP8RcPqhVzCTLiGjPmKMKKesek3HopnjdOff69q3-5cipg7l_KUsAknmQPWfZZvKSgaDNYSwH7ASeZnEDASoTrNckMfZgcAjLEu1v37qwGg0--eHZDyOD34tVP-qyFUj8Ug_pQDaOXn%3Dw900-h600-k-no-pi7.992765295818529-ya101.77146502175432-ro0-fo100!7i13312!8i6656?entry=ttu&g_ep=EgoyMDI2MDcyNy4wIKXMDSoASAFQAw%3D%3D" },
            { icon: Utensils, label: "Restaurants", href: "https://www.google.com/maps/@33.3954518,-84.5933116,3a,90y,169.29h,82.11t/data=!3m7!1e1!3m5!1sCIHM0ogKEICAgICLmKRH!2e10!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAFP8RcN2hjWABdF_bfgmwrA2d21vCw2lQ9EDeSNswxrlnzjkTpZkLFhPNE7ycf9-tuFb3t_AuRZdOCt_4DBNq-zaIna-wOuW0HMePq87IDoHYquMY28dezoCaX12WKWkbT6hJ4JmBw%3Dw900-h600-k-no-pi7.8949574639060955-ya65.11606220527433-ro0-fo100!7i10000!8i5000?entry=ttu&g_ep=EgoyMDI2MDcyNy4wIKXMDSoASAFQAw%3D%3D" },
            { icon: Dumbbell, label: "Gyms & Studios", href: "https://www.google.com/maps/@33.7323369,-78.9489687,3a,75y,337.96h,88.18t/data=!3m7!1e1!3m5!1sCIHM0ogKEICAgICV7YrGdA!2e10!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAFP8RcMfWPB_JeoLqodV92dfc6jowjg9Q1zFYlNx6Sej6xKtNaALZmLMvp73dYws-Lldu6oHF-KQZrZeeHv3U2NhcLXLjiFZbbugOb_yT8yxq0US41m1t9M6E0XRaKnhhv8TlXHSCgqB%3Dw900-h600-k-no-pi1.8228141783555856-ya59.597267825470055-ro0-fo100!7i7296!8i3648?entry=ttu&g_ep=EgoyMDI2MDcyNy4wIKXMDSoASAFQAw%3D%3D" },
            { icon: Scissors, label: "Salons & Spas", href: "https://www.google.com/maps/@39.8949676,-74.949098,3a,75y,319.74h,75.23t/data=!3m7!1e1!3m5!1sCIABIhDDSAn0xdgyOoafLMS8Ec0b!2e10!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAFP8RcMnlu7quyN-S8WCP0qtD-dp5cpaMOW2JZx3FitCOIvqSIxXJAXsEx0hfAvjWTuPTBrtuzD_jNUesf-KYuwWVCKlGqhXkLWgqxDSIWSbonGh7XeAhpH2r09CrjrbYjeVsvvJB6FhWg6R_7MF%3Dw900-h600-k-no-pi14.770151268329741-ya69.74133303008199-ro0-fo100!7i10000!8i5000?entry=ttu&g_ep=EgoyMDI2MDcyNy4wIKXMDSoASAFQAw%3D%3D" },
            { icon: Stethoscope, label: "Clinics", href: "https://www.google.com/maps/@33.1122329,-96.7647505,3a,90y,279.62h,92.28t/data=!3m8!1e1!3m6!1sCIHM0ogKEICAgIDKmrX5ogE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAFP8RcPlibVH5zkOqY1FFTQ1CZrumcTSu8qYHBpzzXx2UkNGGxIVnBRFHp2NK_Dh5b5Oqr5H6rujp4TmKB3CiV6vF4l93XHWEfqVg0dI9rhRGrrywOII4esDI3hrVOLxSZVUxHgxNHu2IA%3Dw900-h600-k-no-pi-2.2811560910515425-ya270.24031045649417-ro0-fo100!7i9592!8i4796?entry=ttu&g_ep=EgoyMDI2MDcyNy4wIKXMDSoASAFQAw%3D%3D" },
            { icon: Building, label: "Hotels & Resorts", href: "https://www.google.com/maps/@35.5333536,-82.6064787,3a,75y,306.31h,71.34t/data=!3m7!1e1!3m5!1sCIABIhBQ9WiqG79_jrhlcIc4hq8l!2e10!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAFP8RcNgmNaTdKSWUHxTd-FQFP4VGKltsCM6JwCC9eHa8c6b1W0dNB--BCxo9jlo_ma3pFb4WS4fiYZSpSKAHSbpjdV1_Nkd5BGFMJcHkJXwBClPbu1r6odHSLV2n7IGMkbEqAb7Ytn5-lq100s%3Dw900-h600-k-no-pi18.663174959421923-ya307.30574463140306-ro0-fo100!7i10000!8i5000?entry=ttu&g_ep=EgoyMDI2MDcyNy4wIKXMDSoASAFQAw%3D%3D" },
            { icon: Store, label: "Boutiques & Showrooms", href: "https://www.google.com/maps/@39.8978545,-75.032855,3a,75y,308.35h,81.31t/data=!3m8!1e1!3m6!1sAF1QipPMXL_Wz25nn7Gd7LMuIf2TzvuSrZ-rHJSu5UAU!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fp%2FAF1QipPMXL_Wz25nn7Gd7LMuIf2TzvuSrZ-rHJSu5UAU%3Dw900-h600-k-no-pi8.689739975830548-ya164.58867312830824-ro0-fo100!7i13312!8i6656?entry=ttu&g_ep=EgoyMDI2MDcyNy4wIKXMDSoASAFQAw%3D%3D" },
            { icon: PartyPopper, label: "Banquet Halls", href: "https://www.google.com/maps/@40.430287,-74.3035518,3a,90y,89.01h,86.53t/data=!3m7!1e1!3m5!1sCIHM0ogKEICAgICEyPDoNQ!2e10!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAFP8RcN6QEgUlBy67eDOzAwV1xNuHCbARtdLk9gfKfkrCvhBwln6H1mocjESj5L6A2vXOpLPAdJANDH4aBx0LFJPI5h5VAn8E_3s5hlDIAD2zm1erbtlJ5cz2fzV9Zq_n1F5cc-DYrwp%3Dw900-h600-k-no-pi3.466856440931352-ya141.1728633653697-ro0-fo100!7i13312!8i6656?entry=ttu&g_ep=EgoyMDI2MDcyNy4wIKXMDSoASAFQAw%3D%3D" },
            { icon: Warehouse, label: "Warehouse & Storage", href: "https://www.google.com/maps/@42.4567494,-70.9480291,3a,90y,24.17h,91.6t/data=!3m8!1e1!3m6!1sCIHM0ogKEICAgICppMupHA!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAFP8RcMcFELvr6t9V8PFWVQZtQtYo4ZlPakpc6s-atYhg7vQkbpr9kfDGoIF4VzeBSiA4M2ftCJA1Lmt5yE7F2F6XeG75sEn-YWvUSNbzhqsSdxa9EUpZ3dbpimUolcYOJF4EsDyALA%3Dw900-h600-k-no-pi-1.600561636292312-ya277.90132085486937-ro0-fo100!7i10000!8i5000?entry=ttu&g_ep=EgoyMDI2MDcyNy4wIKXMDSoASAFQAw%3D%3D" },
            { icon: Home, label: "Real Estate", href: "https://www.google.com/maps/@39.916357,-75.0716109,3a,75y,344.03h,87.73t/data=!3m8!1e1!3m6!1sCIHM0ogKEICAgICE8MOF8wE!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAFP8RcPmwcWx-VCxMOERXORsUcmUCWf2Pqeg_7w9JwnnNDZT5vAEYcqXgPQn_DvAJy06bs8fcbVB7Z2dyjqy3iNj59XidhT9GXHxMVSKOcKy5zpjYs7L_KkSpBh40pJc1fx3Pa1Dfh-OTA%3Dw900-h600-k-no-pi2.2736368941838663-ya135.03179491747272-ro0-fo100!7i10000!8i5000?entry=ttu&g_ep=EgoyMDI2MDcyNy4wIKXMDSoASAFQAw%3D%3D" }
          ].map((cat, idx) => (
            <button key={idx} onClick={() => window.open(cat.href, '_blank')} className="relative z-50 flex flex-col items-center justify-center p-6 bg-surface-2 border border-white/5 rounded-xl hover:border-mad-red hover:bg-mad-red/5 transition-all group cursor-pointer w-full h-full pointer-events-auto">
              <cat.icon className="w-8 h-8 text-mad-red mb-3 group-hover:scale-110 transition-transform pointer-events-none" strokeWidth={1.5} />
              <span className="font-sans font-medium text-sm text-white text-center pointer-events-none">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Grid Header */}
        <div className="mt-16 mb-6">
          <h3 className="font-sans font-bold text-xl text-white">Spaces we&apos;ve built</h3>
          <p className="text-text-secondary text-sm">Choose a space to walk through it.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOURS.map(tour => (
            <TourCard 
              key={tour.id} 
              tour={tour} 
              isActive={tour.id === activeTourId} 
              onClick={() => handleTourSelect(tour.id)} 
            />
          ))}

          {/* Reserved Card */}
          <div className="bg-background border-2 border-dashed border-championship-gold/40 hover:border-championship-gold rounded-xl overflow-hidden transition-colors flex flex-col justify-center items-center text-center p-6 h-full group cursor-pointer">
            <div className="w-10 h-10 rounded-full border border-championship-gold/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <MapPin className="h-4 w-4 text-championship-gold" />
            </div>
            <h4 className="font-sans font-bold text-lg text-championship-gold uppercase tracking-tight mb-1">Reserved</h4>
            <p className="text-text-secondary text-xs max-w-[150px]">This space is reserved for our first founding venue.</p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-text-secondary/70 max-w-lg mx-auto font-sans">
          Demonstration tours built with AI-generated interiors to show exactly how a Mad.co tour works. Client tours coming soon.
        </p>

      </div>
    </section>
  );
}
