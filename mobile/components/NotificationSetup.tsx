import { useAppUser } from "@/hooks/useAppUser";
import useNotifications from "@/hooks/useNotifications";
import { useEffect } from "react";

const NotificationSetup = () => {
  const { userSettings } = useAppUser();
  const { requestPermissionsAsync, scheduleDailyReminder } = useNotifications();

  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await requestPermissionsAsync();
      if (hasPermission) {
        await scheduleDailyReminder();
      }
    };

    setupNotifications();
  }, [userSettings?.enableNotifications]);

  return null;
}

export default NotificationSetup