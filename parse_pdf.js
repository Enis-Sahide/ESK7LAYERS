const fs = require('fs');
(async () => {
  const pdfModule = await import('pdf-parse');
  const pdf = pdfModule.default || pdfModule;
  console.log(typeof pdf, typeof pdf.PDFParse);
  let dataBuffer = fs.readFileSync('ÇAKRA.pdf');
  try {
    let data = await pdf(dataBuffer);
    fs.writeFileSync('cakra_text.txt', data.text);
    console.log("Success");
  } catch (e) {
    console.error(e);
  }
})();
