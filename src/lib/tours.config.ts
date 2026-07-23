// tours.config.ts
//
// Panorama requirements: 
// Equirectangular JPG, 2:1 ratio, max 4096×2048, ~80% quality, under ~1.5MB, 
// stored in /public/tours/{venue}/

export type Hotspot = {
  yaw: number;
  pitch: number;
  kind: string;
  title: string;
  text: string;
};

export type NodeLink = {
  to: string; // id of target node
  yaw: number;
  label: string;
};

export type TourNode = {
  id: string;
  label: string;
  pano: string;
  links: NodeLink[];
  hotspots: Hotspot[];
  _tex?: any; // Cached THREE.Texture
};

export type TourData = {
  id: string;
  name: string;
  sub: string;
  spec: string;
  nodes: TourNode[];
};

export const TOURS: TourData[] = [];

// When the real shoot is ready, populate like this:
// export const TOURS: TourData[] = [{
//   id: 'banyan', 
//   name: 'The Banyan Tree Café', 
//   sub: 'Café — Mangalore',
//   spec: '4 positions · menu hotspots',
//   nodes: [
//     { 
//       id: 'entrance', 
//       label: 'Entrance', 
//       pano: '/tours/banyan/01-entrance.jpg',
//       links: [{ to: 'counter', yaw: 0, label: 'To the counter' }],
//       hotspots: [{ yaw: -1.2, pitch: 0, kind: 'Menu', title: 'Coffee Menu', text: 'Locally sourced beans.' }] 
//     }
//   ]
// }];
