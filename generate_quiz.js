const fs = require('fs');

// Read emotionalDiseases.ts
const content = fs.readFileSync('src/data/emotionalDiseases.ts', 'utf8');

// Find the JSON part
const startIndex = content.indexOf('[');
const endIndex = content.lastIndexOf(']') + 1;
const jsonString = content.substring(startIndex, endIndex);

let diseases = [];
try {
  diseases = eval(jsonString); // eval because it's JS objects, not strict JSON (though it might be)
} catch (e) {
  console.log("Error parsing diseases:", e);
  process.exit(1);
}

// Shuffle diseases
for (let i = diseases.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [diseases[i], diseases[j]] = [diseases[j], diseases[i]];
}

// Select 50
const selected = diseases.slice(0, 50);
const allOtherNames = diseases.slice(50).map(d => d.name);

const questions = [];

selected.forEach((disease, index) => {
    // Generate 3 random wrong options
    const options = [disease.name];
    while(options.length < 4) {
        const randomName = allOtherNames[Math.floor(Math.random() * allOtherNames.length)];
        if (!options.includes(randomName)) {
            options.push(randomName);
        }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    const correctIndex = options.indexOf(disease.name);
    
    questions.push({
        id: `dh_50_${index + 1}`,
        question: `Ezoterik öğretilere göre aşağıdaki rahatsızlıklardan hangisinin zihinsel nedeni şudur: "${disease.cause}"?`,
        options: options,
        correctAnswerIndex: correctIndex,
        explanation: `Doğru cevap ${disease.name}. Olumlama Cümlesi: "${disease.affirmation}"`
    });
});

const quizExport = `import { Quiz } from './allQuizzes';

export const duygusalHastaliklarQuiz: Quiz = {
  id: "duygusal_hastaliklar_50",
  title: "Hastalıkların Duygusal Nedenleri",
  description: "Bedenin dili ve zihinsel blokajlar üzerine 50 soruluk geniş kapsamlı şifa sınavı.",
  questions: ${JSON.stringify(questions, null, 2)}
};
`;

fs.writeFileSync('src/data/duygusalHastaliklarQuiz.ts', quizExport);
console.log("Quiz successfully generated with 50 questions.");
