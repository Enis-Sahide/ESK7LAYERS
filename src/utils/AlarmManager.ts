import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestNotificationPermissions, cancelAllNotifications, scheduleLocalNotification } from '@/src/services/Notifications';
import { getPlanetaryHours, getPlanetInfo } from '@/src/features/astrology/engine/PlanetaryHours';

export const refreshAllAlarms = async (lat: number, lon: number, tz: string) => {
  const hasPerm = await requestNotificationPermissions();
  if (!hasPerm) return [];

  // Clear existing
  await cancelAllNotifications();

  // Load preferences
  const sMins = await AsyncStorage.getItem('@notify_minutes');
  const notifyMins = sMins ? parseInt(sMins) : 0;
  
  const sQuiet = await AsyncStorage.getItem('@quiet_hours');
  // Default to true if not explicitly false
  const quiet = sQuiet === null ? true : sQuiet === 'true'; 
  
  const sSub = await AsyncStorage.getItem('@subscribed_planets');
  const subscribedPlanets: string[] = sSub ? JSON.parse(sSub) : [];
  
  const sSingles = await AsyncStorage.getItem('@single_alarms');
  // Array of { iso: string, planet: string }
  let singleAlarms: { iso: string, planet: string }[] = sSingles ? JSON.parse(sSingles) : [];

  const newActiveAlarms: string[] = [];
  const validSingles: { iso: string, planet: string }[] = [];

  // Helper to schedule
  const schedule = async (startTime: Date, endTime: Date, planet: string) => {
    let triggerDate = new Date(startTime);
    triggerDate.setMinutes(triggerDate.getMinutes() - notifyMins);
    
    if (triggerDate.getTime() <= Date.now()) return false;
    
    const hourStr = triggerDate.getHours();
    if (quiet && (hourStr >= 0 && hourStr < 7)) return false;

    const info = getPlanetInfo(planet);
    const title = `${info.symbol} ${info.name} Saati ${notifyMins > 0 ? 'Yaklaşıyor!' : 'Başladı!'}`;
    const body = `Gezegen saati başladı!`;
    
    const id = await scheduleLocalNotification(title, body, triggerDate);
    if (id) {
      newActiveAlarms.push(startTime.toISOString());
      return true;
    }
    return false;
  };

  // 1. Process singles
  for (const alarm of singleAlarms) {
    const d = new Date(alarm.iso);
    // Rough estimate for end time since we don't have it, just add 1 hour
    const dEnd = new Date(d.getTime() + 60 * 60000); 
    const scheduled = await schedule(d, dEnd, alarm.planet);
    if (scheduled) {
      validSingles.push(alarm);
    }
  }

  // 2. Process subscribed planets for next 7 days
  if (subscribedPlanets.length > 0) {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }

    for (const d of days) {
      const daily = getPlanetaryHours(d, lat, lon);
      const allHours = daily.hours.filter(h => subscribedPlanets.includes(h.planet));
      
      for (const h of allHours) {
        // Avoid scheduling if it's already in singles (to prevent duplicates)
        if (!newActiveAlarms.includes(h.startTime.toISOString())) {
          await schedule(h.startTime, h.endTime, h.planet);
        }
      }
    }
  }

  // Save updated singles and active alarms
  await AsyncStorage.setItem('@single_alarms', JSON.stringify(validSingles));
  await AsyncStorage.setItem('@active_alarms', JSON.stringify(newActiveAlarms));

  return newActiveAlarms;
};

export const addSingleAlarm = async (iso: string, planet: string) => {
  const sSingles = await AsyncStorage.getItem('@single_alarms');
  let singleAlarms: { iso: string, planet: string }[] = sSingles ? JSON.parse(sSingles) : [];
  
  if (!singleAlarms.find(a => a.iso === iso)) {
    singleAlarms.push({ iso, planet });
    await AsyncStorage.setItem('@single_alarms', JSON.stringify(singleAlarms));
  }
};

export const removeSingleAlarm = async (iso: string) => {
  const sSingles = await AsyncStorage.getItem('@single_alarms');
  let singleAlarms: { iso: string, planet: string }[] = sSingles ? JSON.parse(sSingles) : [];
  
  singleAlarms = singleAlarms.filter(a => a.iso !== iso);
  await AsyncStorage.setItem('@single_alarms', JSON.stringify(singleAlarms));
};

export const subscribePlanet = async (planet: string) => {
  const sSub = await AsyncStorage.getItem('@subscribed_planets');
  const subscribedPlanets: string[] = sSub ? JSON.parse(sSub) : [];
  
  if (!subscribedPlanets.includes(planet)) {
    subscribedPlanets.push(planet);
    await AsyncStorage.setItem('@subscribed_planets', JSON.stringify(subscribedPlanets));
  }
};

export const unsubscribePlanet = async (planet: string) => {
  const sSub = await AsyncStorage.getItem('@subscribed_planets');
  let subscribedPlanets: string[] = sSub ? JSON.parse(sSub) : [];
  
  subscribedPlanets = subscribedPlanets.filter(p => p !== planet);
  await AsyncStorage.setItem('@subscribed_planets', JSON.stringify(subscribedPlanets));
};
