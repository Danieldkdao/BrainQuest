import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { useAppUser } from './useAppUser';

const useNotifications = () => {
  const { userSettings } = useAppUser();
  
  const requestPermissionsAsync = async () => {
    if(!userSettings?.enableNotifications) return;
    const { status } = await Notifications.requestPermissionsAsync();
    if(status !== "granted"){
      Alert.alert("You need to enable notifications in your settings.");
      return false;
    }
    return true;
  }
  
  const scheduleDailyReminder = async () => {
    if (!userSettings?.enableNotifications) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🧠 Time for your daily brain puzzle!",
        body: "Open the app to keep your streak going.",
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      },
    });
  }

  return { requestPermissionsAsync, scheduleDailyReminder };
}

export default useNotifications;