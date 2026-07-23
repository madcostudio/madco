"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, RotateCcw, X, Info, MapPin, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

// --- Types ---

type Hotspot = {
  yaw: number;
  pitch: number;
  kind: string;
  title: string;
  text: string;
};

type NodeLink = {
  to: string; // id of target node
  yaw: number;
  label: string;
};

type NodeFeature = {
  t: "window" | "door" | "mirror" | "shelf" | "menuboard" | "panelwall" | "counter" | "tables" | "machines" | "plant";
  at: number; // 0-1 across panorama width
  w: number; // width fraction
};

type TourNode = {
  id: string;
  label: string;
  pano: string;
  map: { x: number; y: number };
  features: NodeFeature[];
  links: NodeLink[];
  hotspots: Hotspot[];
  _tex?: THREE.CanvasTexture;
};

type TourPalette = {
  floor: string;
  ceil: string;
  wall: string;
  panel: string;
  glass: string;
  lamp: string;
  accent: string;
  bounce: string;
};

type TourData = {
  id: string;
  name: string;
  sub: string;
  spec: string;
  palette: TourPalette;
  nodes: TourNode[];
};

// --- Data Models ---

const TOURS: TourData[] = [
  {
    id: "cafe",
    name: "Café Esthétique",
    sub: "Café — high-retention social layout",
    spec: "4 positions · menu hotspots",
    palette: { floor: "#2a1e12", ceil: "#2c221a", wall: "#4a3320", panel: "#3a2515", glass: "#ff9933", lamp: "#ffffff", accent: "#ff2e2e", bounce: "#ffb84d20" },
    nodes: [
      {
        id: "entrance", label: "Entrance", pano: "generated", map: { x: 50, y: 160 },
        features: [{ t: "door", at: 0.5, w: 0.15 }, { t: "window", at: 0.25, w: 0.1 }, { t: "window", at: 0.75, w: 0.1 }, { t: "plant", at: 0.1, w: 0.05 }],
        links: [{ to: "counter", yaw: 0, label: "To the counter" }],
        hotspots: [{ yaw: 45, pitch: -5, kind: "Welcome", title: "Open Layout", text: "Bright, airy entrance designed to draw foot traffic." }]
      },
      {
        id: "counter", label: "Counter", pano: "generated", map: { x: 50, y: 100 },
        features: [{ t: "counter", at: 0.5, w: 0.3 }, { t: "menuboard", at: 0.5, w: 0.2 }, { t: "shelf", at: 0.8, w: 0.15 }],
        links: [{ to: "entrance", yaw: 180, label: "Back to entrance" }, { to: "seating", yaw: 90, label: "To seating area" }],
        hotspots: [{ yaw: 0, pitch: 0, kind: "Menu", title: "Today's menu", text: "View our current offerings and specials." }]
      },
      {
        id: "seating", label: "Seating", pano: "generated", map: { x: 120, y: 100 },
        features: [{ t: "tables", at: 0.3, w: 0.4 }, { t: "panelwall", at: 0.8, w: 0.2 }],
        links: [{ to: "counter", yaw: -90, label: "Back to counter" }, { to: "window", yaw: 0, label: "To window seats" }],
        hotspots: [{ yaw: 30, pitch: -10, kind: "Booking", title: "Reserve a table", text: "Direct integration with your reservation system." }]
      },
      {
        id: "window", label: "Window Seats", pano: "generated", map: { x: 120, y: 40 },
        features: [{ t: "window", at: 0.5, w: 0.4 }, { t: "tables", at: 0.5, w: 0.3 }],
        links: [{ to: "seating", yaw: 180, label: "Back to seating" }],
        hotspots: [{ yaw: 0, pitch: -5, kind: "Highlight", title: "The corner seat", text: "Our most requested spot for remote work." }]
      }
    ]
  },
  {
    id: "gym",
    name: "The Iron Forge Gym",
    sub: "Fitness facility — spatial trust",
    spec: "4 positions · equipment tags",
    palette: { floor: "#16181a", ceil: "#1a1c1e", wall: "#2a2d32", panel: "#202326", glass: "#4a5568", lamp: "#e2e8f0", accent: "#ff2e2e", bounce: "#4a556810" },
    nodes: [
      {
        id: "reception", label: "Reception", pano: "generated", map: { x: 100, y: 180 },
        features: [{ t: "door", at: 0.5, w: 0.12 }, { t: "counter", at: 0.2, w: 0.2 }],
        links: [{ to: "weights", yaw: -45, label: "Free weights zone" }],
        hotspots: [{ yaw: 0, pitch: 0, kind: "Trial", title: "Trial session", text: "Book a one-day pass to test the facility." }]
      },
      {
        id: "weights", label: "Free Weights", pano: "generated", map: { x: 40, y: 120 },
        features: [{ t: "mirror", at: 0.5, w: 0.4 }, { t: "machines", at: 0.5, w: 0.3 }],
        links: [{ to: "reception", yaw: 135, label: "Back to reception" }, { to: "cardio", yaw: 0, label: "Cardio floor" }],
        hotspots: [{ yaw: 0, pitch: -5, kind: "Zone", title: "Free weights zone", text: "Premium rogue equipment ready to use." }]
      },
      {
        id: "cardio", label: "Cardio Floor", pano: "generated", map: { x: 40, y: 60 },
        features: [{ t: "machines", at: 0.3, w: 0.4 }, { t: "window", at: 0.8, w: 0.2 }],
        links: [{ to: "weights", yaw: 180, label: "Back to free weights" }, { to: "studio", yaw: 90, label: "To studio" }],
        hotspots: [{ yaw: -30, pitch: -5, kind: "Highlight", title: "Never crowded", text: "Spacious layout with state-of-the-art machines." }]
      },
      {
        id: "studio", label: "Studio", pano: "generated", map: { x: 120, y: 60 },
        features: [{ t: "mirror", at: 0.5, w: 0.5 }, { t: "panelwall", at: 0.1, w: 0.2 }],
        links: [{ to: "cardio", yaw: -90, label: "Back to cardio" }],
        hotspots: [{ yaw: 0, pitch: 5, kind: "Classes", title: "Group Classes", text: "Yoga, HIIT, and spinning held daily." }]
      }
    ]
  },
  {
    id: "restaurant",
    name: "Aura Dining Room",
    sub: "Premium restaurant — atmosphere",
    spec: "4 positions · reservation links",
    palette: { floor: "#0a0604", ceil: "#120a06", wall: "#1f110a", panel: "#140a05", glass: "#ff9933", lamp: "#ffcc88", accent: "#c8a24d", bounce: "#c8a24d15" },
    nodes: [
      {
        id: "foyer", label: "Foyer", pano: "generated", map: { x: 100, y: 160 },
        features: [{ t: "door", at: 0.5, w: 0.1 }, { t: "plant", at: 0.7, w: 0.05 }, { t: "panelwall", at: 0.3, w: 0.2 }],
        links: [{ to: "dining", yaw: 0, label: "Into the dining room" }],
        hotspots: [{ yaw: 45, pitch: 0, kind: "Welcome", title: "Coat check & Host", text: "A warm welcome to Aura." }]
      },
      {
        id: "dining", label: "Dining Room", pano: "generated", map: { x: 100, y: 100 },
        features: [{ t: "tables", at: 0.5, w: 0.6 }, { t: "window", at: 0.1, w: 0.15 }, { t: "window", at: 0.9, w: 0.15 }],
        links: [{ to: "foyer", yaw: 180, label: "Back to foyer" }, { to: "bar", yaw: -90, label: "To the bar" }, { to: "private", yaw: 90, label: "Private dining" }],
        hotspots: [{ yaw: 0, pitch: -10, kind: "Reservation", title: "Book this table", text: "Secure the best view in the house." }]
      },
      {
        id: "bar", label: "Bar", pano: "generated", map: { x: 40, y: 100 },
        features: [{ t: "counter", at: 0.5, w: 0.4 }, { t: "shelf", at: 0.5, w: 0.3 }],
        links: [{ to: "dining", yaw: 90, label: "Back to dining room" }],
        hotspots: [{ yaw: 0, pitch: 0, kind: "Menu", title: "The bar list", text: "Award-winning mixology and rare spirits." }]
      },
      {
        id: "private", label: "Private Dining", pano: "generated", map: { x: 160, y: 100 },
        features: [{ t: "tables", at: 0.5, w: 0.2 }, { t: "panelwall", at: 0.5, w: 0.8 }],
        links: [{ to: "dining", yaw: -90, label: "Back to dining room" }],
        hotspots: [{ yaw: 0, pitch: -5, kind: "Room", title: "Private dining", text: "An exclusive space for up to 12 guests." }]
      }
    ]
  }
];

