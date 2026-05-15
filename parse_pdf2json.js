const fs = require('fs');
const PDFParser = require("pdf2json");

function parsePDF(pdfPath, txtPath) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1);
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError) );
        pdfParser.on("pdfParser_dataReady", pdfData => {
            fs.writeFileSync(txtPath, pdfParser.getRawTextContent());
            console.log(`Successfully parsed ${pdfPath}`);
            resolve();
        });
        pdfParser.loadPDF(pdfPath);
    });
}

(async () => {
    await parsePDF('run1.pdf', 'run1.txt');
    await parsePDF('run2.pdf', 'run2.txt');
})();
