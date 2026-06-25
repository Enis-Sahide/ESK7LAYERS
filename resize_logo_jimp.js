const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

async function run() {
  const iconPath = 'c:/projeler/proje1/assets/images/icon.png';
  const webLogoPath = 'c:/projeler/proje1-web/public/logo.png';
  const outputPath = 'c:/projeler/proje1/android_logo_512.png';
  const artifactPath = 'C:/Users/baha/.gemini/antigravity-ide/brain/3760d1ae-1f53-4bf0-9ac9-657fb432e773/android_logo_512.png';

  let sourcePath = iconPath;
  if (!fs.existsSync(sourcePath)) {
    sourcePath = webLogoPath;
  }

  if (!fs.existsSync(sourcePath)) {
    console.error('Source logo not found at either path!');
    return;
  }

  console.log('Reading source image from:', sourcePath);
  try {
    const image = await Jimp.read(sourcePath);
    console.log('Original size:', image.width, 'x', image.height);
    
    // Resize to 512x512
    image.resize({ w: 512, h: 512 });
    
    // Save to outputs
    await image.write(outputPath);
    console.log('Saved resized logo to:', outputPath);

    await image.write(artifactPath);
    console.log('Saved resized logo to artifact path:', artifactPath);
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

run();
