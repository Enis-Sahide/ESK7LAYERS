const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

async function run() {
  const iconPath = 'c:/projeler/proje1/assets/images/icon.png';
  const bgPath = 'c:/projeler/proje1-web/public/galaxy-bg.png';
  const fallbackBgPath = 'c:/projeler/proje1/assets/images/backgrounds/esoteric_bg.webp';
  const outputPath = 'c:/projeler/proje1/android_feature_graphic_1024_500.png';
  const artifactPath = 'C:/Users/baha/.gemini/antigravity-ide/brain/3760d1ae-1f53-4bf0-9ac9-657fb432e773/android_feature_graphic_1024_500.png';

  let selectedBg = bgPath;
  if (!fs.existsSync(selectedBg)) {
    selectedBg = fallbackBgPath;
  }

  if (!fs.existsSync(selectedBg)) {
    console.error('Background image not found!');
    return;
  }

  if (!fs.existsSync(iconPath)) {
    console.error('Logo icon not found!');
    return;
  }

  console.log('Using background:', selectedBg);
  console.log('Using logo:', iconPath);

  try {
    const bgImage = await Jimp.read(selectedBg);
    const logoImage = await Jimp.read(iconPath);

    console.log('Background size:', bgImage.width, 'x', bgImage.height);
    console.log('Logo size:', logoImage.width, 'x', logoImage.height);

    // Resize background to cover 1024x500 and crop
    bgImage.cover({ w: 1024, h: 500 });

    // Add a dark semi-transparent overlay to make the logo pop
    const overlay = new Jimp({ width: 1024, height: 500, color: 0x00000088 }); // 88 alpha
    bgImage.composite(overlay, 0, 0);

    // Resize logo to 220x220
    logoImage.resize({ w: 220, h: 220 });

    // Calculate center coordinates
    const x = Math.round((1024 - 220) / 2);
    const y = Math.round((500 - 220) / 2);

    // Composite logo onto background
    bgImage.composite(logoImage, x, y);

    // Save outputs
    await bgImage.write(outputPath);
    console.log('Saved feature graphic to:', outputPath);

    await bgImage.write(artifactPath);
    console.log('Saved feature graphic to artifact path:', artifactPath);
  } catch (err) {
    console.error('Error generating feature graphic:', err);
  }
}

run();
