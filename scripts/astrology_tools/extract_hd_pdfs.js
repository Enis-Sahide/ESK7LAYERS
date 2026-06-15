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
    await parsePDF('Human_Design_İnsan_Tasarımı_Özünüzdeki_İnsanı_Keşfedin_Chetan_Parkyn.pdf', 'hd_book_1.txt');
    await parsePDF('Karen Curry - İnsan Tasarımını Anlamak.pdf', 'hd_book_2.txt');
})();
