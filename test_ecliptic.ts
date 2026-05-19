import * as astro from 'astronomy-engine';

const date = new Date(Date.UTC(1990, 0, 1, 10, 0, 0));
const astroTime = astro.MakeTime(date);
const vec = astro.GeoVector(astro.Body.Sun, astroTime, true);

// Approach 1: Ecliptic (J2000)
const ecl1 = astro.Ecliptic(vec);
console.log("J2000:", ecl1.elon);

// Approach 2: True Equinox of Date
const rot1 = astro.Rotation_EQJ_EQD(astroTime);
const eqd = astro.RotateVector(rot1, vec);
const rot2 = astro.Rotation_EQD_ECL(astroTime);
const ecl = astro.RotateVector(rot2, eqd);
const sph = astro.SphereFromVector(ecl);
console.log("Date:", sph.lon);
