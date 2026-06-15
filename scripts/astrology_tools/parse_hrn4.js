const fs = require('fs');

const text = fs.readFileSync('scratch/hrn_corrected.txt', 'utf8');

// We know every disease definition contains a `:` followed immediately by `(` or spaces then `(`.
// Let's use a regex that matches `[Name] : ([Cause]) [Affirmation]`
// We can find all occurrences of ` : (` or ` :(` or `:\s*\(`
const regex = /([^.\n]+?)\s*:\s*\((.*?)\)\s*([\s\S]*?)(?=(?:\n[^.\n]+?\s*:\s*\()|$)/g;

let matches;
const diseases = [];

while ((matches = regex.exec(text)) !== null) {
    let name = matches[1].replace(/\n/g, ' ').trim();
    let cause = matches[2].replace(/\n/g, ' ').trim();
    let affirmation = matches[3].replace(/\n/g, ' ').trim();

    // Clean up name by taking only the last part if it contains previous garbage
    // Sometimes 'name' might capture the end of the previous affirmation if the lookahead failed
    // Affirmations usually end with a dot. So we can split by dot and take the last part.
    if (name.includes('.')) {
        let parts = name.split('.');
        name = parts[parts.length - 1].trim();
    }
    
    // Remove "HASTALIKLARIN RUHSAL NEDENLERİ" etc.
    if (name.includes('YAPTIRIMLAR')) {
        name = name.split('YAPTIRIMLAR')[1].trim();
    }

    if (name.length > 0 && name.length < 80 && cause.length > 0) {
        diseases.push({ name, cause, affirmation });
    }
}

// Check for Grip
let grip = diseases.find(d => d.name.toLowerCase().includes('grip'));
console.log('Grip:', grip);

const tsContent = `export interface EmotionalDisease {
  name: string;
  cause: string;
  affirmation: string;
}

export const EMOTIONAL_DISEASES: EmotionalDisease[] = ${JSON.stringify(diseases, null, 2)};
`;

fs.writeFileSync('src/data/emotionalDiseases.ts', tsContent);
console.log('Saved ' + diseases.length + ' diseases.');
