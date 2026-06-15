const fs = require('fs');
const data = JSON.parse(fs.readFileSync('cakra.json/ÇAKRA.json', 'utf8'));

let text = '';
data.Pages.forEach(page => {
    page.Texts.forEach(t => {
        text += decodeURIComponent(t.R[0].T) + ' ';
    });
    text += '\n\n';
});

fs.writeFileSync('cakra_clean.txt', text);
console.log('Clean text written to cakra_clean.txt');
