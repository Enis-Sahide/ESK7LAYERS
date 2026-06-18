import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestNotificationPermissions, cancelAllNotifications, scheduleLocalNotification } from '@/src/services/Notifications';
import { getPlanetaryHours, getPlanetInfo } from '@/src/features/astrology/engine/PlanetaryHours';

export interface AlarmRule {
  id: string;
  planet: string; // 'Saturn' | 'Jupiter' | 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon'
  offsetMinutes: number; // e.g.: -5 (5 min before), 0 (Exactly), 5 (5 min after)
  repeatType: 'once' | 'always' | 'never' | 'weekday' | 'weekend' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  actionType: 'notify' | 'interaction';
  targetDate?: string; // Specific ISO date string if repeatType is 'once'
}

export const getAlarmRules = async (): Promise<AlarmRule[]> => {
  try {
    const data = await AsyncStorage.getItem('@alarm_rules');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveAlarmRules = async (rules: AlarmRule[]) => {
  await AsyncStorage.setItem('@alarm_rules', JSON.stringify(rules));
};

export const addAlarmRule = async (rule: Omit<AlarmRule, 'id'>) => {
  const rules = await getAlarmRules();
  const newRule: AlarmRule = {
    ...rule,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  };
  rules.push(newRule);
  await saveAlarmRules(rules);
  return newRule;
};

export const removeAlarmRule = async (id: string) => {
  let rules = await getAlarmRules();
  rules = rules.filter(r => r.id !== id);
  await saveAlarmRules(rules);
};

export const updateAlarmRule = async (id: string, updates: Partial<AlarmRule>) => {
  let rules = await getAlarmRules();
  rules = rules.map(r => r.id === id ? { ...r, ...updates } : r);
  await saveAlarmRules(rules);
};

export const refreshAllAlarms = async (lat: number, lon: number, tz: string) => {
  const hasPerm = await requestNotificationPermissions();
  if (!hasPerm) return [];

  // Clear existing scheduled notifications
  await cancelAllNotifications();

  // Load preferences
  const sQuiet = await AsyncStorage.getItem('@quiet_hours');
  const quiet = sQuiet === null ? true : sQuiet === 'true'; 

  // Load rules
  const rules = await getAlarmRules();
  if (rules.length === 0) {
    await AsyncStorage.setItem('@active_alarms', JSON.stringify([]));
    return [];
  }

  const newActiveAlarms: string[] = [];
  const updatedRules = [...rules];
  let rulesChanged = false;
  const now = Date.now();

  // Helper to check day match
  const isDayMatchingRepeat = (date: Date, repeatType: string): boolean => {
    const day = date.getDay(); // 0 is Sunday, 1 is Monday ...
    switch (repeatType) {
      case 'always':
        return true;
      case 'once':
        return true;
      case 'never':
        return false;
      case 'weekday':
        return day >= 1 && day <= 5;
      case 'weekend':
        return day === 0 || day === 6;
      case 'monday': return day === 1;
      case 'tuesday': return day === 2;
      case 'wednesday': return day === 3;
      case 'thursday': return day === 4;
      case 'friday': return day === 5;
      case 'saturday': return day === 6;
      case 'sunday': return day === 0;
      default:
        return false;
    }
  };

  // Helper to schedule notification
  const scheduleNotification = async (startTime: Date, planet: string, rule: AlarmRule) => {
    const triggerDate = new Date(startTime.getTime() + rule.offsetMinutes * 60000);
    
    if (triggerDate.getTime() <= now) return false;
    
    if (quiet) {
      const hourStr = triggerDate.getHours();
      if (hourStr >= 0 && hourStr < 7) return false;
    }

    const info = getPlanetInfo(planet);
    const offsetAbs = Math.abs(rule.offsetMinutes);
    let title = '';
    let body = '';

    if (rule.offsetMinutes < 0) {
      title = `${info.symbol} ${info.name} Saati Yaklaşıyor (${offsetAbs} dk)`;
      body = `${info.name} saati ${offsetAbs} dakika sonra başlayacak.`;
    } else if (rule.offsetMinutes === 0) {
      title = `${info.symbol} ${info.name} Saati Başladı!`;
      body = `${info.name} saati şu an başladı.`;
    } else {
      title = `${info.symbol} ${info.name} Saati Başlayalı ${offsetAbs} dk Oldu`;
      body = `${info.name} saati başlayalı ${offsetAbs} dakika geçti.`;
    }

    if (rule.actionType === 'interaction') {
      title = `✨ [Etkileşim] ${title}`;
      body = `${body} Bu saatin enerjisiyle uyumlanmak için uygulamayı açın.`;
    }

    const id = await scheduleLocalNotification(title, body, triggerDate, { ruleId: rule.id });
    if (id) {
      newActiveAlarms.push(startTime.toISOString());
      return true;
    }
    return false;
  };

  // Process next 7 days
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }

  for (const d of days) {
    const daily = getPlanetaryHours(d, lat, lon);
    for (const hour of daily.hours) {
      const matchingRules = updatedRules.filter(r => r.planet === hour.planet && r.repeatType !== 'never');
      
      for (const rule of matchingRules) {
        if (rule.repeatType === 'once') {
          if (rule.targetDate) {
            if (hour.startTime.toISOString() === rule.targetDate) {
              await scheduleNotification(hour.startTime, hour.planet, rule);
            }
          } else {
            const triggerTime = hour.startTime.getTime() + rule.offsetMinutes * 60000;
            if (triggerTime > now) {
              const scheduled = await scheduleNotification(hour.startTime, hour.planet, rule);
              if (scheduled) {
                rule.targetDate = hour.startTime.toISOString();
                rulesChanged = true;
              }
            }
          }
        } else {
          if (isDayMatchingRepeat(hour.startTime, rule.repeatType)) {
            await scheduleNotification(hour.startTime, hour.planet, rule);
          }
        }
      }
    }
  }

  // Cleanup past once rules
  for (let i = updatedRules.length - 1; i >= 0; i--) {
    const rule = updatedRules[i];
    if (rule.repeatType === 'once' && rule.targetDate) {
      const targetTime = new Date(rule.targetDate).getTime() + rule.offsetMinutes * 60000;
      if (now > targetTime) {
        updatedRules.splice(i, 1);
        rulesChanged = true;
      }
    }
  }

  if (rulesChanged) {
    await saveAlarmRules(updatedRules);
  }

  await AsyncStorage.setItem('@active_alarms', JSON.stringify(newActiveAlarms));
  return newActiveAlarms;
};
