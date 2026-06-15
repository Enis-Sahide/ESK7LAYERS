const fs = require('fs');

const raw = fs.readFileSync('scratch/hrn_extracted.txt', 'utf8');

// The text is reversed per page due to pdf2json
const pages = raw.split(/----------------Page \(\d+\) Break----------------/);

let correctText = '';
for (let page of pages) {
    let lines = page.split('\n');
    lines.reverse();
    correctText += lines.join('\n') + '\n';
}

fs.writeFileSync('scratch/hrn_corrected.txt', correctText);

// Now let's try to extract Disease: (Cause) Affirmation
const regex = /([A-ZÇĞİÖŞÜ][A-Za-zçğıöşü\s\-\,]+?)\s*:\s*\((.*?)\)\s*(.*?)(?=(?:[A-ZÇĞİÖŞÜ][A-Za-zçğıöşü\s\-\,]+?\s*:\s*\()|$)/gs;

let matches;
const diseases = [];

while ((matches = regex.exec(correctText)) !== null) {
    let name = matches[1].replace(/\n/g, ' ').trim();
    let cause = matches[2].replace(/\n/g, ' ').trim();
    let affirmation = matches[3].replace(/\n/g, ' ').trim();
    
    // clean up
    name = name.replace(/\s+/g, ' ');
    cause = cause.replace(/\s+/g, ' ');
    affirmation = affirmation.replace(/\s+/g, ' ');

    if (name.length > 0 && cause.length > 0) {
        diseases.push({ name, cause, affirmation });
    }
}

const tsContent = `export interface EmotionalDisease {
  name: string;
  cause: string;
  affirmation: string;
}

export const EMOTIONAL_DISEASES: EmotionalDisease[] = ${JSON.stringify(diseases, null, 2)};
`;

fs.writeFileSync('src/data/emotionalDiseases.ts', tsContent);
console.log('Saved ' + diseases.length + ' diseases.');
