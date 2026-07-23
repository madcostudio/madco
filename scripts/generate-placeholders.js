const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createPlaceholders() {
  const dir = path.join(__dirname, '../public/tours/cafe');
  fs.mkdirSync(dir, { recursive: true });

  const thumbDir = path.join(__dirname, '../public/tours/thumbs');
  fs.mkdirSync(thumbDir, { recursive: true });

  const files = [
    '01-art_studio.jpg',
    '02-ballroom.jpg',
    '03-billiard_hall.jpg',
    '04-artist_workshop.jpg'
  ];

  const svgText = `
  <svg width="4096" height="2048" xmlns="http://www.w3.org/2000/svg">
    <style>
      .title { fill: #FF2E2E; font-family: monospace; font-size: 100px; font-weight: bold; }
      .sub { fill: #FFFFFF; font-family: sans-serif; font-size: 60px; }
    </style>
    <rect width="100%" height="100%" fill="#121214" />
    <text x="50%" y="45%" text-anchor="middle" class="title">RESERVED FOR DEMO INTERIOR</text>
    <text x="50%" y="55%" text-anchor="middle" class="sub">Replace this file with a licensed 4K equirectangular image.</text>
  </svg>
  `;

  for (const file of files) {
    const outPath = path.join(dir, file);
    await sharp(Buffer.from(svgText))
      .jpeg({ quality: 80 })
      .toFile(outPath);
    console.log('Created placeholder:', outPath);
  }

  const thumbSvg = `
  <svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
    <style>
      .title { fill: #FF2E2E; font-family: monospace; font-size: 30px; font-weight: bold; }
    </style>
    <rect width="100%" height="100%" fill="#121214" />
    <text x="50%" y="50%" text-anchor="middle" class="title">DEMO PLACEHOLDER</text>
  </svg>
  `;
  const thumbPath = path.join(thumbDir, 'cafe.jpg');
  await sharp(Buffer.from(thumbSvg)).jpeg({ quality: 80 }).toFile(thumbPath);
  console.log('Created thumbnail:', thumbPath);
}

createPlaceholders();
