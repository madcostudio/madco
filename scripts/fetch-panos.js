const fs = require('fs');
const path = require('path');
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
  ],
  restaurant: [
    'abandoned_games_room_01',
    'abandoned_games_room_02',
    'abandoned_workshop_02',
    'bank_vault'
  ]
};

async function fetchAndProcess() {
  for (const [venue, keys] of Object.entries(scenes)) {
    const dir = path.join(__dirname, '../public/tours', venue);
    fs.mkdirSync(dir, { recursive: true });

    const thumbDir = path.join(__dirname, '../public/tours/thumbs');
    fs.mkdirSync(thumbDir, { recursive: true });

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const outName = `0${i + 1}-${key}.jpg`;
      const outPath = path.join(dir, outName);

      console.log(`Processing ${venue}/${outName}...`);

      try {
        const infoRes = await fetch(`https://api.polyhaven.com/files/${key}`);
        const info = await infoRes.json();
        
        let url;
        if (info.tonemapped && info.tonemapped.url) {
          url = info.tonemapped.url;
        } else if (info.hdri && info.hdri["4k"] && info.hdri["4k"].hdr) {
          url = info.hdri["4k"].hdr.url; // We might need to process HDR, but tonemapped is standard
        } else {
          console.error(`Skipping ${key} - no tonemapped URL found.`);
          continue;
        }

        const imgRes = await fetch(url);
        const buffer = await imgRes.arrayBuffer();

        // Save 4096x2048 main panorama
        await sharp(Buffer.from(buffer))
          .resize(4096, 2048, { fit: 'cover' })
          .jpeg({ quality: 80, progressive: true })
          .toFile(outPath);
        
        console.log(`Saved ${outPath}`);

        // If it's the first image, create a 16:9 thumbnail for the grid
        if (i === 0) {
          const thumbPath = path.join(thumbDir, `${venue}.jpg`);
          await sharp(Buffer.from(buffer))
            .resize(400, 225, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 75 })
            .toFile(thumbPath);
          console.log(`Saved Thumbnail: ${thumbPath}`);
        }

      } catch (err) {
        console.error(`Failed to process ${key}:`, err);
      }
    }
  }
}

fetchAndProcess();
