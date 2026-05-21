const { Jimp } = require('jimp');

async function combineImages() {
  try {
    const dir = 'C:/Users/baha/.gemini/antigravity/brain/8def928c-8c15-41aa-869e-0300dc7079ba/';
    const files = [
      'media__1779378236389.jpg',
      'media__1779378263072.jpg',
      'media__1779378275357.jpg',
      'media__1779378280379.jpg'
    ];

    const images = [];
    let totalWidth = 0;
    let maxHeight = 0;

    for (const file of files) {
      const img = await Jimp.read(dir + file);
      images.push(img);
      totalWidth += img.bitmap.width;
      maxHeight = Math.max(maxHeight, img.bitmap.height);
    }

    // Create a new blank white image
    const combined = new Jimp({ width: totalWidth, height: maxHeight, color: 0xFFFFFFFF });

    let currentX = 0;
    for (const img of images) {
      // Center vertically if heights differ
      const yOffset = Math.floor((maxHeight - img.bitmap.height) / 2);
      combined.composite(img, currentX, yOffset);
      currentX += img.bitmap.width;
    }

    const outputPath = 'C:/projeler/proje1/assets/images/kabbalah/ai_generated/geometric_evolution.png';
    await combined.write(outputPath);
    console.log('Successfully combined the REAL images into ' + outputPath);

  } catch (error) {
    console.error('Error combining images:', error);
  }
}

combineImages();
