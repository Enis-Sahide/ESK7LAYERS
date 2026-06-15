"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
var AstrologyEngine_1 = require("./src/utils/AstrologyEngine");
var date = new Date(Date.UTC(1990, 0, 1, 10, 0, 0)); // Jan 1 1990, 10:00 UTC
var chart = (0, AstrologyEngine_1.generateAstrologyChart)(date, 'İstanbul');
console.log("ASC:", chart.ascendant.sign, chart.ascendant.degreeInSign.toFixed(2), chart.ascendant.longitude.toFixed(2));
console.log("MC:", chart.midheaven.sign, chart.midheaven.degreeInSign.toFixed(2), chart.midheaven.longitude.toFixed(2));
console.log("Sun:", (_a = chart.planets.find(function (p) { return p.name === 'Güneş'; })) === null || _a === void 0 ? void 0 : _a.sign, (_b = chart.planets.find(function (p) { return p.name === 'Güneş'; })) === null || _b === void 0 ? void 0 : _b.degreeInSign.toFixed(2));
console.log("Moon:", (_c = chart.planets.find(function (p) { return p.name === 'Ay'; })) === null || _c === void 0 ? void 0 : _c.sign, (_d = chart.planets.find(function (p) { return p.name === 'Ay'; })) === null || _d === void 0 ? void 0 : _d.degreeInSign.toFixed(2));
for (var i = 0; i < 12; i++) {
    console.log("House ".concat(i + 1, ": ").concat(chart.houses[i].sign, " ").concat(chart.houses[i].degreeInSign.toFixed(2)));
}
