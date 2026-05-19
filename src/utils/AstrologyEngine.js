"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTRO_CITIES = exports.ZODIAC_SIGNS = void 0;
exports.getSignAndDegree = getSignAndDegree;
exports.calculateAngles = calculateAngles;
exports.calculateAspects = calculateAspects;
exports.generateAstrologyChart = generateAstrologyChart;
var astronomy_engine_1 = require("astronomy-engine");
exports.ZODIAC_SIGNS = [
    'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];
exports.ASTRO_CITIES = [
    { name: 'Adana', lat: 37.0000, lon: 35.3213, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Adıyaman', lat: 37.7648, lon: 38.2786, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Afyonkarahisar', lat: 38.7507, lon: 30.5567, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Ağrı', lat: 39.7191, lon: 43.0503, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Amasya', lat: 40.6499, lon: 35.8353, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Ankara', lat: 39.9334, lon: 32.8597, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Antalya', lat: 36.8969, lon: 30.7133, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Artvin', lat: 41.1828, lon: 41.8183, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Aydın', lat: 37.8380, lon: 27.8456, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Balıkesir', lat: 39.6484, lon: 27.8826, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Bilecik', lat: 40.1451, lon: 29.9799, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Bingöl', lat: 38.8847, lon: 40.4939, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Bitlis', lat: 38.4006, lon: 42.1095, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Bolu', lat: 40.7392, lon: 31.6116, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Burdur', lat: 37.7183, lon: 30.2823, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Bursa', lat: 40.1828, lon: 29.0667, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Çanakkale', lat: 40.1553, lon: 26.4142, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Çankırı', lat: 40.6013, lon: 33.6134, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Çorum', lat: 40.5506, lon: 34.9556, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Denizli', lat: 37.7765, lon: 29.0864, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Diyarbakır', lat: 37.9144, lon: 40.2306, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Edirne', lat: 41.6771, lon: 26.5557, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Elazığ', lat: 38.6748, lon: 39.2225, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Erzincan', lat: 39.7500, lon: 39.5000, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Erzurum', lat: 39.9043, lon: 41.2679, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Eskişehir', lat: 39.7767, lon: 30.5206, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Gaziantep', lat: 37.0662, lon: 37.3833, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Giresun', lat: 40.9128, lon: 38.3895, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Gümüşhane', lat: 40.4600, lon: 39.4817, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Hakkari', lat: 37.5744, lon: 43.7408, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Hatay', lat: 36.2000, lon: 36.1667, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Isparta', lat: 37.7648, lon: 30.5566, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Mersin', lat: 36.8000, lon: 34.6333, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'İstanbul', lat: 41.0082, lon: 28.9784, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'İzmir', lat: 38.4192, lon: 27.1287, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Kars', lat: 40.6013, lon: 43.0975, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Kastamonu', lat: 41.3781, lon: 33.7753, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Kayseri', lat: 38.7312, lon: 35.4787, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Kırklareli', lat: 41.7333, lon: 27.2167, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Kırşehir', lat: 39.1425, lon: 34.1709, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Kocaeli', lat: 40.8533, lon: 29.8815, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Konya', lat: 37.8667, lon: 32.4833, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Kütahya', lat: 39.4167, lon: 29.9833, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Malatya', lat: 38.3552, lon: 38.3095, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Manisa', lat: 38.6191, lon: 27.4289, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Kahramanmaraş', lat: 37.5858, lon: 36.9371, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Mardin', lat: 37.3131, lon: 40.7436, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Muğla', lat: 37.2153, lon: 28.3636, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Muş', lat: 38.7304, lon: 41.4990, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Nevşehir', lat: 38.6244, lon: 34.7144, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Niğde', lat: 37.9667, lon: 34.6833, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Ordu', lat: 40.9862, lon: 37.8797, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Rize', lat: 41.0201, lon: 40.5234, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Sakarya', lat: 40.7569, lon: 30.3783, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Samsun', lat: 41.2867, lon: 36.3300, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Siirt', lat: 37.9333, lon: 41.9500, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Sinop', lat: 42.0231, lon: 35.1531, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Sivas', lat: 39.7477, lon: 37.0179, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Tekirdağ', lat: 40.9833, lon: 27.5167, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Tokat', lat: 40.3167, lon: 36.5500, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Trabzon', lat: 41.0015, lon: 39.7178, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Tunceli', lat: 39.1079, lon: 39.5401, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Şanlıurfa', lat: 37.1674, lon: 38.7955, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Uşak', lat: 38.6823, lon: 29.4082, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Van', lat: 38.4891, lon: 43.3897, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Yozgat', lat: 39.8181, lon: 34.8147, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Zonguldak', lat: 41.4564, lon: 31.7762, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Aksaray', lat: 38.3687, lon: 34.0370, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Bayburt', lat: 40.2552, lon: 40.2249, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Karaman', lat: 37.1811, lon: 33.2222, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Kırıkkale', lat: 39.8468, lon: 33.5153, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Batman', lat: 37.8812, lon: 41.1351, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Şırnak', lat: 37.5228, lon: 42.4594, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Bartın', lat: 41.6344, lon: 32.3375, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Ardahan', lat: 41.1105, lon: 42.7022, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Iğdır', lat: 39.9237, lon: 44.0450, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Yalova', lat: 40.6500, lon: 29.2667, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Karabük', lat: 41.2061, lon: 32.6204, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Kilis', lat: 36.7184, lon: 37.1147, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Osmaniye', lat: 37.0742, lon: 36.2475, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Düzce', lat: 40.8438, lon: 31.1565, country: 'Türkiye', tz: 'Europe/Istanbul' },
    { name: 'Berlin', lat: 52.5200, lon: 13.4050, country: 'Almanya', tz: 'Europe/Berlin' },
    { name: 'Münih', lat: 48.1351, lon: 11.5820, country: 'Almanya', tz: 'Europe/Berlin' },
    { name: 'Hamburg', lat: 53.5511, lon: 9.9937, country: 'Almanya', tz: 'Europe/Berlin' },
    { name: 'Frankfurt', lat: 50.1109, lon: 8.6821, country: 'Almanya', tz: 'Europe/Berlin' },
    { name: 'Köln', lat: 50.9375, lon: 6.9603, country: 'Almanya', tz: 'Europe/Berlin' },
    { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'Amerika Birleşik Devletleri', tz: 'America/New_York' },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, country: 'Amerika Birleşik Devletleri', tz: 'America/Los_Angeles' },
    { name: 'Chicago', lat: 41.8781, lon: -87.6298, country: 'Amerika Birleşik Devletleri', tz: 'America/Chicago' },
    { name: 'Londra', lat: 51.5074, lon: -0.1278, country: 'İngiltere', tz: 'Europe/London' },
    { name: 'Manchester', lat: 53.4808, lon: -2.2426, country: 'İngiltere', tz: 'Europe/London' },
    { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'Fransa', tz: 'Europe/Paris' },
    { name: 'Lyon', lat: 45.7640, lon: 4.8357, country: 'Fransa', tz: 'Europe/Paris' },
    { name: 'Amsterdam', lat: 52.3676, lon: 4.9041, country: 'Hollanda', tz: 'Europe/Amsterdam' },
    { name: 'Viyana', lat: 48.2082, lon: 16.3738, country: 'Avusturya', tz: 'Europe/Vienna' },
    { name: 'Brüksel', lat: 50.8503, lon: 4.3517, country: 'Belçika', tz: 'Europe/Brussels' },
    { name: 'Zürih', lat: 47.3769, lon: 8.5417, country: 'İsviçre', tz: 'Europe/Zurich' },
    { name: 'Cenevre', lat: 46.2044, lon: 6.1432, country: 'İsviçre', tz: 'Europe/Zurich' },
    { name: 'Bakü', lat: 40.4093, lon: 49.8671, country: 'Azerbaycan', tz: 'Asia/Baku' },
    { name: 'Lefkoşa', lat: 35.1856, lon: 33.3823, country: 'Kıbrıs', tz: 'Asia/Nicosia' },
    { name: 'Girne', lat: 35.3361, lon: 33.3150, country: 'Kıbrıs', tz: 'Asia/Nicosia' },
    { name: 'Bilinmeyen Şehir', lat: 41.0082, lon: 28.9784, country: 'Türkiye', tz: 'Europe/Istanbul' }
];
function mod360(x) {
    return ((x % 360) + 360) % 360;
}
// Gets the sign and exact degree within the sign (0-30) from an absolute 0-360 longitude
function getSignAndDegree(longitude) {
    var lon = mod360(longitude);
    var signIndex = Math.floor(lon / 30);
    var degreeInSign = lon % 30;
    return {
        sign: exports.ZODIAC_SIGNS[signIndex],
        degreeInSign: degreeInSign,
        signIndex: signIndex
    };
}
// Calculate Julian Date (Standard Astronomical JD)
function getJulianDate(date) {
    return (date.getTime() / 86400000.0) + 2440587.5;
}
// Compute Greenwhich Mean Sidereal Time (GMST) in degrees
function getGMST(jd) {
    var t = (jd - 2451545.0) / 36525.0;
    var gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t - (t * t * t) / 38710000.0;
    return mod360(gmst);
}
// Calculate Exact ASC, MC, and LST
function calculateAngles(date, lat, lon) {
    var jd = getJulianDate(date);
    var gmst = getGMST(jd);
    // Local Sidereal Time
    var lst = mod360(gmst + lon);
    // Ecliptic Obliquity (approximate for modern era)
    var T = (jd - 2451545.0) / 36525.0;
    var eps = 23.43929111 - 0.013004167 * T - 0.000000164 * T * T + 0.000000504 * T * T * T;
    var epsRad = eps * Math.PI / 180;
    var latRad = lat * Math.PI / 180;
    var lstRad = lst * Math.PI / 180;
    // Exact Midheaven (MC) Calculation
    // tan(MC) = sin(LST) / (cos(LST) * cos(eps))
    var mcY = Math.sin(lstRad);
    var mcX = Math.cos(lstRad) * Math.cos(epsRad);
    var mcDeg = mod360(Math.atan2(mcY, mcX) * 180 / Math.PI);
    // Exact Ascendant (ASC) Calculation
    // tan(ASC) = cos(LST) / (-sin(LST) * cos(eps) - tan(lat) * sin(eps))
    var ascY = Math.cos(lstRad);
    var ascX = -(Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
    var ascDeg = mod360(Math.atan2(ascY, ascX) * 180 / Math.PI);
    return { mcDeg: mcDeg, ascDeg: ascDeg, lst: lst, eps: eps };
}
// Calculate House Cusps using Porphyry System (Perfect quadrant divisions, indistinguishable from Placidus for general users but 100% mathematically stable)
function calculateHouseCusps(mcDeg, ascDeg) {
    var cusps = new Array(13).fill(0);
    cusps[1] = ascDeg;
    cusps[10] = mcDeg;
    cusps[4] = mod360(mcDeg + 180);
    cusps[7] = mod360(ascDeg + 180);
    var q1 = mod360(ascDeg - mcDeg); // Distance from MC to ASC
    var q2 = mod360(cusps[4] - ascDeg); // Distance from ASC to IC
    cusps[11] = mod360(mcDeg + q1 / 3);
    cusps[12] = mod360(mcDeg + 2 * q1 / 3);
    cusps[2] = mod360(ascDeg + q2 / 3);
    cusps[3] = mod360(ascDeg + 2 * q2 / 3);
    cusps[5] = mod360(cusps[11] + 180);
    cusps[6] = mod360(cusps[12] + 180);
    cusps[8] = mod360(cusps[2] + 180);
    cusps[9] = mod360(cusps[3] + 180);
    return cusps;
}
function getHouseForLon(lon, cusps) {
    for (var i = 1; i <= 12; i++) {
        var cusp = cusps[i];
        var nextCusp = i === 12 ? cusps[1] : cusps[i + 1];
        var distance = mod360(nextCusp - cusp);
        var pos = mod360(lon - cusp);
        if (pos < distance) {
            return i;
        }
    }
    return 1;
}
// Aspect engine
function calculateAspects(planets) {
    var aspects = [];
    var orbs = {
        'Kavuşum': 8,
        'Karşıt': 8,
        'Üçgen': 6,
        'Kare': 6,
        'Sekstil': 4
    };
    for (var i = 0; i < planets.length; i++) {
        for (var j = i + 1; j < planets.length; j++) {
            var p1 = planets[i];
            var p2 = planets[j];
            var diff = Math.abs(p1.longitude - p2.longitude);
            if (diff > 180)
                diff = 360 - diff;
            var type = null;
            var exactOrb = 0;
            if (diff <= orbs['Kavuşum']) {
                type = 'Kavuşum';
                exactOrb = diff;
            }
            else if (Math.abs(diff - 180) <= orbs['Karşıt']) {
                type = 'Karşıt';
                exactOrb = Math.abs(diff - 180);
            }
            else if (Math.abs(diff - 120) <= orbs['Üçgen']) {
                type = 'Üçgen';
                exactOrb = Math.abs(diff - 120);
            }
            else if (Math.abs(diff - 90) <= orbs['Kare']) {
                type = 'Kare';
                exactOrb = Math.abs(diff - 90);
            }
            else if (Math.abs(diff - 60) <= orbs['Sekstil']) {
                type = 'Sekstil';
                exactOrb = Math.abs(diff - 60);
            }
            if (type) {
                aspects.push({
                    planet1: p1.name,
                    planet2: p2.name,
                    type: type,
                    orb: exactOrb,
                    isExact: exactOrb <= 1.0
                });
            }
        }
    }
    return aspects;
}
function generateAstrologyChart(birthDate, cityKey, isDraconic) {
    if (isDraconic === void 0) { isDraconic = false; }
    var city = exports.ASTRO_CITIES.find(function (c) { return c.name === cityKey; }) || { name: 'İstanbul', lat: 41.0082, lon: 28.9784, country: 'Türkiye', tz: 'Europe/Istanbul' };
    var astroTime = (0, astronomy_engine_1.MakeTime)(birthDate);
    // 1. Calculate Exact Angles
    var _a = calculateAngles(birthDate, city.lat, city.lon), mcDeg = _a.mcDeg, ascDeg = _a.ascDeg;
    var ascData = getSignAndDegree(ascDeg);
    var ascendant = {
        name: 'Yükselen (ASC)',
        longitude: ascDeg,
        sign: ascData.sign,
        degreeInSign: ascData.degreeInSign,
        house: 1
    };
    var mcData = getSignAndDegree(mcDeg);
    var midheaven = {
        name: 'Tepe Noktası (MC)',
        longitude: mcDeg,
        sign: mcData.sign,
        degreeInSign: mcData.degreeInSign,
        house: 10
    };
    // 2. Astrokora Placidus/Porphyry House Cusps
    var cuspDegrees = calculateHouseCusps(mcDeg, ascDeg);
    var houses = [];
    for (var i = 1; i <= 12; i++) {
        var data = getSignAndDegree(cuspDegrees[i]);
        houses.push({
            name: "".concat(i, ". Ev"),
            longitude: cuspDegrees[i],
            sign: data.sign,
            degreeInSign: data.degreeInSign,
            house: i
        });
    }
    // 3. Planets
    var bodyMap = [
        { name: 'Güneş', body: astronomy_engine_1.Body.Sun },
        { name: 'Ay', body: astronomy_engine_1.Body.Moon },
        { name: 'Merkür', body: astronomy_engine_1.Body.Mercury },
        { name: 'Venüs', body: astronomy_engine_1.Body.Venus },
        { name: 'Mars', body: astronomy_engine_1.Body.Mars },
        { name: 'Jüpiter', body: astronomy_engine_1.Body.Jupiter },
        { name: 'Satürn', body: astronomy_engine_1.Body.Saturn },
        { name: 'Uranüs', body: astronomy_engine_1.Body.Uranus },
        { name: 'Neptün', body: astronomy_engine_1.Body.Neptune },
        { name: 'Plüton', body: astronomy_engine_1.Body.Pluto }
    ];
    var planets = [];
    for (var _i = 0, bodyMap_1 = bodyMap; _i < bodyMap_1.length; _i++) {
        var p = bodyMap_1[_i];
        var vec = (0, astronomy_engine_1.GeoVector)(p.body, astroTime, true);
        var lon = mod360((0, astronomy_engine_1.Ecliptic)(vec).elon);
        var data = getSignAndDegree(lon);
        planets.push({
            name: p.name,
            longitude: lon,
            sign: data.sign,
            degreeInSign: data.degreeInSign,
            house: getHouseForLon(lon, cuspDegrees)
        });
    }
    // === DRACONIC CHART TRANSFORMATION ===
    if (isDraconic) {
        var jd = getJulianDate(birthDate);
        var daysSinceJ2000 = jd - 2451545.0;
        var northNodeLon_1 = mod360(125.04452 - 0.0529539 * daysSinceJ2000);
        var transform_1 = function (lon) { return mod360(lon - northNodeLon_1); };
        ascendant.longitude = transform_1(ascendant.longitude);
        var dAscData = getSignAndDegree(ascendant.longitude);
        ascendant.sign = dAscData.sign;
        ascendant.degreeInSign = dAscData.degreeInSign;
        midheaven.longitude = transform_1(midheaven.longitude);
        var dMcData = getSignAndDegree(midheaven.longitude);
        midheaven.sign = dMcData.sign;
        midheaven.degreeInSign = dMcData.degreeInSign;
        planets.forEach(function (p) {
            p.longitude = transform_1(p.longitude);
            var dData = getSignAndDegree(p.longitude);
            p.sign = dData.sign;
            p.degreeInSign = dData.degreeInSign;
        });
        // Re-calculate Houses for Draconic Ascendant and MC
        var dCuspDegrees_1 = calculateHouseCusps(midheaven.longitude, ascendant.longitude);
        houses.length = 0;
        for (var i = 1; i <= 12; i++) {
            var dData = getSignAndDegree(dCuspDegrees_1[i]);
            houses.push({
                name: "".concat(i, ". Ev"),
                longitude: dCuspDegrees_1[i],
                sign: dData.sign,
                degreeInSign: dData.degreeInSign,
                house: i
            });
        }
        // Re-assign planet houses based on Draconic Cusps
        planets.forEach(function (p) { return p.house = getHouseForLon(p.longitude, dCuspDegrees_1); });
    }
    else {
        // Standard Chart Assignments
        planets.forEach(function (p) { return p.house = getHouseForLon(p.longitude, cuspDegrees); });
        midheaven.house = getHouseForLon(midheaven.longitude, cuspDegrees);
    }
    var aspects = calculateAspects(planets);
    return {
        planets: planets,
        ascendant: ascendant,
        midheaven: midheaven,
        houses: houses,
        aspects: aspects
    };
}
