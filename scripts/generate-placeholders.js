const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const files = [
  'cafe/01-entrance.jpg',
  'cafe/02-counter.jpg',
  'cafe/03-seating.jpg',
  'cafe/04-window.jpg',
  'gym/01-reception.jpg',
  'gym/02-weights.jpg',
  'gym/03-cardio.jpg',
  'gym/04-studio.jpg'
];

async function generate() {
  for (const file of files) {
    const fullPath = path.join(__dirname, '../public/tours', file);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    
    // Create a 4096x2048 solid color image with some noise or gradient so it looks like a panorama
    // Actually a solid color is fine for placeholder. Let's make cafe warm and gym cool.
    const isCafe = file.includes('cafe');
    const bg = isCafe ? { r: 180, g: 140, b: 100 } : { r: 100, g: 120, b: 160 };
    
    await sharp({
      create: {
        width: 4096,
        height: 2048,
        channels: 3,
        background: bg
      }
    })
    .jpeg({ quality: 80 })
    .toFile(fullPath);
    console.log(`Generated ${fullPath}`);
  }
}

generate();
