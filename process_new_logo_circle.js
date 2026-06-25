const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

function cropToCircleAndAddGoldBorder(image) {
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  const data = image.bitmap.data;
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2;
  const borderWidth = 3; // 3-pixel gold border

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idx = 4 * (y * width + x);

      if (dist > r) {
        data[idx + 3] = 0; // Make transparent outside the circle
      } else if (dist >= r - borderWidth) {
        // Draw Gold Border (Hex: #D4AF37 -> R: 212, G: 175, B: 55)
        // Apply smooth anti-aliased edge to the outer border pixel
        if (dist > r - 1) {
          const factor = r - dist; // 0 to 1
          data[idx] = 212;
          data[idx + 1] = 175;
          data[idx + 2] = 55;
          data[idx + 3] = Math.round(255 * factor);
        } else {
          data[idx] = 212;
          data[idx + 1] = 175;
          data[idx + 2] = 55;
          data[idx + 3] = 255;
        }
      } else if (dist > r - borderWidth - 1) {
        // Blend gold border inner edge
        const factor = (dist - (r - borderWidth - 1)); // 0 to 1
        data[idx] = Math.round(data[idx] * (1 - factor) + 212 * factor);
        data[idx + 1] = Math.round(data[idx + 1] * (1 - factor) + 175 * factor);
        data[idx + 2] = Math.round(data[idx + 2] * (1 - factor) + 55 * factor);
      }
    }
  }
}

async function run() {
  const uploadedLogoPath = 'C:/Users/baha/.gemini/antigravity-ide/brain/3760d1ae-1f53-4bf0-9ac9-657fb432e773/media__1781979347883.png';
  const bgPath = 'c:/projeler/proje1-web/public/galaxy-bg.png';
  const fallbackBgPath = 'c:/projeler/proje1/assets/images/backgrounds/esoteric_bg.webp';
  
  // Output paths for feature graphic
  const fgOutput1 = 'c:/projeler/proje1/android_feature_graphic_1024_500.png';
  const fgOutput2 = 'C:/Users/baha/.gemini/antigravity-ide/brain/3760d1ae-1f53-4bf0-9ac9-657fb432e773/android_feature_graphic_1024_500.png';

  if (!fs.existsSync(uploadedLogoPath)) {
    console.error('Uploaded logo not found at:', uploadedLogoPath);
    return;
  }

  let selectedBg = bgPath;
  if (!fs.existsSync(selectedBg)) {
    selectedBg = fallbackBgPath;
  }

  try {
    console.log('Generating feature graphic with circular cropped logo...');
    
    // Load background and cover crop to 1024x500
    const bgImage = await Jimp.read(selectedBg);
    bgImage.cover({ w: 1024, h: 500 });

    // Add a dark semi-transparent overlay to make the logo pop
    const overlay = new Jimp({ width: 1024, height: 500, color: 0x00000088 });
    bgImage.composite(overlay, 0, 0);

    // Load and resize logo for composite (220x220)
    const fgLogo = await Jimp.read(uploadedLogoPath);
    fgLogo.resize({ w: 220, h: 220 });

    // Crop logo to circle and add gold border
    cropToCircleAndAddGoldBorder(fgLogo);

    // Calculate center coordinates
    const x = Math.round((1024 - 220) / 2);
    const y = Math.round((500 - 220) / 2);

    // Composite circular logo onto background
    bgImage.composite(fgLogo, x, y);

    // Save outputs
    await bgImage.write(fgOutput1);
    await bgImage.write(fgOutput2);
    console.log('Circular logo composite feature graphic created successfully!');

  } catch (err) {
    console.error('Error generating feature graphic:', err);
  }
}

run();
