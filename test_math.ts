function mod360(x: number) { return ((x % 360) + 360) % 360; }
function getJulianDate(date: Date): number { return (date.getTime() / 86400000.0) + 2440587.5; }
function getGMST(jd: number): number {
  const d = jd - 2451545.0;
  const t = d / 36525.0;
  let gmst = 280.46061837 + 360.98564736629 * d + 0.000387933 * t * t - (t * t * t) / 38710000.0;
  return mod360(gmst);
}
const date = new Date(Date.UTC(1990, 0, 1, 10, 0, 0)); // Jan 1 1990, 10:00 UTC
const jd = getJulianDate(date);
const gmst = getGMST(jd);
const lon = 28.9784; // Istanbul
const lat = 41.0082;
const lst = mod360(gmst + lon);

const eps = 23.43929111;
const epsRad = eps * Math.PI / 180;
const latRad = lat * Math.PI / 180;
const lstRad = lst * Math.PI / 180;

const mcY = Math.sin(lstRad);
const mcX = Math.cos(lstRad) * Math.cos(epsRad);
const mcDeg = mod360(Math.atan2(mcY, mcX) * 180 / Math.PI);

const ascY = Math.cos(lstRad);
const ascX = -(Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
const ascDeg = mod360(Math.atan2(ascY, ascX) * 180 / Math.PI);

console.log({ jd, gmst, lst, mcDeg, ascDeg });
