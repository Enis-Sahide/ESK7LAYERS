import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Origin, Horoscope } from "npm:circular-natal-horoscope-js@1.1.0";

function mod360(x: number) {
  return ((x % 360) + 360) % 360;
}

const ZODIAC_SIGNS = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];

function getSignAndDegree(longitude: number) {
  const lon = mod360(longitude);
  const signIndex = Math.floor(lon / 30);
  const decimalDegree = lon % 30;
  const degreeInSign = Math.floor(decimalDegree);
  const minutes = Math.floor((decimalDegree - degreeInSign) * 60);
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degreeInSign,
    minutes,
    signIndex
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { date, latitude, longitude, isDraconic } = await req.json();

    if (!date || latitude === undefined || longitude === undefined) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const birthDate = new Date(date);
    
    // 1. Calculate base horoscope
    const origin = new Origin({
      year: birthDate.getUTCFullYear(),
      month: birthDate.getUTCMonth() + 1,
      date: birthDate.getUTCDate(),
      hour: birthDate.getUTCHours(),
      minute: birthDate.getUTCMinutes(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });

    const horoscope = new Horoscope({
      origin,
      houseSystem: 'placidus',
      zodiac: 'tropical',
      aspectTypes: []
    });

    // We will return the raw computed positions so the frontend can merge it into the chart!
    // Since the frontend already calculates Sun, Moon, Mercury... flawlessly using astronomy-engine,
    // we only strictly NEED the Edge Function to provide Chiron and Lilith!

    const chironLon = horoscope.CelestialBodies?.chiron?.ChartPosition?.Ecliptic?.DecimalDegrees || 0;
    const isChironRetrograde = horoscope.CelestialBodies?.chiron?.isRetrograde || false;

    // Mean Lilith calculation
    const getJulianDate = (d: Date) => (d.getTime() / 86400000.0) + 2440587.5;
    const jd = getJulianDate(birthDate);
    const daysSinceJ2000 = jd - 2451545.0;
    const meanLilithLon = mod360(318.204710 + 0.11140353 * daysSinceJ2000);

    return new Response(JSON.stringify({
      chiron: {
        longitude: chironLon,
        isRetrograde: isChironRetrograde
      },
      lilith: {
        longitude: meanLilithLon,
        isRetrograde: false
      }
    }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
