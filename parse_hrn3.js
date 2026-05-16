const fs = require('fs');

const correctText = fs.readFileSync('scratch/hrn_corrected.txt', 'utf8');

// Use a regex that matches any character up to : ( and then captures the cause and affirmation.
// We can split the text by finding occurrences of ": (" or " : (" or " :("
// Actually, let's use a regex with global flag and lookahead.

const regex = /([^\n]+?)\s*:\s*\((.*?)\)\s*([\s\S]*?)(?=(?:[^\n]+?\s*:\s*\()|$)/g;

let matches;
const diseases = [];

while ((matches = regex.exec(correctText)) !== null) {
    let name = matches[1].replace(/\n/g, ' ').trim();
    let cause = matches[2].replace(/\n/g, ' ').trim();
    let affirmation = matches[3].trim();
    
    // Clean up affirmation: remove extra whitespace and newlines
    affirmation = affirmation.replace(/\s+/g, ' ');
    
    // The "name" might contain preceding text from a previous affirmation if the lookahead didn't catch properly,
    // OR we can just clean the name if it contains "HASTALIKLARIN RUHSAL NEDENLERİ", etc.
    if (name.includes('HASTALIKLARIN RUHSAL NEDENLERİ')) {
        name = name.split('HASTALIKLARIN RUHSAL NEDENLERİ')[1].trim();
    }
    if (name.includes('VE GEREKEN OLUMLAMA-YAPTIRIMLAR')) {
        name = name.split('VE GEREKEN OLUMLAMA-YAPTIRIMLAR')[1].trim();
    }
    
    // Some names might be too long if regex failed, let's skip them or trim
    if (name.length > 100) continue;

    if (name.length > 0 && cause.length > 0) {
        diseases.push({ name, cause, affirmation });
    }
}

// Sort alphabetically by name
diseases.sort((a, b) => a.name.localeCompare(b.name, 'tr'));

const tsContent = `export interface EmotionalDisease {
  name: string;
  cause: string;
  affirmation: string;
}

export const EMOTIONAL_DISEASES: EmotionalDisease[] = ${JSON.stringify(diseases, null, 2)};
`;

fs.writeFileSync('src/data/emotionalDiseases.ts', tsContent);
console.log('Saved ' + diseases.length + ' diseases.');