// --- Procedural Generation ---

function generatePanoramaTexture(node: TourNode, palette: TourPalette): THREE.CanvasTexture {
  // To swap for real images, one would just define: pano: '/tours/banyan/01-entrance.jpg'
  // and load it directly via THREE.TextureLoader.
  
  const canvas = document.createElement("canvas");
  canvas.width = 3072;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const w = canvas.width;
  const h = canvas.height;
  const ceilY = h * 0.3;
  const floorY = h * 0.66;
  const horizonY = h * 0.5;

  // Base fills
  ctx.fillStyle = palette.ceil; ctx.fillRect(0, 0, w, ceilY);
  ctx.fillStyle = palette.floor; ctx.fillRect(0, floorY, w, h - floorY);
  ctx.fillStyle = palette.wall; ctx.fillRect(0, ceilY, w, floorY - ceilY);

  // Soften poles
  const gradTop = ctx.createLinearGradient(0, 0, 0, ceilY * 0.5);
  gradTop.addColorStop(0, "#000000"); gradTop.addColorStop(1, "transparent");
  ctx.fillStyle = gradTop; ctx.fillRect(0, 0, w, ceilY * 0.5);
  const gradBot = ctx.createLinearGradient(0, h, 0, h - (h - floorY) * 0.5);
  gradBot.addColorStop(0, "#000000"); gradBot.addColorStop(1, "transparent");
  ctx.fillStyle = gradBot; ctx.fillRect(0, h - (h - floorY) * 0.5, w, (h - floorY) * 0.5);

  // Accent strip
  ctx.fillStyle = palette.accent;
  ctx.fillRect(0, floorY - 15, w, 8);

  // Features
  node.features.forEach(f => {
    const fx = (f.at * w) - (f.w * w) / 2;
    const fw = f.w * w;
    
    switch(f.t) {
      case "window":
        const wy = ceilY + 50; const wh = floorY - wy - 20;
        const wg = ctx.createLinearGradient(0, wy, 0, wy + wh);
        wg.addColorStop(0, palette.glass); wg.addColorStop(1, palette.wall);
        ctx.fillStyle = wg; ctx.fillRect(fx, wy, fw, wh);
        ctx.fillStyle = "#111"; ctx.fillRect(fx + fw/2 - 5, wy, 10, wh); // mullion
        ctx.fillStyle = palette.bounce; ctx.fillRect(fx - fw/2, floorY, fw*2, 400); // spill
        break;
      case "door":
        const dy = ceilY + 100; const dh = floorY - dy;
        ctx.fillStyle = palette.glass; ctx.fillRect(fx, dy, fw, dh);
        ctx.strokeStyle = "#111"; ctx.lineWidth = 20; ctx.strokeRect(fx, dy, fw, dh);
        ctx.fillStyle = palette.bounce; ctx.fillRect(fx - fw, floorY, fw*3, 600);
        break;
      case "mirror":
        const my = ceilY + 80; const mh = floorY - my - 50;
        const mg = ctx.createLinearGradient(fx, my, fx+fw, my+mh);
        mg.addColorStop(0, palette.panel); mg.addColorStop(0.5, palette.glass); mg.addColorStop(1, palette.panel);
        ctx.fillStyle = mg; ctx.fillRect(fx, my, fw, mh);
        ctx.strokeStyle = "#000"; ctx.lineWidth = 10; ctx.strokeRect(fx, my, fw, mh);
        break;
      case "shelf":
        ctx.fillStyle = "#111";
        ctx.fillRect(fx, ceilY + 100, fw, 15);
        ctx.fillRect(fx, ceilY + 200, fw, 15);
        ctx.fillRect(fx, ceilY + 300, fw, 15);
        ctx.fillStyle = palette.glass;
        for(let i=0; i<3; i++) {
          ctx.beginPath(); ctx.arc(fx + fw/4, ceilY + 90 + i*100, 10, 0, 7); ctx.fill();
          ctx.beginPath(); ctx.arc(fx + (fw*3)/4, ceilY + 90 + i*100, 10, 0, 7); ctx.fill();
        }
        break;
      case "menuboard":
        const mby = ceilY + 50; const mbh = 200;
        ctx.fillStyle = "#111"; ctx.fillRect(fx, mby, fw, mbh);
        ctx.strokeStyle = palette.lamp; ctx.lineWidth = 5; ctx.strokeRect(fx, mby, fw, mbh);
        ctx.fillStyle = "#333"; ctx.fillRect(fx + 20, mby + 40, fw - 40, 10);
        ctx.fillRect(fx + 20, mby + 80, fw - 40, 10);
        break;
      case "panelwall":
        ctx.fillStyle = palette.panel; ctx.fillRect(fx, ceilY, fw, floorY - ceilY);
        ctx.fillStyle = "#000";
        for(let i=0; i<5; i++) {
          ctx.fillRect(fx + (i+1)*(fw/6), ceilY, 5, floorY - ceilY);
        }
        break;
      case "counter":
        ctx.fillStyle = "#151515"; ctx.fillRect(fx, horizonY, fw, h - horizonY);
        ctx.fillStyle = palette.lamp; ctx.fillRect(fx, horizonY, fw, 5); // lit top edge
        ctx.fillStyle = palette.bounce; ctx.fillRect(fx, floorY, fw, 150); // glow pool
        break;
      case "tables":
        for(let i=0; i<5; i++) {
          const tx = fx + (fw/5)*i + (Math.random()*40 - 20);
          const ty = floorY + 50 + (i%3)*50;
          ctx.fillStyle = "#1a1a1a"; ctx.beginPath(); ctx.ellipse(tx, ty, 60, 20, 0, 0, 7); ctx.fill();
          ctx.fillStyle = palette.lamp; ctx.beginPath(); ctx.arc(tx, ty-10, 5, 0, 7); ctx.fill();
        }
        break;
      case "machines":
        ctx.fillStyle = "#111";
        for(let i=0; i<4; i++) {
          const mx = fx + (fw/4)*i;
          ctx.fillRect(mx + 20, horizonY - 50, 20, floorY - horizonY + 50); // upright
          ctx.fillStyle = palette.accent; ctx.fillRect(mx + 20, horizonY, 20, 10); // red accent
          ctx.fillStyle = "#111"; ctx.fillRect(mx, floorY - 20, 60, 40); // base
        }
        break;
      case "plant":
        ctx.fillStyle = "#0a0a0a"; ctx.fillRect(fx + fw/2 - 20, floorY - 50, 40, 80); // pot
        ctx.fillStyle = "#1f2e1f";
        for(let i=0; i<8; i++) {
          ctx.beginPath(); ctx.ellipse(fx + fw/2, floorY - 80, 15, 60, (i*Math.PI)/4, 0, 7); ctx.fill();
        }
        break;
    }
  });

  // Pendant lamps (global)
  for(let i=0; i<10; i++) {
    const lx = (w/10) * i + (w/20);
    const ly = ceilY - 100;
    ctx.fillStyle = palette.lamp; ctx.beginPath(); ctx.arc(lx, ly, 15, 0, 7); ctx.fill();
    const glow = ctx.createRadialGradient(lx, ly, 15, lx, ly, 150);
    glow.addColorStop(0, palette.lamp+"60"); glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(lx, ly, 150, 0, 7); ctx.fill();
  }

  // Film grain
  const idata = ctx.getImageData(0, 0, w, h);
  const data = idata.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = (Math.random() - 0.5) * 12;
    data[i] = Math.max(0, Math.min(255, data[i] + val));
    data[i+1] = Math.max(0, Math.min(255, data[i+1] + val));
    data[i+2] = Math.max(0, Math.min(255, data[i+2] + val));
  }
  ctx.putImageData(idata, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Generate thumbnail for grid
const thumbnailCache: Record<string, string> = {};
function getThumbnail(tour: TourData): string {
  if (thumbnailCache[tour.id]) return thumbnailCache[tour.id];
  const tex = generatePanoramaTexture(tour.nodes[0], tour.palette);
  const source = tex.image as HTMLCanvasElement;
  const canvas = document.createElement("canvas");
  canvas.width = 400; canvas.height = 225; // 16:9
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Crop centerish
    ctx.drawImage(source, source.width*0.25, source.height*0.3, source.width*0.5, source.height*0.4, 0, 0, 400, 225);
    thumbnailCache[tour.id] = canvas.toDataURL("image/jpeg", 0.7);
  }
  tex.dispose();
  return thumbnailCache[tour.id] || "";
}


