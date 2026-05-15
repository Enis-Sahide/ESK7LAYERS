const gates = {
  64: { x: 142, y: 40 }, 61: { x: 150, y: 40 }, 63: { x: 158, y: 40 },
  47: { x: 142, y: 52 }, 24: { x: 150, y: 52 }, 4: { x: 158, y: 52 },
  17: { x: 146, y: 68 }, 11: { x: 154, y: 68 },
  43: { x: 150, y: 84 },
  62: { x: 140, y: 100 }, 23: { x: 150, y: 100 }, 56: { x: 160, y: 100 },
  16: { x: 135, y: 108 }, 35: { x: 165, y: 108 },
  20: { x: 135, y: 118 }, 12: { x: 165, y: 118 },
  31: { x: 135, y: 128 }, 45: { x: 165, y: 128 },
  8: { x: 145, y: 135 }, 33: { x: 155, y: 135 },
  7: { x: 145, y: 140 }, 1: { x: 150, y: 135 }, 13: { x: 155, y: 140 },
  10: { x: 132, y: 155 }, 25: { x: 168, y: 155 },
  15: { x: 145, y: 170 }, 46: { x: 155, y: 170 },
  2: { x: 150, y: 177 },
  21: { x: 185, y: 145 }, 51: { x: 175, y: 165 },
  26: { x: 175, y: 175 }, 40: { x: 195, y: 175 },
  5: { x: 140, y: 230 }, 14: { x: 150, y: 230 }, 29: { x: 160, y: 230 },
  34: { x: 135, y: 240 }, 59: { x: 165, y: 240 },
  27: { x: 140, y: 260 }, 3: { x: 150, y: 260 }, 9: { x: 160, y: 260 },
  53: { x: 140, y: 300 }, 60: { x: 150, y: 300 }, 52: { x: 160, y: 300 },
  54: { x: 135, y: 310 }, 19: { x: 165, y: 310 },
  38: { x: 135, y: 320 }, 39: { x: 165, y: 320 },
  58: { x: 135, y: 330 }, 41: { x: 165, y: 330 },
  48: { x: 55, y: 275 }, 57: { x: 65, y: 280 }, 44: { x: 75, y: 285 }, 50: { x: 85, y: 290 },
  32: { x: 80, y: 305 }, 28: { x: 70, y: 305 }, 18: { x: 60, y: 305 },
  36: { x: 215, y: 285 }, 22: { x: 225, y: 280 }, 37: { x: 235, y: 275 },
  6: { x: 215, y: 290 }, 49: { x: 225, y: 300 }, 55: { x: 235, y: 310 }, 30: { x: 245, y: 320 }
};

const centers = {
  Head: { x: 150, y: 35, shape: 'triangle', color: '#F4D03F', s: 22 },
  Ajna: { x: 150, y: 70, shape: 'triangle-down', color: '#A8D5BA', s: 22 },
  Throat: { x: 150, y: 115, shape: 'square', color: '#D2B48C', s: 20 },
  G: { x: 150, y: 175, shape: 'diamond', color: '#F4D03F', s: 24 },
  Heart: { x: 185, y: 160, shape: 'triangle', color: '#E63946', s: 18 },
  Sacral: { x: 150, y: 265, shape: 'square', color: '#E63946', s: 22 },
  Root: { x: 150, y: 335, shape: 'square', color: '#D2B48C', s: 22 },
  Spleen: { x: 60, y: 305, shape: 'triangle-left', color: '#D2B48C', s: 24 },
  SolarPlexus: { x: 240, y: 305, shape: 'triangle-right', color: '#D2B48C', s: 24 },
};

let og = '';
let oc = '';
for (let id in gates) {
  og += `${id}: { x: ${Math.round(gates[id].x * 1.13 - 18)}, y: ${Math.round(gates[id].y * 0.9 + 74)} }, `;
}
for (let id in centers) {
  const c = centers[id];
  oc += `${id}: { x: ${Math.round(c.x * 1.13 - 18)}, y: ${Math.round(c.y * 0.9 + 74)}, shape: '${c.shape}', color: '${c.color}', s: ${c.s} },\n  `;
}
console.log('GATES:', og);
console.log('CENTERS:\n  ' + oc);
