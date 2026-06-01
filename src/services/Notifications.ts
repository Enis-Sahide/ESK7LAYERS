import { Platform } from 'react-native';

let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
} catch (e) {
  console.warn("expo-notifications native module not found.");
}

export const requestNotificationPermissions = async () => {
  if (Platform.OS === 'web' || !Notifications) return false;

  const perms = (await Notifications.getPermissionsAsync()) as any;
  let finalStatus = perms.granted || perms.status === 'granted';
  
  if (!finalStatus) {
    const request = (await Notifications.requestPermissionsAsync()) as any;
    finalStatus = request.granted || request.status === 'granted';
  }
  
  return finalStatus;
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  date: Date,
  data: any = {}
) => {
  if (!Notifications || date.getTime() <= Date.now()) return null;

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      // @ts-ignore
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });
    return id;
  } catch (e) {
    return null;
  }
};

export const cancelAllNotifications = async () => {
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {}
};

export const cancelNotification = async (identifier: string) => {
  if (!Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (e) {}
};