// --- Viewer Component ---

function Viewer({ tour, activeNodeIdx, onNodeChange }: { tour: TourData, activeNodeIdx: number, onNodeChange: (idx: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [openTooltip, setOpenTooltip] = useState<number | null>(null);
  
  // Transition veil
  const [veilOpacity, setVeilOpacity] = useState(0);

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
    
    // Load texture
    if (!nodeRef.current._tex) {
      if (nodeRef.current.pano === "generated") {
        nodeRef.current._tex = generatePanoramaTexture(nodeRef.current, tour.palette);
      } else {
        nodeRef.current._tex = new THREE.TextureLoader().load(nodeRef.current.pano) as any;
      }
    }
    const material = new THREE.MeshBasicMaterial({ map: nodeRef.current._tex });
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
      if (containerRef.current) {
        const cw = containerRef.current.clientWidth;
        const ch = containerRef.current.clientHeight;
        const hw = cw / 2; const hh = ch / 2;
        const camDir = new THREE.Vector3().subVectors(targetVec, camera.position).normalize();

        // Links (Floor arrows)
        const lDOMs = nodeRef.current.links.map((lk, i) => {
          // pitch roughly -24 deg (-0.42 rad) on the floor
          const lPhi = THREE.MathUtils.degToRad(90 - (-24));
          const lTheta = THREE.MathUtils.degToRad(lk.yaw);
          const v = new THREE.Vector3(
            430 * Math.sin(lPhi) * Math.cos(lTheta),
            430 * Math.cos(lPhi),
            430 * Math.sin(lPhi) * Math.sin(lTheta)
          );
          const dot = camDir.dot(v.clone().normalize());
          
          // distance to scale marker down as it approaches horizon
          const scale = Math.max(0.4, Math.min(1, dot * 1.5));
          
          v.project(camera);
          const x = (v.x * hw) + hw;
          const y = -(v.y * hh) + hh;
          const visible = dot > 0 && x > -100 && x < cw + 100 && y > -100 && y < ch + 100;
          return { id: i, ...lk, x, y, visible, scale };
        });
        setLinkDOMs(lDOMs);

        // Hotspots (Info markers)
        const hDOMs = nodeRef.current.hotspots.map((hs, i) => {
          const hPhi = THREE.MathUtils.degToRad(90 - hs.pitch);
          const hTheta = THREE.MathUtils.degToRad(hs.yaw);
          const v = new THREE.Vector3(
            420 * Math.sin(hPhi) * Math.cos(hTheta),
            420 * Math.cos(hPhi),
            420 * Math.sin(hPhi) * Math.sin(hTheta)
          );
          const dot = camDir.dot(v.clone().normalize());
          v.project(camera);
          const x = (v.x * hw) + hw;
          const y = -(v.y * hh) + hh;
          const visible = dot > 0 && x > -50 && x < cw + 50 && y > -50 && y < ch + 50;
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
  }, [tour.id]); // Re-init on tour change

  // Handle Node Swap
  useEffect(() => {
    if (!materialRef.current) return;
    
    if (!node._tex) {
      if (node.pano === "generated") node._tex = generatePanoramaTexture(node, tour.palette);
      else node._tex = new THREE.TextureLoader().load(node.pano) as any;
    }
    
    materialRef.current.map = node._tex || null;
    materialRef.current.needsUpdate = true;
    setOpenTooltip(null);
  }, [node, tour.palette]);

  // Transition handler
  const handleLinkClick = (targetNodeId: string) => {
    const targetIdx = tour.nodes.findIndex(n => n.id === targetNodeId);
    if (targetIdx === -1) return;
    
    handleInteract();
    
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      onNodeChange(targetIdx);
      return;
    }

    // Dolly & Veil Transition
    camState.current.targetFov -= 10;
    setVeilOpacity(1);
    
    setTimeout(() => {
      onNodeChange(targetIdx);
      camState.current.targetFov += 10;
      setVeilOpacity(0);
    }, 150); // Midpoint swap
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
    <div className="w-full flex flex-col font-sans">
      
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
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" />

        {/* Transition Veil */}
        <div 
          className="absolute inset-0 bg-black pointer-events-none z-40 transition-opacity duration-[140ms] ease-in-out"
          style={{ opacity: veilOpacity }}
        />

        {/* Chrome Badges */}
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

        {/* Drag Hint */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
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
            className="absolute z-20 transition-opacity duration-200"
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
                  className={`absolute top-1/2 -translate-y-1/2 w-48 md:w-56 p-4 rounded-xl shadow-2xl z-30 ${hs.leftSide ? 'right-full mr-6' : 'left-full ml-6'}`}
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
            className="absolute z-20 transition-all duration-100 group/link"
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
              aria-label={`Move to ${lk.label}`}
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

        {/* Minimap Overlay (Desktop only) */}
        <div className="absolute bottom-28 left-6 hidden md:block bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-4 w-48 z-10 pointer-events-none">
          <div className="font-mono text-[9px] text-text-secondary tracking-widest uppercase mb-3">Floor Plan</div>
          <div className="relative w-full aspect-square">
            <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
              {/* Draw connections */}
              {tour.nodes.map(n => 
                n.links.map(lk => {
                  const target = tour.nodes.find(tn => tn.id === lk.to);
                  if(!target) return null;
                  return (
                    <line 
                      key={`${n.id}-${target.id}`} 
                      x1={n.map.x} y1={n.map.y} 
                      x2={target.map.x} y2={target.map.y} 
                      stroke="rgba(255,255,255,0.2)" strokeWidth="2" 
                    />
                  );
                })
              )}
              {/* Draw nodes */}
              {tour.nodes.map((n, i) => {
                const isActive = i === activeNodeIdx;
                return (
                  <g key={n.id}>
                    {isActive && <circle cx={n.map.x} cy={n.map.y} r="8" stroke="#ff2e2e" strokeWidth="1" fill="none" className="animate-ping" />}
                    <circle 
                      cx={n.map.x} cy={n.map.y} 
                      r={isActive ? "5" : "4"} 
                      fill={isActive ? "#ff2e2e" : "rgba(255,255,255,0.5)"} 
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 flex justify-between items-end z-10 pointer-events-none">
          
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
    setThumbUrl(getThumbnail(tour));
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
          4 POSITIONS
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
  const [activeTourId, setActiveTourId] = useState<string>(TOURS[0].id);
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
        <Viewer tour={activeTour} activeNodeIdx={activeNodeIdx} onNodeChange={setActiveNodeIdx} />
        
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

      </div>
    </section>
  );
}
