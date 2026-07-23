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

export const TOURS: TourData[] = [
  {
    id: 'cafe', 
    name: 'Café Esthétique', 
    sub: 'Café — high-retention social layout',
    spec: '4 positions · menu hotspots',
    nodes: [
      { id: 'entrance', label: 'Entrance', pano: '/tours/cafe/01-entrance.jpg',
        links: [{ to: 'counter', yaw: 0, label: 'To the counter' }],
        hotspots: [{ yaw: -1.35, pitch: 0.02, kind: 'Detail', title: 'The doorway', text: 'A tour always opens at the entrance — the same view a customer gets walking in.' }] },
      { id: 'counter', label: 'Counter', pano: '/tours/cafe/02-counter.jpg',
        links: [{ to: 'entrance', yaw: Math.PI, label: 'Back to entrance' }, { to: 'seating', yaw: 0.30, label: 'To the seating' }],
        hotspots: [{ yaw: 0.05, pitch: 0.10, kind: 'Menu', title: "Today's menu", text: 'Tap the board and the live menu opens inside the tour. No PDF, no app, no leaving Google.' }] },
      { id: 'seating', label: 'Seating', pano: '/tours/cafe/03-seating.jpg',
        links: [{ to: 'counter', yaw: Math.PI - 0.30, label: 'Back to counter' }, { to: 'window', yaw: 0.55, label: 'To the window seats' }],
        hotspots: [{ yaw: -0.90, pitch: -0.02, kind: 'Booking', title: 'Reserve a table', text: 'A hotspot can link straight to your booking system or WhatsApp.' }] },
      { id: 'window', label: 'Window seats', pano: '/tours/cafe/04-window.jpg',
        links: [{ to: 'seating', yaw: Math.PI + 0.55, label: 'Back to seating' }],
        hotspots: [{ yaw: 0.10, pitch: -0.04, kind: 'Detail', title: 'The corner seat', text: 'Show the spot people always ask for. This is the seat that sells the café.' }] }
    ]
  },
  {
    id: 'gym', 
    name: 'The Iron Forge Gym', 
    sub: 'Fitness facility — spatial trust',
    spec: '4 positions · equipment tags',
    nodes: [
      { id: 'reception', label: 'Reception', pano: '/tours/gym/01-reception.jpg',
        links: [{ to: 'weights', yaw: 0, label: 'To free weights' }],
        hotspots: [{ yaw: -1.20, pitch: 0.02, kind: 'Sign-up', title: 'Trial session', text: "Put the join button in the room they're standing in." }] },
      { id: 'weights', label: 'Free weights', pano: '/tours/gym/02-weights.jpg',
        links: [{ to: 'reception', yaw: Math.PI, label: 'Back to reception' }, { to: 'cardio', yaw: 0.42, label: 'To the cardio floor' }],
        hotspots: [{ yaw: -0.55, pitch: -0.03, kind: 'Equipment', title: 'Free weights zone', text: 'Tag every zone so a prospective member sees exactly what they get.' }] },
      { id: 'cardio', label: 'Cardio floor', pano: '/tours/gym/03-cardio.jpg',
        links: [{ to: 'weights', yaw: Math.PI - 0.42, label: 'Back to weights' }, { to: 'studio', yaw: 0.62, label: 'To the studio' }],
        hotspots: [{ yaw: 0.30, pitch: -0.05, kind: 'Detail', title: 'Never crowded', text: "Show the machines are new and the floor has space. That's the real objection." }] },
      { id: 'studio', label: 'Studio', pano: '/tours/gym/04-studio.jpg',
        links: [{ to: 'cardio', yaw: Math.PI + 0.62, label: 'Back to cardio' }],
        hotspots: [{ yaw: 0, pitch: 0.02, kind: 'Classes', title: 'Class studio', text: 'Link the timetable right where the classes happen.' }] }
    ]
  }
];
