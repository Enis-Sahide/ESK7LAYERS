const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDirs = [
  path.join(__dirname, '../assets/images')
];

// Dosyalar app.json içinde kullanıldığı için çevrilmemeli ve isimleri değişmemeli
const exclusions = [
  'icon.png',
  'splash-icon.png',
  'android-icon-foreground.png',
  'favicon.png',
  'partial-react-logo.png',
  'react-logo.png',
  'react-logo@2x.png',
  'react-logo@3x.png'
];

async function convertImages(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await convertImages(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if ((ext === '.png' || ext === '.jpg' || ext === '.jpeg') && !exclusions.includes(file)) {
        const newPath = fullPath.substring(0, fullPath.lastIndexOf('.')) + '.webp';
        
        try {
          await sharp(fullPath)
            .webp({ quality: 80 })
            .toFile(newPath);
            
          console.log(`Dönüştürüldü: ${file} -> ${path.basename(newPath)}`);
          
          // Orijinal dosyayı sil
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.error(`Hata (${file}):`, err);
        }
      }
    }
  }
}

async function run() {
  for (const dir of targetDirs) {
    if (fs.existsSync(dir)) {
      console.log(`Taraniyor: ${dir}`);
      await convertImages(dir);
    }
  }
  console.log("Tüm dönüştürme işlemleri tamamlandı.");
}

run();
