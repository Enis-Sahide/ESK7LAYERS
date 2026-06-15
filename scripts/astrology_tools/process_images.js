const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

async function processImages() {
  const dir = path.join(__dirname, 'assets', 'images', 'runes');
  const files = fs.readdirSync(dir).filter(f => f.startsWith('Screenshot_') && f.endsWith('.png'));

  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const image = await Jimp.read(filePath);
      
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        
        // If it's bright (white/gray background), make it transparent
        if (r > 150 && g > 150 && b > 150) {
          this.bitmap.data[idx + 3] = 0; // alpha = 0
        } else {
          // If it's dark (the drawing/text), make it GOLD (#D4AF37 = 212, 175, 55)
          this.bitmap.data[idx + 0] = 212;
          this.bitmap.data[idx + 1] = 175;
          this.bitmap.data[idx + 2] = 55;
        }
      });
      
      const outPath = path.join(dir, 'processed_' + file);
      await image.write(outPath);
      console.log('Processed', file);
    } catch (e) {
      console.error('Error processing', file, e.message);
    }
  }
}

processImages().catch(console.error);
