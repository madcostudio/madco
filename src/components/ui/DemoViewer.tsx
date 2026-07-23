"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, RotateCcw, X, Info, MapPin, ChevronUp, ChevronLeft, ChevronRight, Camera, Route, Image as ImageIcon, QrCode, MonitorSmartphone } from "lucide-react";
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
        const hDOMs = nodeRef.current.hotspots.map((hs, i) => {
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

        {/* Chrome Badges */}
        <div className="absolute top-4 md:top-6 left-4 md:left-6 flex gap-3 z-[11] pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md text-white font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full uppercase border border-white/10">
            CONCEPT
          </div>
        </div>
        <div className="absolute top-4 md:top-6 right-4 md:right-6 z-[11] pointer-events-none">
          <div className="flex items-center gap-2 bg-electric-azure/10 border border-electric-azure/30 backdrop-blur-md text-electric-azure font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full uppercase font-bold shadow-[0_0_15px_rgba(41,163,255,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-electric-azure animate-pulse" />
            360° LIVE
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

        {/* Controls Bar Background */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-[11]" />
        
        {/* Controls */}
        <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 flex justify-between items-end z-[12] pointer-events-none">
          
          <div className="flex flex-col gap-1 pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg">
            <div className="font-sans text-sm text-white font-bold">{node.label}</div>
            <div className="font-mono text-[10px] text-mad-red uppercase tracking-widest">
              Position {activeNodeIdx + 1} of {tour.nodes.length}
            </div>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            <button onClick={() => setAutoRotate(!autoRotate)} className={`p-2 rounded-md transition-colors border ${autoRotate ? 'bg-white/10 border-white/20 text-white' : 'bg-black/40 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`} aria-label="Toggle auto-rotate">
              <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '4s' }} />
            </button>
            <div className="flex bg-black/40 border border-white/10 rounded-md overflow-hidden">
              <button 
                onClick={() => handleLinkClick(activeNodeIdx > 0 ? tour.nodes[activeNodeIdx-1].id : tour.nodes[tour.nodes.length-1].id)}
                className="p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors border-r border-white/10"
                aria-label="Previous position"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleLinkClick(activeNodeIdx < tour.nodes.length-1 ? tour.nodes[activeNodeIdx+1].id : tour.nodes[0].id)}
                className="p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Next position"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => { if(!document.fullscreenElement) { containerRef.current?.requestFullscreen(); setIsFullscreen(true); } else { document.exitFullscreen(); setIsFullscreen(false); } }} className="p-2 bg-black/40 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white rounded-md transition-colors" aria-label="Fullscreen">
              <Expand className="w-4 h-4" />
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

  if (TOURS.length === 0) {
    return (
      <section className="px-6 md:px-12 xl:px-24 py-16 bg-surface-1 border-t border-white/5" ref={viewerRef}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-3 mb-12">
            <span className="font-mono text-xs tracking-widest text-mad-red uppercase">// SPATIAL DEMONSTRATIONS</span>
            <h2 className="font-sans font-black text-4xl md:text-5xl uppercase tracking-tighter text-white">Walk the space.</h2>
            <p className="text-text-secondary text-sm md:text-base max-w-2xl leading-relaxed italic">
              Our first client tour is being captured in Mangalore this month. It will live here — a full walkthrough you can step through, position by position, exactly as it appears on Google.
            </p>
          </div>

          {/* Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Card 1: In Production */}
            <div className="bg-[rgba(255,46,46,0.03)] border-2 border-dashed border-mad-red/30 rounded-xl overflow-hidden flex flex-col justify-center items-center text-center p-8 min-h-[300px]">
              <div className="w-12 h-12 rounded-full border border-mad-red/50 flex items-center justify-center mb-4 text-mad-red bg-mad-red/10">
                <Camera className="h-5 w-5" />
              </div>
              <h3 className="font-sans font-bold text-xl text-mad-red uppercase tracking-tight mb-3">In Production</h3>
              <p className="text-text-secondary text-sm max-w-[260px] leading-relaxed mb-6">
                Our first venue walkthrough is being shot now. Check back shortly — or book a call and yours could be the one we publish.
              </p>
              <div className="mt-auto bg-mad-red/10 border border-mad-red/20 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest uppercase text-mad-red font-bold">
                Capture In Progress
              </div>
            </div>

            {/* Card 2: Reserved */}
            <div className="bg-background border-2 border-dashed border-championship-gold/40 hover:border-championship-gold rounded-xl overflow-hidden transition-colors flex flex-col justify-center items-center text-center p-8 min-h-[300px] group">
              <div className="w-12 h-12 rounded-full border border-championship-gold/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="h-5 w-5 text-championship-gold" />
              </div>
              <h3 className="font-sans font-bold text-xl text-championship-gold uppercase tracking-tight mb-2">Reserved</h3>
              <p className="text-text-secondary text-sm max-w-[200px]">This space is reserved for our first founding venue.</p>
              <a href="/contact" className="mt-6 font-mono text-[11px] text-white bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded uppercase tracking-widest border border-white/10 transition-colors">
                Claim Slot
              </a>
            </div>
          </div>

          <p className="text-center text-xs text-text-secondary/70 font-sans mb-16">
            Client tours coming soon.
          </p>

          {/* What you actually receive */}
          <div className="pt-16 border-t border-white/5">
            <h3 className="font-sans font-bold text-xl text-white mb-8 text-center">What you actually receive</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-surface-2 border border-white/5 p-6 rounded-xl">
                <div className="text-mad-red mb-4">
                  <Route className="h-6 w-6" />
                </div>
                <h4 className="font-sans font-bold text-white text-base mb-2">A walkable tour</h4>
                <p className="text-text-secondary text-sm leading-relaxed">8–10 positions through your space, published to Google.</p>
              </div>

              <div className="bg-surface-2 border border-white/5 p-6 rounded-xl">
                <div className="text-mad-red mb-4">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h4 className="font-sans font-bold text-white text-base mb-2">Edited photography</h4>
                <p className="text-text-secondary text-sm leading-relaxed">Professionally graded stills for your listing and socials.</p>
              </div>

              <div className="bg-surface-2 border border-white/5 p-6 rounded-xl">
                <div className="text-mad-red mb-4">
                  <QrCode className="h-6 w-6" />
                </div>
                <h4 className="font-sans font-bold text-white text-base mb-2">A printable QR code</h4>
                <p className="text-text-secondary text-sm leading-relaxed">For your entrance, menus and receipts.</p>
              </div>

              <div className="bg-surface-2 border border-white/5 p-6 rounded-xl">
                <div className="text-mad-red mb-4">
                  <MonitorSmartphone className="h-6 w-6" />
                </div>
                <h4 className="font-sans font-bold text-white text-base mb-2">An optimised profile</h4>
                <p className="text-text-secondary text-sm leading-relaxed">Hours, category, description and photos, all current.</p>
              </div>

            </div>
          </div>

        </div>
      </section>
    );
  }

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
