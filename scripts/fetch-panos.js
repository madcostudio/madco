const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const scenes = {
  cafe: [
    'art_studio',
    'ballroom',
    'billiard_hall',
    'artist_workshop'
  ],
  gym: [
    'abandoned_bakery',
    'aerodynamics_workshop',
    'autoshop_01',
    'basement_boxing_ring'
  ]
};

const fileMap = {
  cafe: [
    '01-entrance.jpg',
    '02-counter.jpg',
    '03-seating.jpg',
    '04-window.jpg'
  ],
  gym: [
    '01-reception.jpg',
    '02-weights.jpg',
    '03-cardio.jpg',
    '04-studio.jpg'
  ]
};

async function downloadAndResize(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          await sharp(buffer)
            .resize(4096, 2048, { fit: 'fill' })
            .jpeg({ quality: 80 })
            .toFile(dest);
          console.log(`Saved: ${dest}`);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const venue of ['cafe', 'gym']) {
    const dir = path.join(__dirname, '../public/tours', venue);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    for (let i = 0; i < scenes[venue].length; i++) {
      const scene = scenes[venue][i];
      const filename = fileMap[venue][i];
      const url = `https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/${scene}.jpg`;
      const dest = path.join(dir, filename);
      
      console.log(`Downloading ${scene}...`);
      await downloadAndResize(url, dest);
    }
  }
}

run().catch(console.error);
