const fs = require('fs');

async function parsePdf(inputFile, outputFile) {
    try {
        const pdfModule = await import('pdf-parse');
        const pdf = pdfModule.default || pdfModule;
        let dataBuffer = fs.readFileSync(inputFile);
        let data = await pdf(dataBuffer);
        fs.writeFileSync(outputFile, data.text);
        console.log(`Parsed ${inputFile} to ${outputFile}`);
    } catch (e) {
        console.error(`Error parsing ${inputFile}:`, e);
    }
}

(async () => {
    await parsePdf('run1.pdf', 'run1.txt');
    await parsePdf('run2.pdf', 'run2.txt');
})();
