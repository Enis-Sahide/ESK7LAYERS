const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, '../src/data/kabbalahLessons.ts');
let content = fs.readFileSync(lessonsPath, 'utf8');

// Regex to find items in the lessons object
const itemRegex = /\{\s*"title":\s*"(.*?)",\s*("image":\s*require\(.*?\),\s*)?"content":\s*"(.*?)"\s*\}/gs;

let updatedContent = content.replace(itemRegex, (match, title, existingImage, itemContent) => {
  // If it already has an image, maybe we leave it, but let's check if there's an image in the content
  let filename = null;
  
  // Check for markdown image: ![...](.../filename.ext)
  const mdMatch = itemContent.match(/!\[.*?\]\([^)]*\/([^/)]+\.(?:jpg|png))\)/);
  if (mdMatch) {
    filename = mdMatch[1];
  } else {
    // Check for HTML image: <img src=".../filename.ext" ... />
    const htmlMatch = itemContent.match(/<img[^>]*src="[^"]*\/([^/"]+\.(?:jpg|png))"[^>]*>/);
    if (htmlMatch) {
      filename = htmlMatch[1];
    }
  }

  if (filename) {
    // We found an image reference in the content! Let's inject the image property.
    // Replace existing image if any, or add it
    const reqString = `"image": require('../../assets/images/kabbalah/ai_generated/${filename}'),\n        `;
    return `{\n        "title": "${title}",\n        ${reqString}"content": "${itemContent}"\n      }`;
  }
  
  return match;
});

fs.writeFileSync(lessonsPath, updatedContent, 'utf8');
console.log('Successfully updated kabbalahLessons.ts with all images!');
