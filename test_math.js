function mod360(x) { return ((x % 360) + 360) % 360; }
function getJulianDate(date) { return (date.getTime() / 86400000.0) + 2440587.5; }
function getGMST(jd) {
    var d = jd - 2451545.0;
    var t = d / 36525.0;
    var gmst = 280.46061837 + 360.98564736629 * d + 0.000387933 * t * t - (t * t * t) / 38710000.0;
    return mod360(gmst);
}
var date = new Date(Date.UTC(1990, 0, 1, 10, 0, 0)); // Jan 1 1990, 10:00 UTC
var jd = getJulianDate(date);
var gmst = getGMST(jd);
var lon = 28.9784; // Istanbul
var lat = 41.0082;
var lst = mod360(gmst + lon);
var eps = 23.43929111;
var epsRad = eps * Math.PI / 180;
var latRad = lat * Math.PI / 180;
var lstRad = lst * Math.PI / 180;
var mcY = Math.sin(lstRad);
var mcX = Math.cos(lstRad) * Math.cos(epsRad);
var mcDeg = mod360(Math.atan2(mcY, mcX) * 180 / Math.PI);
var ascY = Math.cos(lstRad);
var ascX = -(Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
var ascDeg = mod360(Math.atan2(ascY, ascX) * 180 / Math.PI);
console.log({ jd: jd, gmst: gmst, lst: lst, mcDeg: mcDeg, ascDeg: ascDeg });
