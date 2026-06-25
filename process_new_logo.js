const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

async function run() {
  const uploadedLogoPath = 'C:/Users/baha/.gemini/antigravity-ide/brain/3760d1ae-1f53-4bf0-9ac9-657fb432e773/media__1781979347883.png';
  const bgPath = 'c:/projeler/proje1-web/public/galaxy-bg.png';
  const fallbackBgPath = 'c:/projeler/proje1/assets/images/backgrounds/esoteric_bg.webp';
  
  // Output paths for logo
  const logoOutput1 = 'c:/projeler/proje1/android_logo_512.png';
  const logoOutput2 = 'C:/Users/baha/.gemini/antigravity-ide/brain/3760d1ae-1f53-4bf0-9ac9-657fb432e773/android_logo_512.png';

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

  console.log('Processing uploaded logo:', uploadedLogoPath);
  console.log('Using background:', selectedBg);

  try {
    // 1. Process Logo
    const logoImage = await Jimp.read(uploadedLogoPath);
    console.log('Original logo size:', logoImage.width, 'x', logoImage.height);
    
    // Resize to 512x512
    logoImage.resize({ w: 512, h: 512 });
    await logoImage.write(logoOutput1);
    await logoImage.write(logoOutput2);
    console.log('Logo resized to 512x512 and saved.');

    // 2. Process Feature Graphic
    const bgImage = await Jimp.read(selectedBg);
    console.log('Original background size:', bgImage.width, 'x', bgImage.height);

    // Cover crop background to 1024x500
    bgImage.cover({ w: 1024, h: 500 });

    // Add a dark semi-transparent overlay to make the logo pop
    const overlay = new Jimp({ width: 1024, height: 500, color: 0x00000088 });
    bgImage.composite(overlay, 0, 0);

    // Load and resize logo for composite (220x220)
    const fgLogo = await Jimp.read(uploadedLogoPath);
    fgLogo.resize({ w: 220, h: 220 });

    // Calculate center coordinates
    const x = Math.round((1024 - 220) / 2);
    const y = Math.round((500 - 220) / 2);

    // Composite logo onto background
    bgImage.composite(fgLogo, x, y);

    // Save outputs
    await bgImage.write(fgOutput1);
    await bgImage.write(fgOutput2);
    console.log('Feature graphic 1024x500 generated and saved.');

  } catch (err) {
    console.error('Error processing assets:', err);
  }
}

run();
