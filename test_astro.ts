import { generateAstrologyChart } from './src/utils/AstrologyEngine';

const date = new Date(Date.UTC(1990, 0, 1, 10, 0, 0)); // Jan 1 1990, 10:00 UTC
const chart = generateAstrologyChart(date, 'İstanbul');

console.log("ASC:", chart.ascendant.sign, chart.ascendant.degreeInSign.toFixed(2), chart.ascendant.longitude.toFixed(2));
console.log("MC:", chart.midheaven.sign, chart.midheaven.degreeInSign.toFixed(2), chart.midheaven.longitude.toFixed(2));
console.log("Sun:", chart.planets.find((p: any) => p.name === 'Güneş')?.sign, chart.planets.find((p: any) => p.name === 'Güneş')?.degreeInSign.toFixed(2));
console.log("Moon:", chart.planets.find((p: any) => p.name === 'Ay')?.sign, chart.planets.find((p: any) => p.name === 'Ay')?.degreeInSign.toFixed(2));

for (let i = 0; i < 12; i++) {
  console.log(`House ${i+1}: ${chart.houses[i].sign} ${chart.houses[i].degreeInSign.toFixed(2)}`);
}
