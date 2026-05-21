const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

const aiImagesDir = path.join(__dirname, '../assets/images/kabbalah/ai_generated');

async function resizeImages() {
  try {
    const files = fs.readdirSync(aiImagesDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    
    console.log(`Found ${files.length} images to resize...`);
    
    for (const file of files) {
      const filePath = path.join(aiImagesDir, file);
      const originalSize = fs.statSync(filePath).size;
      
      // If it's already small enough, skip it (e.g. < 100KB)
      if (originalSize < 100 * 1024) {
        console.log(`Skipping ${file} (${Math.round(originalSize/1024)}KB) - already small.`);
        continue;
      }

      console.log(`Processing ${file} (Original: ${Math.round(originalSize/1024)}KB)...`);
      
      const image = await Jimp.read(filePath);
      
      // Get current dimensions
      const width = image.bitmap.width;
      const height = image.bitmap.height;
      
      // Resize to a mobile-friendly max width (e.g., 600px) while preserving aspect ratio
      // Only resize if it's larger than 600px
      if (width > 600) {
        image.resize({ w: 600 });
      } 
      
      // Save over the original file
      await image.write(filePath);
      
      const newSize = fs.statSync(filePath).size;
      console.log(`Done ${file}: ${Math.round(originalSize/1024)}KB -> ${Math.round(newSize/1024)}KB`);
    }
    
    console.log('All images resized successfully!');
  } catch (error) {
    console.error('Error resizing images:', error);
  }
}

resizeImages();
