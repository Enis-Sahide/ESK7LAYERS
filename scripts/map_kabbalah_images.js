const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, '../src/data/kabbalahLessons.ts');
let content = fs.readFileSync(lessonsPath, 'utf8');

const imagesDir = path.join(__dirname, '../assets/images/kabbalah/kabbalah2');
const imageFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

let imageIndex = 0;

// We need to inject `image: require('../../assets/images/kabbalah/kabbalah2/filename.jpg'),` into items that have an image tag
const newContent = content.replace(/"content": "(.*?)"/g, (match, textContent) => {
  // Check if there is an image tag (![..](..) or <img ... />)
  if (textContent.includes('![') || textContent.includes('<img')) {
    // We found an image in this content!
    const imageToUse = imageFiles[imageIndex % imageFiles.length];
    imageIndex++;
    
    // Return the new content with the image property injected BEFORE the content property
    return `"image": require('../../assets/images/kabbalah/kabbalah2/${imageToUse}'),\n        "content": "${textContent}"`;
  }
  return match;
});

// Since the previous string replacement might add 'image' to the content string itself if we are not careful,
// Wait, the regex `"content": "(.*?)"` captures the entire content string.
// So we are returning `"image": require(...), "content": "..."` which is valid JS syntax.
// BUT we also need to strip the actual `![...]` and `<img...>` tags from the textContent to keep it clean!
// Actually, `renderFormattedText` already strips `![...]` in the UI! What about `<img...>`?
// I should strip `<img...>` from the UI as well.

fs.writeFileSync(lessonsPath, newContent, 'utf8');
console.log(`Mapped ${imageIndex} images successfully.`);
