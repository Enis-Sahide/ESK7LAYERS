const fs = require('fs');

const text = fs.readFileSync('scratch/hrn_corrected.txt', 'utf8');
const lines = text.split(/\r?\n/);

const diseases = [];
let currentDisease = null;
let state = 'IDLE'; // IDLE | CAUSE | AFFIRMATION

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check if line starts a new disease
    // Regex: anything, then colon, then optional spaces, then open parenthesis
    const match = line.match(/^(.+?)\s*:\s*\((.*)$/);
    
    if (match) {
        // We found a new disease
        if (currentDisease) {
            diseases.push(currentDisease);
        }
        
        let name = match[1].trim();
        let rest = match[2];
        
        currentDisease = {
            name: name,
            cause: '',
            affirmation: ''
        };
        
        // Remove known garbage from name
        if (currentDisease.name.includes('YAPTIRIMLAR')) {
            currentDisease.name = currentDisease.name.split('YAPTIRIMLAR')[1].trim();
        }
        
        // Check if `)` is on this line
        const closingIndex = rest.indexOf(')');
        if (closingIndex !== -1) {
            currentDisease.cause = rest.substring(0, closingIndex).trim();
            currentDisease.affirmation = rest.substring(closingIndex + 1).trim();
            state = 'AFFIRMATION';
        } else {
            currentDisease.cause = rest.trim();
            state = 'CAUSE';
        }
    } else {
        if (currentDisease) {
            if (state === 'CAUSE') {
                const closingIndex = line.indexOf(')');
                if (closingIndex !== -1) {
                    currentDisease.cause += ' ' + line.substring(0, closingIndex).trim();
                    currentDisease.affirmation = line.substring(closingIndex + 1).trim();
                    state = 'AFFIRMATION';
                } else {
                    currentDisease.cause += ' ' + line.trim();
                }
            } else if (state === 'AFFIRMATION') {
                currentDisease.affirmation += ' ' + line.trim();
            }
        }
    }
}

if (currentDisease) {
    diseases.push(currentDisease);
}

// Clean up properties
diseases.forEach(d => {
    d.cause = d.cause.replace(/\s+/g, ' ').trim();
    d.affirmation = d.affirmation.replace(/\s+/g, ' ').trim();
});

// Sort alphabetically by name
diseases.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

// Debug Grip and Alkolizm
console.log('Grip:', diseases.find(d => d.name.toLowerCase().includes('grip')));
console.log('Alkolizm:', diseases.find(d => d.name.toLowerCase().includes('alkolizm')));
console.log('Alzheimer:', diseases.find(d => d.name.toLowerCase().includes('alzheimer')));

const tsContent = `export interface EmotionalDisease {
  name: string;
  cause: string;
  affirmation: string;
}

export const EMOTIONAL_DISEASES: EmotionalDisease[] = ${JSON.stringify(diseases, null, 2)};
`;

fs.writeFileSync('src/data/emotionalDiseases.ts', tsContent);
console.log('Saved ' + diseases.length + ' diseases.');
