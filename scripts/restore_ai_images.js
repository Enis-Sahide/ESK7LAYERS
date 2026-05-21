const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, '../src/data/kabbalahLessons.ts');
let content = fs.readFileSync(lessonsPath, 'utf8');

const aiImagesDir = path.join(__dirname, '../assets/images/kabbalah/ai_generated');
const imageFiles = fs.readdirSync(aiImagesDir);

// Remove the previously injected `image: require(...)` lines from kabbalah2
content = content.replace(/"image": require\('\.\.\/\.\.\/assets\/images\/kabbalah\/kabbalah2\/.*?'\),\s*/g, '');

const newContent = content.replace(/"content": "(.*?)"/g, (match, textContent) => {
  let mappedImage = null;
  
  // Try to find ![alt](path/photo_XX.jpg)
  const markdownImgRegex = /!\[.*?\]\(.*?\/(photo_\d+)\.jpg\)/;
  const mdMatch = textContent.match(markdownImgRegex);
  if (mdMatch) {
    const photoId = mdMatch[1]; // e.g. photo_8
    // Find the corresponding ai_photo_8_...png
    const aiFile = imageFiles.find(f => f.startsWith(`ai_${photoId}_`) || f === `${photoId}.jpg`);
    if (aiFile) {
      mappedImage = aiFile;
    }
  }

  // Try to find <img src=".../filename.png"
  const htmlImgRegex = /<img.*?src="file:\/\/\/.*?\/(.*?)".*?>/;
  const htmlMatch = textContent.match(htmlImgRegex);
  if (htmlMatch) {
    const filename = htmlMatch[1];
    if (imageFiles.includes(filename)) {
      mappedImage = filename;
    }
  }

  if (mappedImage) {
    return `"image": require('../../assets/images/kabbalah/ai_generated/${mappedImage}'),\n        "content": "${textContent}"`;
  }
  return match;
});

fs.writeFileSync(lessonsPath, newContent, 'utf8');
console.log('Restored AI images successfully.');
