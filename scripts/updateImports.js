const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../app'),
  path.join(__dirname, '../src')
];

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

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Sadece tırnak içindeki .png/.jpg'leri bul, ama içinde http veya https geçenleri YANİ supabase vs URL'lerini atla.
  const regex = /(['"])(.*?)([a-zA-Z0-9_.-]+)\.(png|jpg|jpeg)(['"])/gi;
  
  content = content.replace(regex, (match, quoteStart, pathPrefix, filename, ext, quoteEnd) => {
    if (pathPrefix.includes('http://') || pathPrefix.includes('https://')) {
      return match; // Bulut (Supabase) URL'lerine dokunma!
    }
    const fullFileName = `${filename}.${ext}`;
    if (exclusions.includes(fullFileName) || exclusions.includes(fullFileName.toLowerCase())) {
      return match; // Bırak, çevrilmemesi gereken ikon dosyaları
    }
    return `${quoteStart}${pathPrefix}${filename}.webp${quoteEnd}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Güvenli Güncellendi: ${filePath}`);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverseDir(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.tsx' || ext === '.ts' || ext === '.js' || ext === '.jsx' || ext === '.json') {
        processFile(fullPath);
      }
    }
  }
}

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    traverseDir(dir);
  }
});
console.log("Kod güncellemeleri GÜVENLE tamamlandı.");
